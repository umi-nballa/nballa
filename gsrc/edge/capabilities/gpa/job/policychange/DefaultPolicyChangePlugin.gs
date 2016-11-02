package edge.capabilities.gpa.job.policychange

uses edge.capabilities.gpa.job.policychange.dto.PolicyChangeDTO
uses edge.di.annotations.ForAllGwNodes
uses java.lang.Exception
uses java.lang.IllegalArgumentException
uses java.util.Date
uses edge.PlatformSupport.Bundle

class DefaultPolicyChangePlugin implements IPolicyChangePlugin {

  @ForAllGwNodes
  construct(){}

  override function startPolicyChange(aPolicy: Policy, dto: PolicyChangeDTO): PolicyChange {
    if (aPolicy == null){
      throw new IllegalArgumentException("Policy must not be null.")
    }

    final var canStartPolicyChange = aPolicy.canStartPolicyChange(dto.EffectiveDate)
    if (aPolicy != null && canStartPolicyChange == null){
      final var latestPeriod = aPolicy.LatestPeriod
      if (perm.PolicyPeriod.change(latestPeriod) and aPolicy.Issued){
        var job = new PolicyChange()
        job.Description = dto.Description
        job.startJob(aPolicy, dto.EffectiveDate)

        return job
      }
    }
    throw new Exception(displaykey.Web.PolicyChange.StartPolicyChange.Error(canStartPolicyChange))
  }

  override function getEffectiveDateForPolicyChange(aPolicy: Policy): Date {
    final var aPolicyChange = new PolicyChange()
    final var latestPeriod = aPolicy.LatestPeriod
    final var effectiveDate = gw.web.job.policychange.StartPolicyChangeUIHelper.applyEffectiveTimePluginForPolicyChange(latestPeriod, aPolicyChange, latestPeriod.EditEffectiveDate)
    final var bundle = Bundle.getCurrent()

    bundle.delete(aPolicyChange)

    if (effectiveDate.before(Date.CurrentDate)) {
      return Date.CurrentDate;
    }

    return effectiveDate
  }
}
