package una.integration.plugins.tuna

uses gw.api.address.AddressFillable
uses gw.api.address.DefaultAddressAutocompletePlugin
uses una.integration.service.gateway.tuna.TunaGateway
uses una.logging.UnaLoggerCategory
uses una.utils.PropertiesHolder
uses java.lang.Exception
uses una.integration.service.gateway.tuna.TunaInterface

/**
 * Address Service Plugin Implementation class for validating address from tuna.
 * Created By: ptheegala  on 5/16/2016
 */
class AddressValidationPluginImpl extends DefaultAddressAutocompletePlugin {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  var tunaGateway: TunaInterface

  construct() {
    tunaGateway = new TunaGateway(PropertiesHolder.getProperty("TUNA_GATEWAY_TIMEOUT"))
  }

  /**
   * Initializes the plugin IAddressAutoCompletePlugin
   * @param address have the values entered in Create account screen
   * @param triggerField type of the field "PostalCode" or "City"
   * @param alwaysOverride boolean value
   */
  override function autofillAddress(address: AddressFillable, triggerField: String, alwaysOverride: boolean) {
    try {
      // Validating address against Tuna gateway if all the mandatory fields are available
      if (null != address.AddressLine1 && null != address.City && null != address.State && null != address.PostalCode) {
        logger.debug(" Inside Tunagateway autofillAddress For AddressValidation ", this.IntrinsicType)
        var finalRes = tunaGateway.validateAddress(address)
        if (finalRes.Status != 0) {
          throw new gw.api.util.DisplayableException (finalRes.Address.Note)
        }
      } else {
        super.autofillAddress(address, triggerField, alwaysOverride)
      }
    } catch (e: Exception) {
      logger.error("TunaGateway : autofillAddress " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }
}