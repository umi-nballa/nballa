package onbase.api.services.implementations.wsp

uses onbase.api.Settings
uses onbase.api.services.datamodels.UpdateKeywordsRequest

uses onbase.api.services.implementations.wsp.webservicecollection.onbasekeywordupateapi.soapservice.elements.KeywordUpdate

uses onbase.api.services.implementations.wsp.webservicecollection.onbasekeywordupateapi.soapservice.types.complex.Multi_Instance_Keyword_GroupKeywordUpdate
uses onbase.api.services.implementations.wsp.webservicecollection.onbasekeywordupateapi.soapservice.types.complex.Single_Instance_Keyword_GroupKeywordUpdate
uses onbase.api.services.implementations.wsp.webservicecollection.onbasekeywordupateapi.soapservice.types.complex.StandAloneKeywordUpdate
uses onbase.api.services.interfaces.UpdateKeywordsInterface
uses org.slf4j.LoggerFactory
uses onbase.api.services.implementations.wsp.webservicecollection.onbasekeywordupateapi.soapservice.elements.QueryParameter

/**
 * Hyland Build Version: 16.0.0.999
 *
 * * Last Changes:
 *   08/25/2016 - Anirudh Mohan
 *     * Initial implementation of the bulk keyword update
 *
 */
class UpdateKeywordsWSP implements UpdateKeywordsInterface {
  private var logger = LoggerFactory.getLogger(Settings.ServicesLoggerCategory)

  /**
   * Update OnBase documents keyword values.
   *
   * @param ukRequest The Bulk keyword update request object.
   */
  public override function updateKeywords(ukRequest: UpdateKeywordsRequest) {
    logger.debug("Start executing bulkKeywordUpdate() using WSP service.")

    var service = new onbase.api.services.implementations.wsp.webservicecollection.onbasekeywordupateapi.soapservice.ports.EISClientWithConfig_BasicHttpBinding_HylandOutBoundContract()

    // Create request keywords.
    var standaloneKeywords = new StandAloneKeywordUpdate()

    var sikgKeywords = new Single_Instance_Keyword_GroupKeywordUpdate()

    standaloneKeywords.INS_Username_Collection.String[0] = ukRequest.UserID
    standaloneKeywords.INS_RequestType_Collection.String[0] = "ASYNCHRONOUS"
    sikgKeywords.QueryType.INS_CustomQuery = "PC-BC Query"
    var mikgKeywords = new Multi_Instance_Keyword_GroupKeywordUpdate()

    foreach (action in ukRequest.Actions index i) {
      mikgKeywords.KeywordUpdateAction_Collection.KeywordUpdateAction[i].INS_Action = action.Action.toString()
      mikgKeywords.KeywordUpdateAction_Collection.KeywordUpdateAction[i].INS_ActionOrder = "0"
      mikgKeywords.KeywordUpdateAction_Collection.KeywordUpdateAction[i].INS_DataType = action.KeywordName
      mikgKeywords.KeywordUpdateAction_Collection.KeywordUpdateAction[i].INS_DataValue = action.KeywordValue
    }

    var queryParameter = new QueryParameter()
    queryParameter.INS_QueryKeywordOperator = "EQUAL"
    queryParameter.INS_QueryKeywordRelation = "AND"
    queryParameter.INS_QueryKeywordType = "POLICY NUMBER"
    queryParameter.INS_QueryKeywordValue = ukRequest.PolicyNumber

    mikgKeywords.QueryParameter_Collection.QueryParameter[0] = queryParameter

    // Build request object
    var requestKU = new KeywordUpdate()
    requestKU.EformData.Keywords.StandAlone.$TypeInstance = standaloneKeywords
    requestKU.EformData.Keywords.Multi_Instance_Keyword_Group.$TypeInstance = mikgKeywords
    requestKU.EformData.Keywords.Single_Instance_Keyword_Group.$TypeInstance = sikgKeywords

    //Send request
    var response = service.KeywordUpdate(requestKU)
    logger.debug("Finished executing bulkKeywordUpdate() using WSP service.")
  }
}
