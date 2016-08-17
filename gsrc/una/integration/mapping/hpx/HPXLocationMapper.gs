package una.integration.mapping.hpx
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/16/16
 * Time: 4:44 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXLocationMapper {
  /******************************************************** Dwelling Location ***********************************************************************/
  function createDwellingLocation(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.Location {
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

  /******************************************************** Dwelling Location ***********************************************************************/
  function createBillingLocation(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.Location {
    var billingContact = policyPeriod.BillingContact.AccountContactRole.AccountContact.Contact.PrimaryAddress
    var location = new wsi.schema.una.hpx.hpx_application_request.Location()
    var address = new wsi.schema.una.hpx.hpx_application_request.Addr()
    var addressTypeCode = new wsi.schema.una.hpx.hpx_application_request.AddrTypeCd()
    if (billingContact.AddressLine1 != null) {
      var addr1 = new wsi.schema.una.hpx.hpx_application_request.Addr1()
      addr1.setText(billingContact.AddressLine1)
      address.addChild(addr1)
    }
    if (billingContact.AddressLine2 != null) {
      var addr2 = new wsi.schema.una.hpx.hpx_application_request.Addr2()
      addr2.setText(billingContact.AddressLine2)
      address.addChild(addr2)
    }
    if (billingContact.AddressLine3 != null) {
      var addr3 = new wsi.schema.una.hpx.hpx_application_request.Addr3()
      addr3.setText(billingContact.AddressLine3)
      address.addChild(addr3)
    }
    if (billingContact.City != null) {
      var city = new wsi.schema.una.hpx.hpx_application_request.City()
      city.setText(billingContact.City)
      address.addChild(city)
    }
    if (billingContact.State != null) {
      var state = new wsi.schema.una.hpx.hpx_application_request.StateProvCd()
      state.setText(billingContact.State)
      address.addChild(state)
    }
    if (billingContact.PostalCode != null) {
      var postalCode = new wsi.schema.una.hpx.hpx_application_request.PostalCode()
      postalCode.setText(billingContact.PostalCode)
      address.addChild(postalCode)
    }
    if (billingContact.CountryCode != null) {
      var countryCode = new wsi.schema.una.hpx.hpx_application_request.CountryCd()
      countryCode.setText(billingContact.CountryCode)
      address.addChild(countryCode)
    }
    location.addChild(address)
    return location
  }
}