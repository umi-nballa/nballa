package gwservices.pc.dm.api

uses gw.api.database.Query
uses gw.job.CancellationProcess
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.MigrationRecord
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.entitypopulators.Registry

class DMCancellationAPI extends DMTransactionAPIBase {
  private static final var _LOG_TAG = "${DMCancellationAPI.Type.RelativeName} - "
  private static final var _validationCodes = { CODE.MISSING_POLICY, CODE.INVALID_POLICY_STATE } as CODE[]
  construct(registry: Registry) {
    super(registry)
  }

  override function processRecordInternal(record: MigrationRecord, bundle: Bundle) {
    var period: PolicyPeriod = null
    switch (record.PayloadType) {
      case "StandardCancellation":
          period = startImmediateCancellation(record, bundle)
          break
      case "InProgressCancellation":
          period = startScheduledCancellation(record, bundle)
          break
      case "RescindCancellation":
          period = rescindCancellation(record, bundle)
          break
        default:
        throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_OPERATION, record.PayloadType as String)
    }
    record.ApplicationID = period.Job.JobNumber
    updatePayload(record, period)
  }

  /**
   * Cancel policy immediately
   */
  private function startImmediateCancellation(record: MigrationRecord, bundle: Bundle): PolicyPeriod {
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "startImmediateCancellation enter")
    }
    var cancellationProcess = createCancellationProcess(record, bundle)
    var latestPeriod = cancellationProcess.Job.LatestPeriod
    if (not latestPeriod.ValidQuote) {
      cancellationProcess.requestQuote()
    }
    checkValidQuote(latestPeriod)
    cancellationProcess.cancelImmediately()
    return cancellationProcess.Job.LatestPeriod
  }

  /**
   * Scheduled cancellation
   */
  private function startScheduledCancellation(record: MigrationRecord, bundle: Bundle): PolicyPeriod {
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "startScheduledCancellation enter")
    }
    var cancellationProcess = createCancellationProcess(record, bundle)
    cancellationProcess.scheduleCancellation(record.PolicyPeriod.EditEffectiveDate)
    return cancellationProcess.Job.LatestPeriod
  }

  /**
   * Rescind non-issued transaction
   */
  function rescindCancellation(record: MigrationRecord, bundle: Bundle): PolicyPeriod {
    if (_logger.DebugEnabled) _logger.debug("${_LOG_TAG} rescindCancellation()")
    var cancellationProcess = createCancellationProcess(record, bundle)
    var period = cancellationProcess.Job.LatestPeriod
    period.CancellationProcess.rescind()
    var wf = period.ActiveWorkflow
    if (wf != null and wf typeis CompleteCancellationWF and wf.State == "Active") {
      wf.remove()
    }
    return period
  }

  /**
   * Start a cancellation job
   */
  private function createCancellationProcess(record: MigrationRecord, bundle: Bundle): CancellationProcess {
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "createCancellationProcess enter")
    }
    var model = record.PolicyPeriod
    model.$TypeInstance.validate(record, _validationCodes)
    var policy = model.$TypeInstance.PolicyEntity
    var transactionTimes = getTransactionTimes(record, policy.LatestPeriod)
    var cancellation = getExistingJob(model.Job.PublicID, bundle) as Cancellation
    if (cancellation == null) {
      cancellation = PopulatorUtil.populate(model.Job.entity_Cancellation, record, bundle) as Cancellation
      cancellation.startJob(policy, transactionTimes.First, model.RefundCalcMethod)
    }
    prepareTransaction(cancellation.LatestPeriod)
    PopulatorUtil.CachedItems = {BaseEntityPopulator.POLICY_PERIOD_PROPERTY -> cancellation.LatestPeriod}
    PopulatorUtil.populate(model, record, bundle)
    cancellation.PolicyPeriod.CancellationProcess.requestQuote()
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "createCancellationProcess finish")
    }
    return cancellation.LatestPeriod.CancellationProcess
  }
}