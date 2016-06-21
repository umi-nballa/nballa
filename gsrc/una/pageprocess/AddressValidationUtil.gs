package una.pageprocess

uses una.logging.UnaLoggerCategory
uses gw.api.address.AddressOwner
uses java.lang.Exception

/**
 * Class is created for saving address Scrub Status to Address Entity and moved  autofillAddress method to here from
 * GlobalAddressInputsetDefault PCF(Post on Change)
 * CreatedBy: ptheegala
 * Date: 6/14/16
 */
class AddressValidationUtil {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  static final var CLASS_NAME = AddressValidationUtil.Type.DisplayName

  /**
   * Method for saving address Scrub Status to Address Entity
   * @param address refers the GuideWire Address Entity
   * @param triggerField type of the field "PostalCode" or "City"
   * @param alwaysOverride boolean value
   */
  static function autofillAddress(addressOwner: AddressOwner, triggerField: String, alwaysOverride: boolean) {
    if (addressOwner.AutofillEnabled) {
      try {
        logger.debug(" Entering  " + CLASS_NAME + " :: " + " autofillAddress" + "For ScrubStatus ")
        // validating Address from Tuna
        gw.api.contact.AddressAutocompleteUtil.autofillAddress(addressOwner.AddressDelegate, triggerField, false);
        // Status is true if address is valid
        if(null != addressOwner.Address )
        addressOwner.Address.addressScrub_Ext = true
        logger.debug(" Leaving  " + CLASS_NAME + " :: " + " autofillAddress" + "For ScrubStatus ")
      } catch (exp: Exception) {
        // Status is false if address is Invalid
        if(null != addressOwner.Address )
        addressOwner.Address.addressScrub_Ext = false
        throw exp
      }
    }
  }
}