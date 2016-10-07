package onbase.api.services.datamodels

uses onbase.api.Settings.DocumentLinkType

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   03/03/2015 - Justin Walker
 *     * Initial creation.
 * 
 *   04/29/2015 - Daniel Q. Yu
 *     * Modified for GW 7 compatibility.
 */
/**
 * Data model for OnBase MIKG keyword for linking.
 */
class Link {
  /** Keyword name. */
  var _type: DocumentLinkType as Type
  /** Keyword value. */
  var _value: String as Value
  /**
   * Constructor.
   *
   * @param type The document link type.
   * @param value The document linked value.
   */
  construct(lkType: DocumentLinkType, lkValue: String) {
    _type = lkType
    _value = lkValue
  }

  override function toString() : String {
    return "[" + _type + "=>" + _value + "]"
  }
}
