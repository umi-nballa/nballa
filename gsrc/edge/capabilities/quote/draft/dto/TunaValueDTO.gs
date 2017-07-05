package edge.capabilities.quote.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.capabilities.quote.draft.annotation.TunaValue
uses gw.entity.ITypeList
uses gw.entity.TypeKey
uses gw.lang.reflect.IPropertyInfo
uses gw.lang.reflect.features.IPropertyReference
uses gw.lang.reflect.features.PropertyReference
uses edge.capabilities.quote.lob.homeowners.draft.metadata.DetailOf
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
  @DetailOf("Overridden", false)//Required if not overridden
  var _value : Object as Value

  @JsonProperty
  var _tunaMatchLevel : TUNAMatchLevel_Ext as TunaMatchLevel

  @JsonProperty
  var _overridden : Boolean as Overridden

  @JsonProperty
  @DetailOf("Overridden")//Required if overridden
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

  private function getAnnotation(): TunaValue {
    if(_annotation == null) {
      _annotation = _propInfo != null ? _propInfo.getAnnotation(TunaValue)?.Instance as TunaValue
        : this.IntrinsicType.TypeInfo.getAnnotation(TunaValue)?.Instance as TunaValue
    }
    return _annotation
  }

  private function getTypeKey(typeCode: String): TypeKey {
    var featType = getAnnotation().ValuePropertyReference.PropertyInfo.FeatureType
    return featType typeis ITypeList ? (featType as ITypeList).getTypeKey(_value) : null
  }

  property get TypeListValue(): TypeKey {
    return getTypeKey(_value)
  }

  property get TypeListOverrideValue(): TypeKey {
    return getTypeKey(_overrideValue)
  }

  property get ValueOrOverrideValue(): Object {
      return (this._overridden and this._overrideValue != null ? this._overrideValue : this._value)
  }

//  static function GetValueOrOverride(inst: TunaValueDTO): Object {
//    return inst.ValueOrOverrideValue
//  }

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
    propRef?.set(getPropOwningBean(bean), obj)
  }

  private function getValue(bean: KeyableBean, propRef: PropertyReference): Object {
    return propRef?.get(getPropOwningBean(bean))
  }

  private function getPropOwningBean(bean: KeyableBean) : Object {

    var childNodeRefArray = getAnnotation().ChildNodePropRefs

    if(childNodeRefArray == null) {
      return bean
    }

    var childNodeValue: Object = null

    childNodeRefArray?.each( \ childPropRef -> {
      childNodeValue = childPropRef.get((childNodeValue?: bean as KeyableBean))
    })

    return childNodeValue
  }

}