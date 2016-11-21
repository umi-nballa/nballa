package onbase.api.services.interfaces

uses onbase.api.services.datamodels.Category

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
 * Interface to call OnBase DocCompCategories service.
 */
interface DocCompCategoriesInterface {
  /**
   * Get document composition template categories.
   *
   * @return A list of template categories.
   */
  public function getDocumentTemplateCategories(): List <Category>
}
