package edge.capabilities.gpa.policy

uses edge.capabilities.gpa.policy.dto.PolicySummaryDTO
uses edge.di.annotations.ForAllGwNodes
uses java.lang.Exception
uses gw.plugin.billing.BillingPeriodInfo
uses gw.plugin.billing.IBillingSummaryPlugin
uses gw.plugin.Plugins
uses edge.capabilities.currency.dto.AmountDTO

class DefaultPolicySummaryPlugin implements IPolicySummaryPlugin {

  private var _policyLinePlugin : IPolicyLinePlugin
  private var _billingSummaryPlugin : IBillingSummaryPlugin

  @ForAllGwNodes
  @Param("aPolicyLinePlugin", "Plugin used to handle policyline conversion")
  construct(aPolicyLinePlugin : IPolicyLinePlugin){
    _policyLinePlugin = aPolicyLinePlugin
    this._billingSummaryPlugin = Plugins.get(IBillingSummaryPlugin)
  }

  override function toDTO(aPolicyPeriod: PolicyPeriod, checkDelinquency : boolean): PolicySummaryDTO {
    if (aPolicyPeriod == null){
      return null
    }

    final var dto = new PolicySummaryDTO()
    dto.PolicyNumber = aPolicyPeriod.PolicyNumber
    dto.PrimaryInsuredName = aPolicyPeriod.PrimaryInsuredName
    dto.Effective = aPolicyPeriod.EditEffectiveDate
    dto.Expiration = aPolicyPeriod.PeriodEnd
    dto.PolicyLines = _policyLinePlugin.getPolicyLines(aPolicyPeriod)
    dto.DisplayStatus = aPolicyPeriod.PeriodDisplayStatus
    dto.isCancelled = aPolicyPeriod.CancellationDate != null
    dto.isIssued = aPolicyPeriod.Policy.Issued
    dto.CanUserView = perm.PolicyPeriod.view(aPolicyPeriod)
    dto.ProducerCodeOfRecord = aPolicyPeriod.ProducerCodeOfRecord.Code
    dto.ProducerCodeOfService = aPolicyPeriod.Policy.ProducerCodeOfService.Code
    dto.CreatedByMe = aPolicyPeriod.CreateUser == User.util.CurrentUser
    dto.Premium = AmountDTO.fromMonetaryAmount(aPolicyPeriod.TotalPremiumRPT)
    dto.AccountNumber = aPolicyPeriod.Policy.Account.AccountNumber
    dto.AccountHolderName = aPolicyPeriod.Policy.Account.AccountHolderContact.DisplayName

    if(checkDelinquency){
        try{
          dto.Delinquent = getPolicyPeriodBillingInfo(aPolicyPeriod.PolicyNumber, aPolicyPeriod.TermNumber).Delinquent
        }catch(ex : Exception){
          dto.Delinquent = false
        }
    }else{
        dto.Delinquent = false
    }

    return dto
  }

  override function toDTOArray(policies: Policy[], checkDelinquency : boolean): PolicySummaryDTO[] {
    if(policies != null && policies.HasElements){
      return policies.sortByDescending(\aPolicy -> aPolicy.CreateTime).map( \ aPolicy -> toDTO(aPolicy.LatestPeriod, checkDelinquency))
    }

    return null
  }

  protected function getPolicyPeriodBillingInfo(policyNumber : String, termNumber : int) : BillingPeriodInfo{
    return _billingSummaryPlugin.retrievePolicyBillingSummary(policyNumber, termNumber) as BillingPeriodInfo
  }
}
