package gw.globalization

uses gw.api.util.StateJurisdictionMappingUtil
uses gw.lob.common.TaxLocationSearchCriteria

/**
 * Adapts a TaxLocationSearchCriteria to work with AddressFillable-dependent components.
 */
@Export
class TaxLocationSearchAdapter extends UnsupportedAddressFillable {

  var _searchCriteria: TaxLocationSearchCriteria
  var _ignoredPropertyBehavior = new IgnoredPropertyBehavior()

  construct(searchCriteria: TaxLocationSearchCriteria) {
    _searchCriteria = searchCriteria
  }

  override property get City(): String {
    return _searchCriteria.City
  }
  override property set City(c: String) {
    _searchCriteria.City = c
  }

  override property get County(): String {
    return _searchCriteria.County
  }
  override property set County(cn: String) {
    _searchCriteria.County = cn
  }

  override property get State(): State {
    return StateJurisdictionMappingUtil.getStateMappingForJurisdiction(_searchCriteria.State)
  }
  override property set State(st: State) {
    _searchCriteria.State = StateJurisdictionMappingUtil.getJurisdictionMappingForState(st)
  }

  /* Fix for DE37: Added Country and PostalCode property setters as these are necessary for AddressAutocompleteUtil */
  override property set Country(country : Country) {
    _ignoredPropertyBehavior.setValue("Country")  // necessary for AddressAutocompleteUtil, but we don't need it
  }

  override property set PostalCode(pc: String) {
    _ignoredPropertyBehavior.setValue("PostalCode")  // necessary for AddressAutocompleteUtil, but we don't need it
  }
}
