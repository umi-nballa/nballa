package onbase.api.services.implementations.wsp

uses gw.api.util.Logger
uses onbase.api.Settings
uses onbase.api.exception.UnrestrictedQueryException
uses onbase.api.services.datamodels.Keyword
uses onbase.api.services.datamodels.OnBaseDocument
uses onbase.api.services.implementations.wsp.util.DocumentQueryResultsParser
uses onbase.api.services.implementations.wsp.util.KeywordAdaptor
uses onbase.api.services.interfaces.QueryDocumentsInterface
//uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.anonymous.elements.OBCustomQueryPolicyDocSearch_Keywords //TODO: OnBase - commented out awaiting taxonomy
//uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.elements.PolicyDocSearch //TODO: OnBase - commented out awaiting taxonomy

uses java.lang.UnsupportedOperationException

/**
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/30/2015 - dlittleton
 *     * Initial implementation.
 *
 *   11/03/2015 - Daniel Q. Yu
 *     * Added criteria check before calling OnBase to ensure no unrestricted queries.
 *
 *   03/23/2016 - Daniel Q. Yu
 *     * Added AsyncDocumentID search.
 *
 *   05/31/2016 - amohan
 *     * Modified the code from Claim Center9 to be compatible with Policy Center 9
 */
/**
 * Implementation of the QueryDocuments interface using WSP.
 */
class QueryDocumentsWSP implements QueryDocumentsInterface {
  private var logger = Logger.forCategory(Settings.ServicesLoggerCategory)

  /**
   * Query documents in OnBase.
   *
   * @param queryType The query type.
   * @param keywords The list of keywords for this query.
   *
   * @return A list of found OnBase documents.
   */
  public override function QueryDocuments(queryType: String, keywords: List <Keyword>): List <OnBaseDocument> {
    //TODO: OnBase - commented out awaiting taxonomy
/*    logger.debug("Start executing QueryDocuments() using WSP service.")

    // Only supporting policy queries for now.
    if (queryType != "policy") {
      throw new UnsupportedOperationException("Only policy queries are implemented.")
    }

    // Build query (Soap 1.1)
    var service = new onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.ports.EISClientWithConfig_BasicHttpBinding_HylandOutBoundContract()
    var query = new PolicyDocSearch()
    query.CustomQueryData.Keywords = new OBCustomQueryPolicyDocSearch_Keywords()
    mapKeywords(query.CustomQueryData.Keywords, keywords)

    // Check for unrestricted queries.
    if (query.CustomQueryData.Keywords.GWLinkType == null && query.CustomQueryData.Keywords.AccountNumber == null && query.CustomQueryData.Keywords.AsyncDocumentID == null) {
      throw new UnrestrictedQueryException("One of Account, Policy or LinkType is required for this query.")
    }
    // Execute query
    var response = service.PolicyDocSearch(query)

    return DocumentQueryResultsParser.toOnBaseDocumentList(response.PolicyDocSearchResult.DocumentResults.Document)*/
    return null
  }
  //TODO: OnBase - commented out awaiting taxonomy
/*  // Map the name-value pairs in a keyword list to the appropriate fields in a keyword query
  private function mapKeywords(keywordRequest: OBCustomQueryPolicyDocSearch_Keywords, keywords: List<Keyword>) {
    var adaptor = new KeywordAdaptor(keywords)
    keywordRequest.AccountNumber = adaptor.AccountNumber
    keywordRequest.PolicyNumber = adaptor.PolicyNumber
    keywordRequest.JobNumber = adaptor.JobNumber
    keywordRequest.GWLinkType = adaptor.LinkType
    keywordRequest.GWLinkID= adaptor.LinkValue
  }*/
}
