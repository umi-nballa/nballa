package edge.capabilities.policychange

uses edge.di.annotations.ForAllGwNodes
uses java.util.Date
uses edge.security.authorization.IAuthorizerProviderPlugin
uses edge.security.authorization.Authorizer
uses edge.jsonrpc.exception.JsonRpcInvalidRequestException
uses edge.capabilities.policychange.util.PolicyChangeUtil

/**
 * Default implementation for the {@link IPolicyChangeRetrievalPlugin}.
 *
 * @see {@link #retrieveByPolicyNumber(String)} for the details of this implementation.
 */
class DefaultPolicyChangeRetrievalPlugin implements IPolicyChangeRetrievalPlugin {
  /**
   * The PolicyPeriod authorizer used to check access to a policy period.
   */
  var _policyPeriodAuthorizer : Authorizer<PolicyPeriod> as readonly PolicyPeriodAuthorizer

  @ForAllGwNodes
  construct(authorizerProvider:IAuthorizerProviderPlugin) {
    _policyPeriodAuthorizer = authorizerProvider.authorizerFor(PolicyPeriod)
  }

  /**
   * {@inheritDoc}
   *
   * This implementation disallows policy changes when any of the following conditions are met
   *  - The current user is not authorized to access the policy period, as determined by the authorizer provided
   *    passed into the constructor
   *  - There is more than one policy change transaction pending.
   *  - There is any pending transaction of the following types: Rewrite, RewriteNewAccount, Cancellation
   *    or Reinstatement.
   *  - The policy is not cancelled and has not been rewritten to a different account.
   *
   *  The returned policy period will be:
   *   - The one associated to the single pending policy change transaction, if there is one.
   *   - The current policy period for the policy as of todaw, if there is no pending policy change transaction.
   */
  override function retrieveByPolicyNumber(policyNumber:String) : PolicyPeriod {
    var endOfSelectedDate = gw.api.util.DateUtil.endOfDay(Date.Today)
    var policyPeriod = entity.Policy.finder.findMostRecentBoundPeriodByPolicyNumber(policyNumber)

    if ( policyPeriod == null || !PolicyPeriodAuthorizer.canAccess(policyPeriod)) {
      throw new JsonRpcInvalidRequestException(){:Message = "Cannot find the policy policy"}
    }

    var errorMsg = PolicyChangeUtil.checkPolicyChangeCanBeStarted(policyPeriod.Policy)
    if ( errorMsg != null ) {
      throw new JsonRpcInvalidRequestException() { : Message = errorMsg }
    }


    var changeJobs = policyPeriod.Policy.OpenJobs.whereTypeIs(PolicyChange)
    if ( changeJobs.HasElements ) {
      policyPeriod = changeJobs.first().LatestPeriod // checkCanBeChanged ensures that there is only one active change job
    }
    return policyPeriod
  }

  /**
   *  A helper function to retrieve a PolicyPeriod using a Job number
   *
   */
  override function retrieveByJobNumber(jobNumber:String) : PolicyPeriod {
    var job = Job.finder.findJobByJobNumber(jobNumber)
    return this.retrieveByPolicyNumber(job.SelectedVersion.PolicyNumber)
  }
}
