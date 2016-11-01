package edge.capabilities.gpa.job.cancellation

uses edge.capabilities.gpa.job.JobHandler
uses edge.jsonrpc.IRpcHandler
uses edge.capabilities.gpa.job.dto.JobDTO
uses edge.capabilities.helpers.JobUtil
uses edge.jsonrpc.annotation.JsonRpcRunAsInternalGWUser
uses edge.jsonrpc.annotation.JsonRpcMethod
uses java.util.Date
uses edge.capabilities.helpers.PolicyUtil
uses edge.di.annotations.InjectableNode
uses edge.capabilities.gpa.job.cancellation.dto.CancellationDTO
uses edge.capabilities.gpa.job.IJobPlugin

class CancellationHandler extends JobHandler implements IRpcHandler {

  var _jobPlugin : IJobPlugin
  var _cancellationPlugin : ICancellationPlugin
  var _jobHelper : JobUtil
  var _policyHelper : PolicyUtil

  @InjectableNode
  construct(aJobPlugin : IJobPlugin, aCancellationPlugin : ICancellationPlugin, aJobHelper : JobUtil, aPolicyHelper : PolicyUtil){
    super(aJobPlugin, aJobHelper)

    this._jobPlugin = aJobPlugin
    this._cancellationPlugin = aCancellationPlugin
    this._jobHelper = aJobHelper
    this._policyHelper = aPolicyHelper
  }

  override function findJobByJobNumber(jobNumber: String): JobDTO {
    return null
  }

  /**
   * Get refund calculation methods applicable to the given policy under given cancellation job details.
   *
   * <dl>
   *   <dt>Calls:</dt>
   * <dd> <code>PolicyUtil#getPolicyByPolicyNumber(java.lang.String)</code> - To retrieve a Policy by its PolicyNumber</dd>
   * <dd> <code>ICancellationPlugin#getValidRefundMethods(Policy, CancellationDTO)</code> - To retrieve the refund methods</dd>
   * </dl>
   * @param   policyNumber      A string Policy Number to search the policy by
   * @param   tempCancellation  Temporary Cancellation job details
   * @returns a list of CalculationMethods
   */
  @JsonRpcRunAsInternalGWUser
  @JsonRpcMethod
  function getValidRefundMethods(policyNumber: String, tempCancellation : CancellationDTO): CalculationMethod[] {
    var policy = _policyHelper.getPolicyByPolicyNumber(policyNumber)

    return _cancellationPlugin.getValidRefundMethods(policy, tempCancellation)
  }

  /**
   * Get a default effective cancellation date.
   *
   * <dl>
   *   <dt>Calls:</dt>
   * <dd> <code>PolicyUtil#getPolicyByPolicyNumber(java.lang.String)</code> - To retrieve a Policy by its PolicyNumber</dd>
   * <dd> <code>ICancellationPlugin#getEffectiveDateForCancellation(Policy, CancellationDTO)</code> - To calculate the default effective date</dd>
   * </dl>
   * @param   policyNumber      Policy Number string
   * @param   tempCancellation  Temporary Cancellation job details
   * @returns An effective date for a cancellation
   */
  @JsonRpcRunAsInternalGWUser
  @JsonRpcMethod
  function getEffectiveDateForCancellation(policyNumber: String, tempCancellation : CancellationDTO): Date {
    var policy = _policyHelper.getPolicyByPolicyNumber(policyNumber)

    return _cancellationPlugin.getEffectiveDateForCancellation(policy, tempCancellation)
  }

}
