package gw.api.address
uses java.util.Set
uses gw.api.admin.BaseAdminUtil
uses gw.api.util.CountryConfig
uses java.util.ArrayList

@Export
/** 
 * Provides country-specific settings
 */
class AddressCountrySettings {
  private static final var validPCFModes : Set<String> = { "default", "BigToSmall", "PostCodeBeforeCity", "", null }
  private var _countryConfig : CountryConfig as CountryConfig
  private var _theCountry : Country  as TheCountry

  private construct(aCountry : Country) {
    TheCountry = aCountry
    var effectiveCountry = aCountry != null ? aCountry : BaseAdminUtil.getDefaultCountry()
    CountryConfig = CountryConfig.getCountryConfig(effectiveCountry)
    init(effectiveCountry)
  }

  // initialize and validate
  private function init(country : Country) {
    if (CountryConfig != null and CountryConfig.AddressOwnerFieldIds == null) {
      if (not validPCFModes.contains(CountryConfig.PCFMode)) {
        print("Error: In ${Country}/country.xml, \"${CountryConfig.PCFMode}\" is not a valid PCFMode")
      }
      var fieldSet : Set<AddressOwnerFieldId> = { }
      for (visibleField in CountryConfig.VisibleFields) {
        var fieldId = AddressOwnerFieldId.ALL_PCF_FIELDS.firstWhere( \ elt -> elt.Name == visibleField)
        fieldSet.add(fieldId)
        if (fieldId == null) {
          print("Error: In ${country.Code}/country.xml, \"${visibleField}\" is not a valid visibleField name")
        }
      }
      CountryConfig.AddressOwnerFieldIds = fieldSet
    }
  }

  private static final var field = AddressOwnerFieldId
  private static final var DEFAULT_FIELDS : Set<AddressOwnerFieldId> = {
      field.COUNTRY, field.ADDRESSLINE1, field.ADDRESSLINE2, field.ADDRESSLINE3, field.CITY, field.POSTALCODE }.freeze()
    
    
  public static function getSettings(country : Country) : AddressCountrySettings {
    return new AddressCountrySettings(country)
  }

  /**
   * The list of fields that appear in addresses for the specified country
   */
  public property get VisibleFields() : Set<AddressOwnerFieldId> {
    var fields = _countryConfig.AddressOwnerFieldIds as Set<AddressOwnerFieldId>
    return fields != null ? fields : DEFAULT_FIELDS
  }
  
  /**
   * The label for the City field
   */
  public property get CityLabel() : String {
    var label = _countryConfig.CityLabel
    return label.HasContent ? label : (shouldChangeCityLabel() ? displaykey.Web.AddressBook.AddressInputSet.CityState : displaykey.Web.AddressBook.AddressInputSet.City)
  }

  private function shouldChangeCityLabel(): boolean{
    var theExcludeList = new ArrayList<String>() {typekey.Country.TC_US.Code}
    var res = false
    if(!theExcludeList.hasMatch( \ elt1 -> elt1.equalsIgnoreCase(TheCountry.Code))){
      res = true
    }
    return res
  }

  /**
   * The label for the State field
   */
  public property get StateLabel() : String {
    var label = _countryConfig.StateLabel
    return label.HasContent ? label : displaykey.Web.AddressBook.AddressInputSet.State
  }
  
  /**
   * The label for the PostalCode field
   */
  public property get PostalCodeLabel() : String {
    var label = _countryConfig.PostalCodeLabel
    return label.HasContent ? label : displaykey.Web.AddressBook.AddressInputSet.Postcode
  }

  /**
   * The PCF mode to use for the Country
   */
  public property get PCFMode() : String {
    var mode = _countryConfig.PCFMode
    return mode.HasContent ? mode : "default"
  }
}
