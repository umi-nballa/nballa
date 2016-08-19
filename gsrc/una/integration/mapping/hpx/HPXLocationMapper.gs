package una.integration.mapping.hpx
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/16/16
 * Time: 4:44 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXLocationMapper {
  /******************************************************** Location ***********************************************************************/

  function createLocation(loc : PolicyLocation) : wsi.schema.una.hpx.hpx_application_request.Location {
    var location = new wsi.schema.una.hpx.hpx_application_request.Location()
    var address = new wsi.schema.una.hpx.hpx_application_request.Addr()

    var addressTypeCode = new wsi.schema.una.hpx.hpx_application_request.AddrTypeCd()
    //addressTypeCode.setText()
    //address.addChild(addressTypeCode)

    if (loc.AddressLine1 != null) {
      var addr1 = new wsi.schema.una.hpx.hpx_application_request.Addr1()
      addr1.setText(loc.AddressLine1)
      address.addChild(addr1)
    }
    if (loc.AddressLine2 != null) {
      var addr2 = new wsi.schema.una.hpx.hpx_application_request.Addr2()
      addr2.setText(loc.AddressLine2)
      address.addChild(addr2)
    }
    if (loc.AddressLine3 != null) {
      var addr3 = new wsi.schema.una.hpx.hpx_application_request.Addr3()
      addr3.setText(loc.AddressLine3)
      address.addChild(addr3)
    }
    if (loc.City != null) {
      var city = new wsi.schema.una.hpx.hpx_application_request.City()
      city.setText(loc.City)
      address.addChild(city)
    }
    if (loc.State != null) {
      var state = new wsi.schema.una.hpx.hpx_application_request.StateProvCd()
      state.setText(loc.State)
      address.addChild(state)
    }
    if (loc.PostalCode != null) {
      var postalCode = new wsi.schema.una.hpx.hpx_application_request.PostalCode()
      postalCode.setText(loc.PostalCode)
      address.addChild(postalCode)
    }
    if (loc.CountryCode != null) {
      var countryCode = new wsi.schema.una.hpx.hpx_application_request.CountryCd()
      countryCode.setText(loc.CountryCode)
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