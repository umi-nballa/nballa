package edge.capabilities.quote.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.capabilities.quote.draft.annotation.TunaValue
uses gw.lang.reflect.IPropertyInfo
uses edge.capabilities.quote.lob.homeowners.draft.metadata.DetailOf

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 5/24/17
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */
class TunaValueDTO {

  @JsonProperty
  @DetailOf("Overridden", false)//Required if not overridden
  var _value : Object as Value

  @JsonProperty
  var _tunaMatchLevel : TUNAMatchLevel_Ext as TunaMatchLevel

  @JsonProperty
  var _overridden : Boolean as Overridden

  @JsonProperty
  @DetailOf("Overridden", true)//Required if overridden
  var _overrideValue : Object as OverrideValue

  var _annotation: TunaValue as Annotation

  var _propInfo: IPropertyInfo

  construct() {

  }

  construct(propInfo: IPropertyInfo) {
    _propInfo = propInfo
  }

  public final function initialize(propInfo: IPropertyInfo): TunaValueDTO {
    _propInfo = propInfo
    return this
  }

  protected property get Annotation(): TunaValue {
    if(_annotation == null) {
      _annotation = _propInfo != null ? _propInfo.getAnnotation(TunaValue)?.Instance as TunaValue
        : this.IntrinsicType.TypeInfo.getAnnotation(TunaValue)?.Instance as TunaValue
    }
    return _annotation
  }

  property get ValueOrOverrideValue(): Object {
    return (this._overridden and this._overrideValue != null ? this._overrideValue : this._value)
  }

}