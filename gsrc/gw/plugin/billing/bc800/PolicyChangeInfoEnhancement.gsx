package gw.plugin.billing.bc800

uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PolicyChangeInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PCContactInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.anonymous.elements.PolicyChangeInfo_PolicyAdditionalInterests
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PolicyRiskAddress
uses wsi.remote.gw.webservice.bc.bc800.entity.anonymous.elements.PolicyChangeInfo_CatastropheDetails
uses wsi.remote.gw.webservice.bc.bc800.entity.anonymous.elements.PolicyRiskAddress_Address

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

    // PC-BC Integration: Mapping Policy Risk Address
    PolicyInfoUtil.retrieveRiskAddress(period)?.each( \ riskDetail -> {
      var policyRiskDetail = new PolicyRiskAddress()
      if(riskDetail.AccountLocation.LocationName != null){
        policyRiskDetail.LocationName = riskDetail.AccountLocation.LocationName
      } else{
        policyRiskDetail.LocationName = riskDetail.AccountLocation.LocationNum
      }
        var addressInfo = new PolicyRiskAddress_Address()
        addressInfo.AddressLine1 = riskDetail.AddressLine1
        addressInfo.AddressLine2 = riskDetail.AddressLine2
        addressInfo.AddressLine1Kanji = riskDetail.AddressLine1Kanji
        addressInfo.AddressLine2Kanji = riskDetail.AddressLine2Kanji
        addressInfo.City = riskDetail.City
        addressInfo.CityKanji = riskDetail.CityKanji
        addressInfo.State = riskDetail.State.Code
        addressInfo.PostalCode = riskDetail.PostalCode
        addressInfo.CEDEX = riskDetail.CEDEX
        addressInfo.CEDEXBureau = riskDetail.CEDEXBureau
        addressInfo.Country = riskDetail.Country.Code
        policyRiskDetail.Address = addressInfo
        policyRiskDetail.County = riskDetail.County
        policyRiskDetail.AddressType = riskDetail.AddressType.Code

        var element = new PolicyChangeInfo_CatastropheDetails()
        element.$TypeInstance = policyRiskDetail
        this.CatastropheDetails.add(element)
    })
    // PC-BC Integration: Mapping Producer Info
    this.UnaProducerCodeOfRecordId = period.ProducerCodeOfRecord.PublicID
    this.UnaProducerCodeOfServiceId = period.Policy.ProducerCodeOfService.PublicID
    // PC-BC Integration: Adding Bankruptcy Flag
    this.BankruptcyFlag = period.bankruptcy_Ext
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
