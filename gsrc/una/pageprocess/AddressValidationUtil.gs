package una.pageprocess

uses gw.api.address.AddressOwner
uses una.lob.bp7.BP7LocationAddressOwner
uses una.logging.UnaLoggerCategory
uses java.lang.Exception
uses una.extensions.UnaPolicyLocationAddressOwner

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

    logger.debug(" Entering  " + CLASS_NAME + " :: " + " autofillAddress" + "For ScrubStatus ")
    if (!(addressOwner typeis BP7LocationAddressOwner)){
      if(addressOwner typeis UnaPolicyLocationAddressOwner && !(addressOwner.pperiod?.Policy.Product.Description == "Homeowners")) {
        logger.info(addressOwner.pperiod?.Policy.Product.Description)

      }
     else if (addressOwner.AutofillEnabled && null != addressOwner.Address) {
        try {
          gw.api.contact.AddressAutocompleteUtil.autofillAddress(addressOwner.AddressDelegate, triggerField, false);
          if (null != addressOwner.Address.AddressLine1 && null != addressOwner.Address.City && null != addressOwner.Address.State && null != addressOwner.Address.PostalCode)
            addressOwner.Address.addressScrub_Ext = true

        } catch (exp: Exception) {
          addressOwner.Address.addressScrub_Ext = false
          throw exp
        }
      } else {
        gw.api.contact.AddressAutocompleteUtil.autofillAddress(addressOwner.AddressDelegate, triggerField, false);
      }
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " autofillAddress" + "For ScrubStatus ")
    }
  }
}