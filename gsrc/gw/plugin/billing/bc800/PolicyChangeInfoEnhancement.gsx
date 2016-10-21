package gw.plugin.billing.bc800

uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PolicyChangeInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PCContactInfo

@Export
enhancement PolicyChangeInfoEnhancement : PolicyChangeInfo
{
  function syncPolicyChange(period : PolicyPeriod){
    commonSync(period)
    var contactInfo = new PCContactInfo()
    contactInfo.sync( period.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact )
    this.PrimaryNamedInsuredContact.$TypeInstance = contactInfo  
    // PC-BC Integration: Mapping Alternate BillingContact and Mortgagee Loan Number
    if (period.BillingContact != null) {
      var altBillingContact = new PCContactInfo()
      altBillingContact.sync( period.BillingContact.AccountContactRole.AccountContact.Contact )
      this.AltBillingContact.$TypeInstance = altBillingContact
      this.MortgageeLoanNumber = PolicyInfoUtil.getMortgageeLoanNumber(period)
    }
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
