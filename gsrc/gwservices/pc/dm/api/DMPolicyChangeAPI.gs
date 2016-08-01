package gwservices.pc.dm.api

uses gw.pl.persistence.core.Bundle
uses gw.plugin.Plugins
uses gw.plugin.policy.IPolicyPlugin
uses gwservices.pc.dm.batch.MigrationRecord
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.entitypopulators.Registry

class DMPolicyChangeAPI extends DMTransactionAPIBase {
  /// Logging prefix ///
  private static final var _LOG_TAG = "${DMPolicyChangeAPI.Type.RelativeName} - "
  /** Validation checks against the model */
  private static final var _validationCodes = { CODE.MISSING_POLICY, CODE.INVALID_POLICY_STATE } as CODE[]
  construct(registry: Registry) {
    super(registry)
  }

  override function processRecordInternal(record: MigrationRecord, bundle: Bundle) {
    var model = record.PolicyPeriod
    model.$TypeInstance.validate(record, _validationCodes)
    var policyPlugin = Plugins.get(IPolicyPlugin)
    var policy = model.$TypeInstance.PolicyEntity
    var transactionTimes = getTransactionTimes(record, policy.LatestPeriod)
    var error = policyPlugin.canStartPolicyChange(policy, transactionTimes.First)
    var policyChange = getExistingJob(model.Job.PublicID, bundle) as PolicyChange
    if (policyChange == null) {
      policyChange = new PolicyChange(bundle)
      policyChange.startJob(policy, transactionTimes.First)
    }
    var branch = policyChange.LatestPeriod
    prepareTransaction(branch)
    var process = branch.PolicyChangeProcess
    PopulatorUtil.CachedItems = {BaseEntityPopulator.POLICY_PERIOD_PROPERTY -> policyChange.LatestPeriod}
    PopulatorUtil.populate(model, record, bundle)
    process.requestQuote()
    checkValidQuote(branch)
    process.bind()
    record.ApplicationID = policyChange.JobNumber
    updatePayload(record, branch)
  }
}