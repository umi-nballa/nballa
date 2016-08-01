package gwservices.pc.dm.api

uses gw.job.RenewalProcess
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.MigrationRecord
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.entitypopulators.Registry

uses java.util.Date

class DMRenewalAPI extends DMTransactionAPIBase {
  /// Logging prefix ///
  private static final var _LOG_TAG = "${DMRenewalAPI.Type.RelativeName} - "
  /** Prefix for conversion-on-renewal BasedOn entities */
  private static final var _COR_PREFIX = "cor:"
  private static final var _corValidationCodes = {
      CODE.MISSING_ACCOUNT, CODE.EXISTING_POLICY_FOUND, CODE.MISSING_PRODUCER,
      CODE.MISSING_PRODUCT, CODE.MISSING_EFFECTIVE_DATE
  } as CODE[]
  private static final var _standardValidationCodes = {
      CODE.MISSING_POLICY, CODE.INVALID_POLICY_STATE
  } as CODE[]
  construct(registry: Registry) {
    super(registry)
  }

  override function processRecordInternal(record: MigrationRecord, bundle: Bundle) {
    var renewal: Renewal = null
    switch (record.PayloadType) {
      case "ConversionOnRenewal":
          renewal = startConversionOnRenewal(record, bundle)
          break
      case "NewPolicyRenewal":
          renewal = startNewPolicyRenewal(record, bundle)
          break
      case "StandardRenewal":
          renewal = startStandardRenewal(record, bundle)
          break
      case "InProgressRenewal":
          renewal = startInProgressRenewal(record, bundle)
          break
    }
    record.ApplicationID = renewal.JobNumber
    updatePayload(record, renewal.LatestPeriod)
  }

  private function startConversionOnRenewal(record: MigrationRecord, bundle: Bundle): Renewal {
    var renewalProcess = createConversionRenewalProcess(record, true, bundle)
    return renewalProcess.Job
  }

  private function startNewPolicyRenewal(record: MigrationRecord, bundle: Bundle): Renewal {
    var renewalProcess = createConversionRenewalProcess(record, false, bundle)
    renewalProcess.requestQuote()
    checkValidQuote(renewalProcess.Job.LatestPeriod)
    renewalProcess.issueNow()
    return renewalProcess.Job
  }

  private function startStandardRenewal(record: MigrationRecord, bundle: Bundle): Renewal {
    var renewalProcess = createRenewalProcess(record, false, bundle)
    renewalProcess.requestQuote()
    checkValidQuote(renewalProcess.Job.LatestPeriod)
    renewalProcess.issueAutomatedRenewal()
    return renewalProcess.Job
  }

  private function startInProgressRenewal(record: MigrationRecord, bundle: Bundle): Renewal {
    var renewalProcess = createRenewalProcess(record, true, bundle)
    return renewalProcess.Job
  }

