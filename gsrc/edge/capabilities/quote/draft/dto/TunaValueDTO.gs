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
uses gw.api.util.TypecodeMapperUtil
uses gw.api.util.TypecodeMapper

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 5/24/17
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */
class TunaValueDTO {

  private static final var MAPPING_NAMESPACE = "tuna"

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

  var _annotation: TunaValue

  var _propInfo: IPropertyInfo

  construct() {
    getAnnotation()
  }

  construct(propInfo: IPropertyInfo) {
    initialize(propInfo)
  }

  public final function initialize(propInfo: IPropertyInfo) {
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
    return featType typeis ITypeList && typeCode != null ? featType.getTypeKey(typeCode) : null
  }

  function isTypeList(propRef : PropertyReference): boolean {
    return propRef.PropertyInfo.FeatureType typeis ITypeList
  }

  property get TypeListOverrideValue(): TypeKey {
    return getTypeKey(_overrideValue as String)
  }

  property get ValueOrOverrideValue(): Object {
      return (this._overridden and this._overrideValue != null ? this._overrideValue : this._value)
  }

  function setValuesOnEntity(bean: KeyableBean) {
    if(bean != null){
      var annotation = getAnnotation()

      if(this._value != null || this._overrideValue != null) {
        setEntityValue(bean, annotation.ValuePropertyReference, getTranslatedValue(annotation.ValuePropertyReference, this._value, false))
        setEntityValue(bean, annotation.MatchLevelPropertyReference, this._tunaMatchLevel)
        setEntityValue(bean, annotation.IsOverriddenPropertyReference, this._overridden)
        if(this._overridden) {
          setEntityValue(bean, annotation.OverrideValuePropertyReference, getTranslatedValue(annotation.OverrideValuePropertyReference, this._overrideValue, false))
        }
      }
    }
  }

  function getValuesFromEntity(bean: KeyableBean) {
    if(bean != null) {
      var annotation = getAnnotation()
      _value = getTranslatedValue(annotation.ValuePropertyReference, getEntityValue(bean, annotation.ValuePropertyReference) as String, true)

      var overridden = getEntityValue(bean, annotation.IsOverriddenPropertyReference) as Boolean
      if(overridden) {
        _overridden = overridden
        _overrideValue = getTranslatedValue(annotation.OverrideValuePropertyReference, getEntityValue(bean, annotation.OverrideValuePropertyReference) as String, true)
      }
      if(_value != null || _overridden){
        _tunaMatchLevel = getEntityValue(bean, annotation.MatchLevelPropertyReference) as TUNAMatchLevel_Ext
      }
    }
  }

  private function setEntityValue(bean: KeyableBean, propRef: PropertyReference, obj: Object) {
    propRef?.set(getPropOwningBean(bean), obj)
  }

  private function getEntityValue(bean: KeyableBean, propRef: PropertyReference): Object {
    return propRef?.get(getPropOwningBean(bean))
  }

  function getTranslatedValue(propRef: PropertyReference, val: Object, getAlias: boolean): Object {
    return isTypeList(propRef) ? mapCode(propRef, val as String, getAlias) : val
  }

  function mapCode(propRef: PropertyReference, aliasOrCode: String, getAlias: boolean): Object {
    if(aliasOrCode == null) {
      return aliasOrCode
    }
    var valObj: Object = null
    var typeCodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    var typeListName = propRef.PropertyInfo.FeatureType.TypeInfo.Name

    if(typeCodeMapper.containsMappingFor(typeListName)) {
      valObj = getAlias ? getAliasByInternalCode(typeCodeMapper,typeListName, MAPPING_NAMESPACE, aliasOrCode)
          : getTypeKey(typeCodeMapper.getInternalCodeByAlias(typeListName, MAPPING_NAMESPACE, aliasOrCode))
    } else {
      valObj = getTypeKey(aliasOrCode)
    }
    return valObj
  }

  private function getAliasByInternalCode(mapper: TypecodeMapper, typeList : String, namespace : String, code : String) : String {
    var aliases = mapper.getAliasesByInternalCode(typeList, namespace, code)
    return aliases.Count != 0 ? aliases[0] : null
  }

  private function getPropOwningBean(bean: KeyableBean) : Object {

    var childNodeRefArray = getAnnotation().ChildNodePropRefs

    if(childNodeRefArray == null) {
      return bean
    }

    var childNodeValue: Object = null

    childNodeRefArray?.each( \ childPropRef -> {
      childNodeValue = childPropRef.get((childNodeValue?: bean))
    })

    return childNodeValue
  }

}