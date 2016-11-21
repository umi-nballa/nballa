package onbase.api.services.interfaces

uses gw.xml.XmlElement
uses onbase.api.services.datamodels.Keyword

uses java.util.List

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *  01/13/2015 - Richard R. Kantimahanthi
 *    * Initial implementation.
 *
 *  01/16/2015 - Richard R. Kantimahanthi
 *    * Changed the templateID variable type to long from String.
 */
/**
 * Interface to call OnBase DocCompExecute service.
 */
interface DocCompExecuteInterface {
  /**
   * Create a document from template.
   *
   * @param templateID The template id.
   * @param keywords The keyword values for this document.
   * @param xmlPayload The extra xml payload to be used to create the document.
   *
   * @return Newly created document id.
   */
  public function createDocumentFromTemplate(templateID: long, keywords: List<Keyword>, xmlPayload: XmlElement): String
}
