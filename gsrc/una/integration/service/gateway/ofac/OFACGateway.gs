package una.integration.service.gateway.ofac

uses una.integration.service.transport.ofac.OFACCommunicator
uses una.logging.UnaLoggerCategory

uses una.integration.mapping.ofac.OFACRequestMapper
uses una.integration.mapping.ofac.OFACResponseMapper
uses java.lang.Exception
uses gw.api.util.DisplayableException

/**
 * Created with IntelliJ IDEA.
 * User: JGupta
 * Date: 9/22/16
 * Time: 9:46 AM
 * This class provides Implementation to OFACInterface methods
 */
class OFACGateway implements OFACInterface {

  var ofacCommunicator: OFACCommunicator
  var ofacRequestMapper: OFACRequestMapper
  var ofacResponseMapper: OFACResponseMapper
  var ofacHelper: OFACGatewayHelper
  var timeout = "500"
  static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  private static final var CLASS_NAME = OFACGateway.Type.DisplayName
  private final static var WS_NOT_AVAILABLE = "Failed to connect to the OFAC web service. Please reach out to the Support Team."


  construct(thresholdTimeout: String) {
    timeout = thresholdTimeout
    ofacCommunicator = new OFACCommunicator()
    ofacRequestMapper = new OFACRequestMapper()
    ofacResponseMapper = new OFACResponseMapper()
    ofacHelper = new OFACGatewayHelper()
  }

  /**
   *  Function to Validate List of Insured against OFAC and if listed ,persist in OfacContact Entity in GW
   */
  @Param("insuredList", "List of insured need to be checked Against OFAC")
  @Param("policyPeriod", "Policy Period")
  override function validateOFACEntity(policyContacts: List<Contact>, policyPeriod: PolicyPeriod) {
    _logger.info("Entering Inside method validateOFACEntity")
    //building OFAC input

    try {
      var clientContext = ofacRequestMapper.buildClientContext()
      var searchConfiguration = ofacRequestMapper.buildSearchConfiguration()
      var ofacDTOList = ofacRequestMapper.buildOFACInput(policyContacts, policyPeriod)
      var searchInput = ofacRequestMapper.buildSearchInput(ofacDTOList)
      //Call to OFAC service
      var result = ofacCommunicator.returnOFACSearchResults(clientContext, searchConfiguration, searchInput)
      _logger.debug("result:" + result)

      if(result != null) {
      var contactList = ofacHelper.checkAndMapResponseForAlerts(policyContacts, policyPeriod, result)

      policyPeriod.ofacdetails.isOFACOrdered = true


      //contactAndScoreMap should be null in case of no - HIT only
      if (contactList.Count >= 1)
        ofacResponseMapper.mapOFACResponse(contactList, policyPeriod)

        }
    } catch (exp: Exception) {
      _logger.error(CLASS_NAME + " :: " + "validateOFACEntity" + " : StackTrace = " + exp.StackTraceAsString)
      throw new DisplayableException(WS_NOT_AVAILABLE)
     }
  }
}