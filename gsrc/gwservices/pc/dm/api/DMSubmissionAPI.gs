package gwservices.pc.dm.api

uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.batch.MigrationRecord
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.entitypopulators.Registry

/**
 * Submission creation code
 */
class DMSubmissionAPI extends DMTransactionAPIBase {
  /// Logging prefix ///
  private static final var _LOG_TAG = "${DMSubmissionAPI.Type.RelativeName} - "
  private static final var _validationCodes = {
      CODE.MISSING_ACCOUNT, CODE.EXISTING_POLICY_FOUND, CODE.MISSING_PRODUCER,
      CODE.MISSING_PRODUCT, CODE.MISSING_EFFECTIVE_DATE
  } as CODE[]
  construct(registry: Registry) {
    super(registry)
  }

  /**
   * Start a draft submission in PolicyCenter. The policy data is passed
   * in as policyPeriodData string which will be parsed by PopulatorPlugin. OOTB, policyPeriodData
   * is xml format, follow Guidewire's GX model schema and parsed by ExamplePopulatorPlugin
   * implementation.
   */
  override function processRecordInternal(record: MigrationRecord, bundle: Bundle) {
    var model = record.PolicyPeriod
    model.$TypeInstance.validate(record, _validationCodes)
    var anAccount = bundle.add(model.$TypeInstance.AccountEntity)
    var transactionTimes = getTransactionTimes(record, null)
    var product = model.$TypeInstance.ProductFromProductModel
    var producer = model.$TypeInstance.ProducerCodeEntity
    if (_logger.isDebugEnabled()) {
      var msg = "account ${anAccount}, effectiveTime ${transactionTimes.First}, product ${product}, producer ${producer}"
      _logger.debug(_LOG_TAG + msg)
    }
    var submission = getExistingJob(model.Job.PublicID, bundle) as Submission
    if (submission == null) {
      submission = anAccount.createSubmission(transactionTimes.First, product, producer, \period -> {
        PopulatorUtil.CachedItems = {BaseEntityPopulator.POLICY_PERIOD_PROPERTY -> period}
        PopulatorUtil.populate(model, record, bundle)
      })
    } else {
      PopulatorUtil.CachedItems = {BaseEntityPopulator.POLICY_PERIOD_PROPERTY -> submission.LatestPeriod}
      PopulatorUtil.populate(model, record, bundle)
    }
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "processRecordInternal generated submission ${submission.JobNumber} ")
    }
    var policyPeriod = submission.LatestPeriod
    prepareTransaction(policyPeriod)
    // calculate submission times with plug-ins
    policyPeriod.setPeriodWindow(transactionTimes.First, transactionTimes.Second)
    // configure migration entity
    this.addMigrationInfo(model.PolicyNumber, policyPeriod.Policy)
    // term number is incremented in quote process
    if (model.$TypeInstance.TermNumber != null) {
      policyPeriod.TermNumber = model.TermNumber - 1
    }
    policyPeriod.SubmissionProcess.requestQuote()
    checkValidQuote(policyPeriod)
    policyPeriod.SubmissionProcess.issue()
    record.ApplicationID = policyPeriod.Job.JobNumber
    updatePayload(record, policyPeriod)
  }
}