  /**
   * Create a "based on conversion policy term" based on external XML
   */
  private function createConversionRenewalProcess(record: MigrationRecord, startWorkflow: boolean,
                                                  bundle: Bundle): RenewalProcess {
    var model = record.PolicyPeriod
    model.$TypeInstance.validate(record, _corValidationCodes)
    var anAccount = bundle.add(model.$TypeInstance.AccountEntity)
    var product = model.$TypeInstance.ProductFromProductModel
    var producer = model.$TypeInstance.ProducerCodeEntity
    var transactionTimes = getTransactionTimes(record, null)
    // since job is not created until after "createConversionRenewalWithBasedOn" function call, defer population
    var job = model.Job
    var jobId = job.PublicID
    var basedOnEffective = job.MigrationJobInfo_Ext.BasedOnEffectiveDate
    var policyNumber = model.$TypeInstance.PolicyNumber
    model.Job = null
    model.EditEffectiveDate = null
    var renewal = getExistingJob(jobId, bundle) as Renewal
    var pubidEntities: List<EffDated>
    if (renewal == null) {
      if (basedOnEffective != null) {
        // need to avoid date out of range error while populating
        renewal = anAccount.createConversionRenewalWithBasedOn(basedOnEffective, transactionTimes.First, product,
            producer, policyNumber, \period -> {
              PopulatorUtil.CachedItems = {BaseEntityPopulator.POLICY_PERIOD_PROPERTY -> period}
              PopulatorUtil.populate(model, record, bundle)
              period.Policy.markIssued(period.PeriodStart)
              var ib = bundle.InsertedBeans
              pubidEntities = ib.where(\elt -> elt typeis EffDated and elt.PublicID.HasContent) as List<EffDated>
              // assume the effective dated entities have been populated from XML
              for (entity in pubidEntities) {
                entity.PublicID = _COR_PREFIX + entity.PublicID
              }
            }
        )
      } else {
        renewal = anAccount.createConversionRenewal(transactionTimes.First, product, producer, \period -> {
          PopulatorUtil.CachedItems = {BaseEntityPopulator.POLICY_PERIOD_PROPERTY -> period}
          PopulatorUtil.populate(model, record, bundle)
          period.Policy.markIssued(period.PeriodStart)
        }
        )
      }
    }
    // move the populated PublicIDs to the correct entity
    if (pubidEntities != null) {
      for (entity in pubidEntities) {
        for (eByType in bundle.getBeansByRootType(entity.IntrinsicType)) {
          if (eByType typeis EffDated and eByType.BasedOnUntyped == entity) {
            eByType.PublicID = entity.PublicID.remove(_COR_PREFIX)
          }
        }
      }
    }
    var renewalPeriod = renewal.LatestPeriod
    prepareTransaction(renewalPeriod)
    // if left within the populator block, resulting dates are wrong
    if (job != null) {
      PopulatorUtil.CachedItems = {BaseEntityPopulator.POLICY_PERIOD_PROPERTY -> renewalPeriod}
      PopulatorUtil.populate(job, record, bundle)
    }
    // reset term number, it is incremented in base code
    if (model.$TypeInstance.TermNumber != null) {
      renewalPeriod.TermNumber = model.TermNumber
    }
    return finalizeRenewal(model, transactionTimes.First, transactionTimes.Second, renewalPeriod, startWorkflow, bundle)
  }

  /**
   * Convenience. Create renewal process from existing policy
   */
  private function createRenewalProcess(record: MigrationRecord, startWorkflow: boolean,
                                        bundle: Bundle): RenewalProcess {
    var model = record.PolicyPeriod
    model.$TypeInstance.validate(record, _standardValidationCodes)
    var policy = model.$TypeInstance.PolicyEntity
    var renewal = getExistingJob(model.Job.PublicID, bundle) as Renewal
    if (renewal == null) {
      renewal = new Renewal(bundle)
      renewal.startJob(policy)
    }
    var transactionTimes = getTransactionTimes(record, policy.LatestPeriod)
    var renewalPeriod = renewal.LatestPeriod
    prepareTransaction(renewalPeriod)
    PopulatorUtil.CachedItems = {BaseEntityPopulator.POLICY_PERIOD_PROPERTY -> renewalPeriod}
    PopulatorUtil.populate(model, record, bundle)
    return finalizeRenewal(model, transactionTimes.First, transactionTimes.Second, renewalPeriod, startWorkflow, bundle)
  }

  /**
   * Shared processing of renewal jobs
   */
  private function finalizeRenewal(model: gwservices.pc.dm.gx.base.policy.policyperiodmodel.PolicyPeriod,
                                   effectiveTime: Date, expirationTime: Date, renewalPeriod: PolicyPeriod,
                                   startWorkflow: boolean, bundle: Bundle): RenewalProcess {
    renewalPeriod.setPeriodWindow(effectiveTime, expirationTime)
    if (model.$TypeInstance.PolicyNumber != null) {
      renewalPeriod.PolicyNumber = model.PolicyNumber
    }
    // configure migration entity
    this.addMigrationInfo(model.PolicyNumber, renewalPeriod.Policy)
    var renewalProcess = renewalPeriod.RenewalProcess
    if (renewalProcess == null) {
      var msg = "renewal process cannot be created for policy ${model.PolicyNumber}"
      throw new DataMigrationNonFatalException(CODE.MISSING_RENEWAL_PROCESS, msg)
    }
    renewalProcess.start(startWorkflow)
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "finalizeRenewal generated renewal ${renewalPeriod.Job.JobNumber}")
    }
    return renewalProcess
  }
}