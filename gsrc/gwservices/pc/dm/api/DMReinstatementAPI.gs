package gwservices.pc.dm.api

uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.MigrationRecord
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.entitypopulators.Registry

/**
 * Migration reinstatement
 */
class DMReinstatementAPI extends DMTransactionAPIBase {
  private static final var _LOG_TAG = "${DMReinstatementAPI.Type.RelativeName} - "
  private static final var _validationCodes = { CODE.MISSING_POLICY, CODE.INVALID_POLICY_STATE } as CODE[]
  construct(registry: Registry) {
    super(registry)
  }

  public override function processRecordInternal(record: MigrationRecord, bundle: Bundle) {
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "DMReinstatementAPI.processRecordInternal() enter")
    }
    var model = record.PolicyPeriod
    model.$TypeInstance.validate(record, _validationCodes)
    var reinstatement = getExistingJob(model.Job.PublicID, bundle) as Reinstatement
    var startJob = false
    if (reinstatement == null) {
      reinstatement = PopulatorUtil.populate(model.Job.entity_Reinstatement, record, bundle) as Reinstatement
      startJob = true
    }
    var cancelPeriod = model.$TypeInstance.PolicyEntity.LatestPeriod
    if (cancelPeriod == null or cancelPeriod.Job.Subtype != "Cancellation") {
      throw new DataMigrationNonFatalException(CODE.MISSING_JOB_CANCELLATION, "Policy Number ${model.PolicyNumber}")
    }
    cancelPeriod = bundle.add(cancelPeriod)
    _logger.info(_LOG_TAG + "Period start is ${cancelPeriod.PeriodStart} and end is ${cancelPeriod.PeriodEnd}")
    prepareTransaction(reinstatement.LatestPeriod)
    if (startJob) {
      reinstatement.startJob(cancelPeriod)
    }
    var latestPeriod = reinstatement.LatestPeriod
    PopulatorUtil.CachedItems = {BaseEntityPopulator.POLICY_PERIOD_PROPERTY -> latestPeriod}
    PopulatorUtil.populate(model, record, bundle)
    latestPeriod.setPeriodWindow(cancelPeriod.PeriodStart, cancelPeriod.PeriodEnd)
    latestPeriod.ReinstatementProcess.requestQuote()
    checkValidQuote(latestPeriod)
    latestPeriod.ReinstatementProcess.issueJob(true)
    record.ApplicationID = reinstatement.JobNumber
    updatePayload(record, latestPeriod)
  }
}