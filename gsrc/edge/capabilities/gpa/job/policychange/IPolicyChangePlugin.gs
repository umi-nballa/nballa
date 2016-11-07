package edge.capabilities.gpa.job.policychange

uses edge.capabilities.gpa.job.policychange.dto.PolicyChangeDTO
uses java.util.Date

interface IPolicyChangePlugin {

  public function startPolicyChange(aPolicy : Policy, dto : PolicyChangeDTO) : PolicyChange
  public function getEffectiveDateForPolicyChange(aPolicy : Policy) : Date

}
