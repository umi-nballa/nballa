package onbase.api.services.interfaces

uses onbase.api.services.datamodels.Template

uses java.util.List

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *  01/13/2015 - Richard R. Kantimahanthi
 *    * Initial implementation.
 *
 */
/**
 * Interface to call OnBase DocCompTemplates service.
 */
interface DocCompTemplatesInterface {
  /**
   * Get document composition templates in categories.
   *
   * @param templateCategories The template categories.
   *
   * @return A list of templates in the template categories.
   */
  public function getDocumentTemplates(templateCategories: String[]): List <Template>
}
