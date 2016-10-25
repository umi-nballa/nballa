package una.integration.service.transport.ofac

uses wsi.remote.una.ofac.ofac.xgservices.ports.XGServices_BasicHttpBinding_ISearch
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.ClientContext
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchConfiguration
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchInput
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchResults

uses java.lang.Exception
uses una.logging.UnaLoggerCategory

/**
 * Created with IntelliJ IDEA.
 * User: JGupta
 * Date: 10/7/16
 * Time: 1:40 AM
 * This Class communicates with OFAC
 */
class OFACCommunicatorStub {
  static var _logger = UnaLoggerCategory.UNA_INTEGRATION
   /**
   *
   * The method hits the OFAC - search Service
   * @param clientContext : request ClientContext is passed as a parameter
   * @param searchConfiguration : request SearchConfiguration is passed as a parameter
   * @return result Returns SearchResult response
   */
  function returnOFACSearchResults(clientContext: ClientContext, searchConfiguration: SearchConfiguration, searchInput: SearchInput): SearchResults
  {
    _logger.debug("Entering inside method returnOFACSearchResults ")
    try
    {
      var xsService = new XGServices_BasicHttpBinding_ISearch()
      var result = xsService.Search(clientContext, searchConfiguration, searchInput)
      _logger.debug("Exiting from method returnOFACSearchResults ")
      return result
    } catch (e: Exception) {
      _logger.debug("Issue with webservice ")
      return null
    }

  }

}