package una.integration.plugins.tuna

uses gw.api.address.AddressFillable
uses gw.api.address.DefaultAddressAutocompletePlugin
uses una.integration.service.gateway.plugin.GatewayPlugin
uses una.integration.service.gateway.tuna.TunaInterface
uses una.logging.UnaLoggerCategory

uses java.lang.Exception
uses una.utils.PropertiesHolder

/**
 * Address Service Plugin Implementation class for validating address from tuna.
 * Created By: ptheegala  on 5/16/2016
 */
class AddressValidationPluginImpl extends DefaultAddressAutocompletePlugin {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  private var _TUNAGateway = GatewayPlugin.makeTunaGateway()
  construct() {
  }
  //Instance call for TUNAGATEWAY
  property get TUNAGateway(): TunaInterface {
    return _TUNAGateway
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
        var finalRes = TUNAGateway.fetchPropertyInformationScrubOnly(address)
        //Validating the response with either status code and Note
        if (finalRes.Status != 0 ||
            finalRes.Address.Note.equalsIgnoreCase(PropertiesHolder.getProperty("TUNA_RESPONSE_VALIDATION"))) {
          throw new gw.api.util.DisplayableException (finalRes.Address.Note)
        }
            //Populating Tuna Validated Response values to the UI if Address is Validated
        else if (finalRes.Status == 0)
        {
          logger.debug(" populating values to the UI after validating ", this.IntrinsicType)
          address.AddressLine1 = finalRes.Address.Street.Number + " " + finalRes.Address.Street.Name + " "
              + finalRes.Address.Street.Type
          address.City = finalRes.Address.City
          //Converting String to TypeKey State
          address.State = typekey.State.getState(address.Country, finalRes.Address.State)
          address.PostalCode = finalRes.Address.Zipcode.Major + "-" + finalRes.Address.Zipcode.Minor
          logger.debug("Converting String to State Type " + typekey.State.getState(address.Country, finalRes.Address.State))
        }
      } else {
        //If all Mandatory Fields are not provided OOTB Address Auto Complete is Invoked
        super.autofillAddress(address, triggerField, alwaysOverride)
      }
    } catch (e: Exception) {
      logger.error("TunaGateway : autofillAddress " + " : StackTrace = ", e)
      throw e
    }
  }
}