package onbase.api.services.interfaces

uses onbase.api.services.datamodels.Keyword
uses onbase.api.services.datamodels.OnBaseDocument

uses java.util.List

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/12/2015 - csandham
 *     * Initial creation.
 */
/**
 * Definition of the QueryDocuments Interface for the web services tier of the API.
 */
interface QueryDocumentsInterface {
  /**
   * Query documents in OnBase.
   *
   * @param queryType The query type.
   * @param keywords The list of keywords for this query.
   *
   * @return A list of found OnBase documents.
   */
  public function QueryDocuments(queryType: String, keywords: List<Keyword>): List <OnBaseDocument>
}
