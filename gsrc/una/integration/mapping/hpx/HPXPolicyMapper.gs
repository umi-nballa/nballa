package una.integration.mapping.hpx
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/2/16
 * Time: 8:54 AM
 * To change this template use File | Settings | File Templates.
 */
abstract class HPXPolicyMapper {

  function createItemIdInfo() : wsi.schema.una.hpx.hpx_application_request.ItemIdInfo {
    var itemIdInfo = new wsi.schema.una.hpx.hpx_application_request.ItemIdInfo()
    var agencyId = new wsi.schema.una.hpx.hpx_application_request.AgencyId()
    agencyId.setText(0)
    itemIdInfo.addChild(agencyId)
    var insurerId = new wsi.schema.una.hpx.hpx_application_request.InsurerId()
    insurerId.setText(0)
    itemIdInfo.addChild(insurerId)
    var systemId = new wsi.schema.una.hpx.hpx_application_request.SystemId()
    systemId.setText("00000000-0000-0000-0000-000000000000")
    itemIdInfo.addChild(systemId)
    var otherIdentifier = new wsi.schema.una.hpx.hpx_application_request.OtherIdentifier()
    var otherIdTypeCd = new wsi.schema.una.hpx.hpx_application_request.OtherIdTypeCd()
    otherIdTypeCd.setText("CreditBureau")
    var otherId = new wsi.schema.una.hpx.hpx_application_request.OtherId()
    otherId.setText(0)
    otherIdentifier.addChild(otherIdTypeCd)
    otherIdentifier.addChild(otherId)
    itemIdInfo.addChild(otherIdentifier)
    return itemIdInfo
  }

  /************************************** Policy Summary Info ******************************************************/
  function createPolicySummaryInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.PolicySummaryInfo {
    var policySummaryInfo = new wsi.schema.una.hpx.hpx_application_request.PolicySummaryInfo()
    policySummaryInfo.addChild(createItemIdInfo())
    return policySummaryInfo
  }


  /************************************** Insured Or Principal ******************************************************/
  function createInsuredOrPrincipal(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.InsuredOrPrincipal {
    var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
    var insuredOrPrincipal = new wsi.schema.una.hpx.hpx_application_request.InsuredOrPrincipal()
    insuredOrPrincipal.addChild(createItemIdInfo())
    insuredOrPrincipal.addChild(generalPartyInfoMapper.createGeneralPartyInfo(policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact,
        policyPeriod.PrimaryNamedInsured))
    return insuredOrPrincipal
  }

  /*************************************  Policy Detail ************************************************************/
  function createPolicyDetails(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.PolicyInfo {
    var coverageMapper = new HPXCoverageMapper()
    var compositionUnitMapper = new HPXCompositionUnitMapper()
    var dwellingPolicyMapper = new HPXDwellingPolicyMapper()
    var policyInfo = new wsi.schema.una.hpx.hpx_application_request.PolicyInfo()
    var lobCode = new wsi.schema.una.hpx.hpx_application_request.LOBCd()
    switch (policyPeriod.HomeownersLine_HOE.PatternCode) {
      case "HomeownersLine_HOE" : lobCode.setText(wsi.schema.una.hpx.hpx_application_request.enums.LineOfBusiness.HOME)
          break
    }
    policyInfo.addChild(lobCode)
    var policyNumber = new wsi.schema.una.hpx.hpx_application_request.PolicyNumber()
    if (policyPeriod.PolicyNumber != null) {
      policyNumber.setText(policyPeriod.PolicyNumber)
      policyInfo.addChild(policyNumber)
    }
    var accountNo = new wsi.schema.una.hpx.hpx_application_request.AccountNumberId()
    accountNo.setText(policyPeriod.Policy.Account.AccountNumber)
    policyInfo.addChild(accountNo)
    var policyTermCode = new wsi.schema.una.hpx.hpx_application_request.PolicyTermCd()
    policyTermCode.setText(policyPeriod.TermType)
    policyInfo.addChild(policyTermCode)
    var contractTerm = new wsi.schema.una.hpx.hpx_application_request.ContractTerm()
    var effectiveDate = new wsi.schema.una.hpx.hpx_application_request.EffectiveDt()
    effectiveDate.setText(policyPeriod.PeriodStart)
    contractTerm.addChild(effectiveDate)
    var expirationDate = new wsi.schema.una.hpx.hpx_application_request.ExpirationDt()
    expirationDate.setText(policyPeriod.PeriodEnd)
    contractTerm.addChild(expirationDate)
    policyInfo.addChild(contractTerm)
    var writtenDate = new wsi.schema.una.hpx.hpx_application_request.TermProcessDt()
    writtenDate.setText(policyPeriod.WrittenDate)
    policyInfo.addChild(writtenDate)
    var baseRate = new wsi.schema.una.hpx.hpx_application_request.ControllingStateProvCd()
    baseRate.setText(policyPeriod.BaseState)
    policyInfo.addChild(baseRate)
    return policyInfo
  }

  /******************************************************** Location ***********************************************************************/
  function createLocation(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.Location {
    var location = new wsi.schema.una.hpx.hpx_application_request.Location()
    var address = new wsi.schema.una.hpx.hpx_application_request.Addr()

    var addressTypeCode = new wsi.schema.una.hpx.hpx_application_request.AddrTypeCd()
    //addressTypeCode.setText()
    //address.addChild(addressTypeCode)

    if (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine1 != null) {
      var addr1 = new wsi.schema.una.hpx.hpx_application_request.Addr1()
      addr1.setText(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine1)
      address.addChild(addr1)
    }
    if (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine2 != null) {
      var addr2 = new wsi.schema.una.hpx.hpx_application_request.Addr2()
      addr2.setText(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine2)
      address.addChild(addr2)
    }
    if (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine3 != null) {
      var addr3 = new wsi.schema.una.hpx.hpx_application_request.Addr3()
      addr3.setText(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine3)
      address.addChild(addr3)
    }
    if (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.City != null) {
      var city = new wsi.schema.una.hpx.hpx_application_request.City()
      city.setText(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.City)
      address.addChild(city)
    }
    if (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.State != null) {
      var state = new wsi.schema.una.hpx.hpx_application_request.StateProvCd()
      state.setText(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.State)
      address.addChild(state)
    }
    if (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.PostalCode != null) {
      var postalCode = new wsi.schema.una.hpx.hpx_application_request.PostalCode()
      postalCode.setText(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.PostalCode)
      address.addChild(postalCode)
    }
    if (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.CountryCode != null) {
      var countryCode = new wsi.schema.una.hpx.hpx_application_request.CountryCd()
      countryCode.setText(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.CountryCode)
      address.addChild(countryCode)
    }
    location.addChild(address)
    return location
  }
}