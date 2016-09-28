package una.integration.mapping.hpx.common
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/16/16
 * Time: 4:44 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXLocationMapper {
  /******************************************************** Location ***********************************************************************/
  function createLocation(loc : PolicyLocation) : wsi.schema.una.hpx.hpx_application_request.types.complex.LocationType {
    var location = new wsi.schema.una.hpx.hpx_application_request.types.complex.LocationType()
    location.Addr.Addr1 = loc.AddressLine1 != null ? loc.AddressLine1 : ""
    location.Addr.Addr2 = loc.AddressLine2 != null ? loc.AddressLine2 : ""
    location.Addr.Addr3 = loc.AddressLine3 != null ? loc.AddressLine3 : ""
    location.Addr.City = loc.City != null ? loc.City : ""
    location.Addr.StateProvCd = loc.State != null ? loc.State.Code : ""
    location.Addr.PostalCode = loc.PostalCode != null ? loc.PostalCode : ""
    location.Addr.CountryCd = loc.CountryCode != null ? loc.CountryCode : ""
    return location
  }

  /******************************************************** Dwelling Location ***********************************************************************/
  function createBillingLocation(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.LocationType {
    var loc = policyPeriod.BillingContact.AccountContactRole.AccountContact.Contact.PrimaryAddress
    var location = new wsi.schema.una.hpx.hpx_application_request.types.complex.LocationType()
    location.Addr.Addr1 = loc.AddressLine1 != null ? loc.AddressLine1 : ""
    location.Addr.Addr2 = loc.AddressLine2 != null ? loc.AddressLine2 : ""
    location.Addr.Addr3 = loc.AddressLine3 != null ? loc.AddressLine3 : ""
    location.Addr.City = loc.City != null ? loc.City : ""
    location.Addr.StateProvCd = loc.State != null ? loc.State.Code : ""
    location.Addr.PostalCode = loc.PostalCode != null ? loc.PostalCode : ""
    location.Addr.CountryCd = loc.CountryCode != null ? loc.CountryCode : ""
    return location
  }

  function createLocations(locations : java.util.List<PolicyLocation>) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LocationType> {
    var locs = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LocationType>()
    for (location in locations) {
      locs.add(createLocation(location))
    }
    return locs
  }
}