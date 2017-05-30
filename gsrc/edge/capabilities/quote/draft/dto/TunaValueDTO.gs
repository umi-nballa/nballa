package edge.capabilities.quote.draft.dto

uses edge.jsonmapper.JsonProperty
/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 5/24/17
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */
class TunaValueDTO {

  @JsonProperty
  var _value : String as Value

  @JsonProperty
  var _tunaMatchLevel : TUNAMatchLevel_Ext as TunaMatchLevel

  @JsonProperty
  var _overridden : Boolean as Overridden

  @JsonProperty
  var _overrideValue : String as OverrideValue

  construct() {

  }

  construct(value: String) {
    this._value = value
    this._tunaMatchLevel = TunaMatchLevel_Ext.TC_EXACT
    this._overridden = false
  }

  construct(value: String, tunaMatchLevel: TunaMatchLevel_Ext, overridden: Boolean, overrideValue: String) {
    this._value = value
    this._tunaMatchLevel = tunaMatchLevel?: TunaMatchLevel_Ext.TC_EXACT
    this._overridden = overridden?: false
    this._overrideValue = overrideValue
  }
}