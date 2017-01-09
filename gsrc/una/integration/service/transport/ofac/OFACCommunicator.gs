package una.integration.service.transport.ofac

uses gw.api.util.DisplayableException
uses una.logging.UnaLoggerCategory
uses wsi.remote.una.ofac.ofac.xgservices.ports.XGServices_BasicHttpBinding_ISearch
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.ClientContext
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchConfiguration
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchInput
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchResults

uses java.lang.Exception

/**
 * Class for communicating with OFAC services
 * User: JGupta
 * Date: 10/3/16
 * Time: 2:01 AM
 * This Class communicates with OFAC
 */
class OFACCommunicator {
  private final static var WS_NOT_AVAILABLE: String = "Failed to connect to the OFAC web service."
  private static final var CLASS_NAME = OFACCommunicator.Type.DisplayName
  private static var _logger = UnaLoggerCategory.UNA_INTEGRATION

  /**
   *
   * The method hits the OFAC - search Service
   * @param clientContext : request ClientContext is passed as a parameter
   * @param searchConfiguration : request SearchConfiguration is passed as a parameter
   * @return result Returns SearchResult response
   */
  function returnOFACSearchResults(clientContext: ClientContext, searchConfiguration: SearchConfiguration, searchInput: SearchInput): SearchResults
  {
    _logger.info(CLASS_NAME + " : Entering inside method returnOFACSearchResults ")
    try
    {
      var xsService = new XGServices_BasicHttpBinding_ISearch()
      _logger.info(CLASS_NAME + " : Request for OFAC -------")
      _logger.info(clientContext)
      _logger.info(searchConfiguration)
      _logger.info(searchInput)
      var result = xsService.Search(clientContext, searchConfiguration, searchInput)
      _logger.info(CLASS_NAME + " :Response from OFAC")
      _logger.info(result)
      _logger.info(CLASS_NAME + " : Exiting from method returnOFACSearchResults ")
      return result
    } catch (e: Exception) {
      _logger.error(CLASS_NAME + " : Exception while retrieving information from OFAC : ", e.StackTraceAsString)
      throw new DisplayableException(WS_NOT_AVAILABLE)
    }
  }
}