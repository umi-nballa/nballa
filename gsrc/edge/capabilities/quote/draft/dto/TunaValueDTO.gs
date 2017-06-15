package edge.capabilities.quote.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.capabilities.quote.draft.annotation.TunaValue
uses gw.entity.ITypeList
uses gw.entity.TypeKey
uses gw.lang.reflect.features.PropertyReference
uses gw.lang.reflect.IPropertyInfo
uses gw.lang.reflect.features.IPropertyReference
uses com.sun.xml.internal.bind.v2.model.core.ValuePropertyInfo
uses gw.lang.reflect.TypeSystem
uses gw.lang.reflect.IType

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

//      var rootType = annotation.ValuePropertyReference.RootType
//
//      var ownerType = annotation.ValuePropertyReference.FeatureInfo.OwnersType
//      var typeOfBean = bean.IntrinsicType
//
//
//      if( bean.IntrinsicType == ownerType)    {
//      }
      annotation.ValuePropertyReference.set(bean, this.TypeListValue != null ? this.TypeListValue : this._value)
      annotation.MatchLevelPropertyReference.set(bean, this._tunaMatchLevel)
      annotation.IsOverriddenPropertyReference.set(bean, this._overridden)
      annotation.OverrideValuePropertyReference.set(bean, this.TypeListOverrideValue != null ? this.TypeListOverrideValue : this._overrideValue)

      //      bean.setFieldValue(this.ValuePropertyName, this.TypeListValue != null ? this.TypeListValue : this._value)
//      bean.setFieldValue(this.MatchLevelPropertyName, this._tunaMatchLevel)
//      bean.setFieldValue(this.IsOverriddenPropertyName, this._overridden)
//      bean.setFieldValue(this.OverrideValuePropertyName, this.TypeListOverrideValue != null ? this.TypeListOverrideValue : this._overrideValue)
    }
  }

  function getValuesFromEntity(bean: KeyableBean) {
    if(bean != null) {
//      _value = bean.getPropertyValue(this.ValuePropertyName) as String
//      _tunaMatchLevel = bean.getPropertyValue(this.MatchLevelPropertyName) as TUNAMatchLevel_Ext
//      _overridden = (bean.getPropertyValue(this.IsOverriddenPropertyName) ?: false) as Boolean
//      _overrideValue = bean.getPropertyValue(this.OverrideValuePropertyName) as String
//      var rootType =  getAnnotation().ValuePropertyReference.FeatureInfo.OwnersType;
//      if(bean.IntrinsicType typeis Dwelling_HOE){
//
//      }

      _value = getAnnotation().ValuePropertyReference.get(bean) as String
      _tunaMatchLevel = getAnnotation().MatchLevelPropertyReference.get(bean) as TUNAMatchLevel_Ext
      _overridden = (getAnnotation().IsOverriddenPropertyReference.get(bean) ?: false) as Boolean
      _overrideValue = getAnnotation().OverrideValuePropertyReference.get(bean) as String
    }
  }
}