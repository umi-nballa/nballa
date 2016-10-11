package una.integration.service.transport.ofac

uses gw.xml.ws.WebServiceException
uses gw.api.util.DisplayableException
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.ClientContext
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchConfiguration
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchInput
uses wsi.remote.una.ofac.ofac.xgservices.ports.XGServices_BasicHttpBinding_ISearch
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchResults

/**
 * Class for communicating with OFAC services
 * User: JGupta
 * Date: 10/3/16
 * Time: 2:01 AM
 * To change this template use File | Settings | File Templates.
 */
class OFACCommunicator {
  private final static var WS_NOT_AVAILABLE: String = "Failed to connect to the OFAC web service."
  /**
   *
   * The method hits the OFAC - search Service
   * @param clientContext : request ClientContext is passed as a parameter
   * @param searchConfiguration : request SearchConfiguration is passed as a parameter
   * @return result Returns SearchResult response
   */
  function returnOFACSearchResults(clientContext: ClientContext, searchConfiguration: SearchConfiguration, searchInput: SearchInput): SearchResults
  {
    try
    {
      var xsService = new XGServices_BasicHttpBinding_ISearch()
      var result = xsService.Search(clientContext, searchConfiguration, searchInput)
      return result
    } catch (wse: WebServiceException) {
      throw new DisplayableException(WS_NOT_AVAILABLE, wse)
    }
  }
}