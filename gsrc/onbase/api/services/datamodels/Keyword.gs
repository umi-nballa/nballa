package onbase.api.services.datamodels

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/12/2015 - csandham
 *     * Initial creation.
 *   01/15/2015 - Daniel Q. Yu
 *     * Add non-default constructor with name and value parameters.
 *   01/21/2015 - Daniel Q. Yu
 *     * Change name/value to kwname/kwvalue because CC7 won't compile.
 *   01/21/2015 - Chris Mattox
 *     * Changed value from String to Object to allow for multiple keyword instances
 */
/**
 * Data model for OnBase Keyword for use in the web services tier of the API.
 */
class Keyword {
  /** Keyword name. */
  var _name: String as Name
  /** Keyword value. */
  var _value: Object as Value
  /**
   * Constructor.
   */
  construct() {
  }

  /**
   * Constructor.
   *
   * @param kwname The keyword name.
   * @param kwvalue The keyword value.
   */
  construct(kwname: String, kwvalue: Object) {
    _name = kwname
    _value = kwvalue
  }

  override function toString() : String {
    return "[" + _name + "=>" + _value + "]"
  }
}
