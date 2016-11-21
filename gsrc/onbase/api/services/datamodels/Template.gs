package onbase.api.services.datamodels

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *  01/13/2015 - Richard R. Kantimahanthi
 *    * Initial implementation.
 *
 *  01/16/2015 - Richard R. Kantimahanthi
 *    * Changed the ID variable type to long from String.
 */
/**
 * Data object for OnBase DocComp Templates.
 */
class Template {
  /** Template name. */
  var _templateName: String as Name
  /** Template id. */
  var _templateID: long as ID
  /** Template category. */
  var _templateCategory: String as Category
}
