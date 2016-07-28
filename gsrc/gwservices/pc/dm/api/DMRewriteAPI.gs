package gwservices.pc.dm.api

uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.MigrationRecord
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.entitypopulators.Registry

uses java.util.Map

class DMRewriteAPI extends DMTransactionAPIBase {
  private static final var _LOG_TAG = "${DMRewriteAPI.Type.RelativeName} - "
  private static final var _validationCodes = { CODE.MISSING_POLICY, CODE.INVALID_POLICY_STATE } as CODE[]
  private static final var _rewriteType: Map<MigrationPayloadType_Ext, RewriteType> = {
      "FullTermRewrite" -> "RewriteFullTerm",
      "RemainderOfTermRewrite" -> "RewriteRemainderOfTerm",
      "NewTermRewrite" -> "RewriteNewTerm"
  }
  construct(registry: Registry) {
    super(registry)
  }

  override function processRecordInternal(record: MigrationRecord, bundle: Bundle) {
    var model = record.PolicyPeriod
    model.$TypeInstance.validate(record, _validationCodes)
    var rewriteType = _rewriteType.get(record.PayloadType)
    if (rewriteType == null) {
      throw new DataMigrationNonFatalException(CODE.INVALID_REWRITE_TYPE, record.PayloadType as String)
    }
    var policy = model.$TypeInstance.PolicyEntity
    var cancelPeriod = policy.LatestPeriod
    if (cancelPeriod == null or cancelPeriod.Job.Subtype != "Cancellation") {
      throw new DataMigrationNonFatalException(CODE.MISSING_JOB_CANCELLATION, "Policy Number ${model.PolicyNumber}")
    }
    var transactionTimes = getTransactionTimes(record, cancelPeriod)
    var rewrite = getExistingJob(model.Job.PublicID, bundle) as Rewrite
    if (rewrite == null) {
      rewrite = new Rewrite(bundle)
      rewrite.startJob(policy, transactionTimes.First, transactionTimes.Second)
    }
    rewrite.RewriteType = rewriteType
    var branch = rewrite.LatestPeriod
    prepareTransaction(branch)
    PopulatorUtil.CachedItems = {BaseEntityPopulator.POLICY_PERIOD_PROPERTY -> rewrite.LatestPeriod}
    PopulatorUtil.populate(model, record, bundle)
    var process = branch.RewriteProcess
    process.requestQuote()
    checkValidQuote(branch)
    process.issueJob(true)
    record.ApplicationID = rewrite.JobNumber
  }
}