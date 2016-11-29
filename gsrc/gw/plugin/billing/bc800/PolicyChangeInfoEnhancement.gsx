package gw.plugin.billing.bc800

uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PolicyChangeInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PCContactInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.anonymous.elements.PolicyChangeInfo_PolicyAdditionalInterests

@Export
enhancement PolicyChangeInfoEnhancement : PolicyChangeInfo
{
  function syncPolicyChange(period : PolicyPeriod){
    commonSync(period)
    var contactInfo = new PCContactInfo()
    contactInfo.sync( period.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact )
    this.PrimaryNamedInsuredContact.$TypeInstance = contactInfo  
    // PC-BC Integration: Mapping Policy Additional Interests
    PolicyInfoUtil.retrieveAdditionalInterests(period)?.each( \ addlInt -> {
      var pcContactInfo = new PCContactInfo()
      pcContactInfo.sync(addlInt.PolicyAddlInterest.ContactDenorm)
      pcContactInfo.LoanNumber = addlInt.ContractNumber

      var element = new PolicyChangeInfo_PolicyAdditionalInterests()
      element.$TypeInstance = pcContactInfo
      this.PolicyAdditionalInterests.add(element)
    })
  }

  function syncPolicyChangeForPreview(period : PolicyPeriod){
    commonSync(period)  
  }
  
  private function commonSync(period : PolicyPeriod){
    this.syncBasicPolicyInfo( period )
    this.Description = period.PolicyChange.Description
    this.JurisdictionCode = period.BaseState.Code
    this.PeriodStart = period.PeriodStart.XmlDateTime
    this.PeriodEnd = period.PeriodEnd.XmlDateTime
  }
}
