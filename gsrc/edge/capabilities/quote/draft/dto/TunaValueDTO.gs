package edge.capabilities.quote.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.capabilities.quote.draft.annotation.TunaValue
uses gw.entity.ITypeList
uses gw.entity.TypeKey
uses gw.lang.reflect.IPropertyInfo
uses gw.lang.reflect.features.IPropertyReference
uses gw.lang.reflect.features.PropertyReference
uses java.lang.Exception
uses gw.lang.reflect.TypeSystem
uses java.lang.Class

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 5/24/17
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */
class TunaValueDTO {

  @JsonProperty
  var _value : Object as Value

  @JsonProperty
  var _tunaMatchLevel : TUNAMatchLevel_Ext as TunaMatchLevel

  @JsonProperty
  var _overridden : Boolean as Overridden

  @JsonProperty
  var _overrideValue : Object as OverrideValue

  var _annotation: TunaValue

  var _propInfo: IPropertyInfo

  construct() {
    getAnnotation()
  }

  construct(propInfo: IPropertyInfo) {
    initialize(propInfo)
  }

  public function initialize(propInfo: IPropertyInfo) {
    _propInfo = propInfo
    getAnnotation()
  }

  public function initialize(propRef: IPropertyReference) {
    initialize(propRef.PropertyInfo)
  }

  private function getAnnotation(): TunaValue {
    if(_annotation == null) {
      _annotation = _propInfo != null ? _propInfo.getAnnotation(TunaValue)?.Instance as TunaValue
        : this.IntrinsicType.TypeInfo.getAnnotation(TunaValue)?.Instance as TunaValue
    }
    return _annotation
  }

  property get TypeListValue(): TypeKey {
    return getAnnotation().ValueType typeis ITypeList ? (getAnnotation().ValueType as ITypeList).getTypeKey(_value) : null
  }

  property get TypeListOverrideValue(): TypeKey {
    return getAnnotation().ValueType typeis ITypeList ? (getAnnotation().ValueType as ITypeList).getTypeKey(_overrideValue) : null
  }

  property get ValueOrOverrideValue(): String {
      return (this._overridden and this._overrideValue != null ? this._overrideValue : this._value)
  }

  property get ValuePropertyName(): String {
    return getAnnotation().ValuePropertyName
  }

  property get MatchLevelPropertyName(): String {
    return getAnnotation().MatchLevelPropertyName
  }

  property get IsOverriddenPropertyName(): String {
    return getAnnotation().IsOverriddenPropertyName
  }

  property get OverrideValuePropertyName(): String {
    return getAnnotation().OverrideValuePropertyName
  }

  function setValuesOnEntity(bean: KeyableBean) {
    if(bean != null){
      var annotation = getAnnotation()
      setValue(bean, annotation.ValuePropertyReference, this.TypeListValue != null ? this.TypeListValue : this._value)
      setValue(bean, annotation.MatchLevelPropertyReference, this._tunaMatchLevel)
      setValue(bean, annotation.IsOverriddenPropertyReference, this._overridden)
      setValue(bean, annotation.OverrideValuePropertyReference, this.TypeListOverrideValue != null ? this.TypeListOverrideValue : this._overrideValue)
    }
  }

  function getValuesFromEntity(bean: KeyableBean) {
    if(bean != null) {
      var annotation = getAnnotation()

      _value = getValue(bean, annotation.ValuePropertyReference) as String
      _tunaMatchLevel = getValue(bean, annotation.MatchLevelPropertyReference) as TUNAMatchLevel_Ext
      _overridden = getValue(bean, annotation.IsOverriddenPropertyReference) as Boolean
      _overrideValue = getValue(bean, annotation.OverrideValuePropertyReference) as String
    }
  }

  private function setValue(bean: KeyableBean, propRef: PropertyReference, obj: Object) {
    var childRef = getAnnotation().ChildPropertyReference
    propRef?.set(childRef == null ? bean : childRef.get(bean), obj)
  }

  private function getValue(bean: KeyableBean, propRef: PropertyReference): Object {
    var childRef = getAnnotation().ChildPropertyReference
    return propRef?.get(childRef == null ? bean : childRef.get(bean))
  }
}