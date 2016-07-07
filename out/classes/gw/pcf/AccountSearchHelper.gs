package gw.pcf

@Export
class AccountSearchHelper {

  // Commented out OOTB. Updated below for UNA
  public static function getCountry (searchCriteria : gw.account.AccountSearchCriteria) : String {
    var countrymode : String
    if (searchCriteria.Country == null) {
      //countrymode = searchCriteria.Country.Code
      searchCriteria.Country = typekey.Country.TC_US    //making default country code as USA
    } else {
      countrymode = gw.api.system.PLConfigParameters.DefaultCountryCode.Value
    }
    return countrymode
  }

  // Commented out OOTB. Updated above for UNA
  /*public static function getCountry (searchCriteria : gw.account.AccountSearchCriteria) : String {
    var countrymode : String
    if (searchCriteria.Country <> null) {
      countrymode = searchCriteria.Country.Code
    } else {
      countrymode = gw.api.system.PLConfigParameters.DefaultCountryCode.Value
    }
    return countrymode
  }*/
}
