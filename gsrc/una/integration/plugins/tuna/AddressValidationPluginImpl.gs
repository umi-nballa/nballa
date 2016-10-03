package una.integration.plugins.tuna

uses gw.api.address.AddressFillable
uses gw.api.address.DefaultAddressAutocompletePlugin
uses una.integration.service.gateway.plugin.GatewayPlugin
uses una.integration.service.gateway.tuna.TunaInterface
uses una.logging.UnaLoggerCategory
uses java.lang.Exception
uses java.util.regex.Pattern


/**
 * Address Service Plugin Implementation class for validating address from tuna.
 * Created By: pavanTheegala  on 5/16/2016
 */
class AddressValidationPluginImpl extends DefaultAddressAutocompletePlugin {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  private var _TUNAGateway = GatewayPlugin.makeTunaGateway()
  private static final var CLASS_NAME = AddressValidationPluginImpl.Type.DisplayName
  final static var _pattern = Pattern.compile("^[0-9]{5}(?:-[0-9]{4})?$")

  /**
   * Default Constructor
   */
  construct() {
  }

  // Explicit property getter for TUNAGateway, visible only to classes in this package

  property get TUNAGateway(): TunaInterface {
    return _TUNAGateway
  }

  /**
   * Initializes the plugin IAddressAutoCompletePlugin
   * @param address refers the GuideWire Address Entity
   * @param triggerField type of the field "PostalCode" or "City"
   * @param alwaysOverride boolean value
   */
  override function autofillAddress(address: AddressFillable, triggerField: String, alwaysOverride: boolean) {
    try {
      // Validating address against Tuna gateway if all the mandatory fields are available
      if (null != address.AddressLine1
          && null != address.City
          && null != address.State
          && null != address.PostalCode
          && address.Country == Country.TC_US) {
        logger.debug(" Entering  " + CLASS_NAME + " :: " + " autofillAddress" + "For AddressValidation ", this.IntrinsicType)
        var matcher = _pattern.matcher(address.PostalCode)
        if (matcher.matches()) {
          var finalRes = TUNAGateway.fetchPropertyInformationScrubOnly(address)
          //Validating the response with either status code and Note
          //AddressScrubbed = 1, AddressScrubFailed = 2, AddressScrubUnknown = 3
          if (finalRes.Status == 0 && finalRes.ScrubStatus == 1) {
            //Populating Tuna Validated Response values to the UI if Address is Validated
            logger.debug(" populating values to the UI after validating ", this.IntrinsicType)
            address.AddressLine1 = finalRes.AddressLine1
            address.City = finalRes.City
            //Converting String to TypeKey State
            address.State = typekey.State.getState(address.Country, finalRes.State)
            address.PostalCode = finalRes.PostalCode
            logger.debug("Converting String to State Type " + finalRes.State)
          } else {
            throw new gw.api.util.DisplayableException (finalRes.Note)
          }
        } else {
          throw new gw.api.util.DisplayableException (displaykey.AutoFill.Tuna.ZipCode)
        }
        logger.debug(" Leaving  " + CLASS_NAME + " :: " + " autofillAddress" + "For AddressValidation ", this.IntrinsicType)
      } else {
        //If all Mandatory Fields are not provided OOTB Address Auto Complete is Invoked
        super.autofillAddress(address, triggerField, alwaysOverride)
      }
    } catch (exp: Exception) {
      logger.error("TunaGateway : autofillAddress " + " : StackTrace = ", exp)
      throw exp
    }
  }
}