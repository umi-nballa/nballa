package onbase.api.services.datamodels

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/12/2015 - csandham
 *     * Initial creation.
 *
 *   01/12/2015 - Richard R. Kantimahanthi
 *     * changed the variable 'Value' to 'ID' to match the service response values.
 *
 */
/**
 * Data model for OnBase Category for use in the web services tier of the API.
 */
class Category {
  /** Category name. */
  var _name: String as Name
  /** Category id. */
  var _value: String as ID
}
