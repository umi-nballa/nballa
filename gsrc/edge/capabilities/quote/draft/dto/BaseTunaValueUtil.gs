package edge.capabilities.quote.draft.dto

uses gw.lang.reflect.IPropertyInfo
uses gw.lang.reflect.IType
uses gw.lang.reflect.features.PropertyReference
uses gw.entity.ITypeList
uses gw.api.util.TypecodeMapper
uses gw.entity.TypeKey

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 6/22/17
 * Time: 3:36 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class BaseTunaValueUtil {

  private static final var MAPPING_NAMESPACE = "tuna"

  /**
  * Find TunaValueDTO properties on a DTO object and map them TO/FROM an entity
  * @param data - GW Entity to use during mapping
  * @param dtoInstance - The instance of a DTO that contains TunaValueDTO properties to map
  * @param dtoType - The type the dtoInstance Object equals
  * @param direction - The direction to map in
  */
  protected static function mapTunaFields(data : KeyableBean, dtoInstance: Object, dtoType: IType, direction: MapDTODirection) {
     dtoType.TypeInfo.Properties.where( \ pInfo -> pInfo.FeatureType == TunaValueDTO.Type).each( \ propInfo -> mapTunaValue(data, dtoInstance, propInfo, direction))
  }

  protected static function mapTunaValue(data : KeyableBean, dtoInstance: Object, tunaDtoProp: IPropertyInfo, direction: MapDTODirection) {
    if(MapDTODirection.FROM.equals(direction)) {
      if(dtoInstance != null) {
        var tunaDTO = tunaDtoProp.Accessor.getValue(dtoInstance) as TunaValueDTO
        if(tunaDTO != null) {
          tunaDTO = tunaDTO.initialize(tunaDtoProp)
          setValuesOnEntity(data, tunaDTO)
        }
      }
    } else {
      var tunaDTO = new TunaValueDTO(tunaDtoProp)
      getValuesFromEntity(data, tunaDTO)
      if(tunaDTO.Value != null || tunaDTO.OverrideValue != null) {
        tunaDtoProp.Accessor.setValue(dtoInstance, tunaDTO)
      }
    }
  }

  /**
  * Set the values on an entity using a TunaValueDTO
  *
  * @param bean - The entity that we want to set values on
  * @param dto - The TunaValueDTO that we will use to get values from
  */
  static function setValuesOnEntity(bean: KeyableBean, dto: TunaValueDTO) {
    if(bean != null){
      var annotation = dto.Annotation

      if(dto.Value != null || dto.OverrideValue != null) {
        setEntityValue(bean, annotation.ValuePropertyReference, getTranslatedValue(annotation.ValuePropertyReference, dto.Value, false), dto)
        setEntityValue(bean, annotation.MatchLevelPropertyReference, dto.TunaMatchLevel, dto)
        setEntityValue(bean, annotation.IsOverriddenPropertyReference, dto.Overridden, dto)
        if(dto.Overridden) {
          setEntityValue(bean, annotation.OverrideValuePropertyReference, getTranslatedValue(annotation.OverrideValuePropertyReference, dto.OverrideValue, false), dto)
        }
      }
    }
  }

  /**
   * Get the values from an entity and populate a TunaValueDTO
   *
   * @param bean - The entity that we want to set values on
   * @param dto - The TunaValueDTO that we will use to get values from
   */
  static function getValuesFromEntity(bean: KeyableBean, dto: TunaValueDTO) {
    if(bean != null) {
      var annotation = dto.Annotation
      dto.Value = getTranslatedValue(annotation.ValuePropertyReference, getEntityValue(bean, annotation.ValuePropertyReference, dto) as String, true)

      var overridden = getEntityValue(bean, annotation.IsOverriddenPropertyReference, dto) as Boolean
      if(overridden) {
        dto.Overridden = overridden
        dto.OverrideValue = getTranslatedValue(annotation.OverrideValuePropertyReference, getEntityValue(bean, annotation.OverrideValuePropertyReference, dto) as String, true)
      }
      if(dto.Value != null || dto.OverrideValue != null){
        dto.TunaMatchLevel = getEntityValue(bean, annotation.MatchLevelPropertyReference, dto) as TUNAMatchLevel_Ext
      }
    }
  }

  private static function setEntityValue(bean: KeyableBean, propRef: PropertyReference, obj: Object, dto: TunaValueDTO) {
    propRef?.set(getPropOwningBean(bean, dto), obj)
  }

  private static function getEntityValue(bean: KeyableBean, propRef: PropertyReference, dto: TunaValueDTO): Object {
    return propRef?.get(getPropOwningBean(bean, dto))
  }

  static function getTranslatedValue(propRef: PropertyReference, val: Object, getAlias: boolean): Object {
    return propRef.PropertyInfo.FeatureType typeis ITypeList ? mapCode(propRef, val as String, getAlias) : val
  }

  private static function getTypeKey(propRef: PropertyReference, typeCode: String): TypeKey {
    var featureType = propRef.PropertyInfo.FeatureType
    return featureType typeis ITypeList && typeCode != null ? featureType.getTypeKey(typeCode) : null
  }

  private static function mapCode(propRef: PropertyReference, aliasOrCode: String, getAlias: boolean): Object {
    if(aliasOrCode == null) {
      return aliasOrCode
    }
    var valObj: Object = null

    var typeCodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    var typeListName = propRef.PropertyInfo.FeatureType.TypeInfo.Name

    if(typeCodeMapper.containsMappingFor(typeListName)) {
      valObj = getAlias ? getAliasByInternalCode(typeCodeMapper,typeListName, MAPPING_NAMESPACE, aliasOrCode)
          : getTypeKey(propRef, typeCodeMapper.getInternalCodeByAlias(typeListName, MAPPING_NAMESPACE, aliasOrCode))
    } else {
      valObj = getTypeKey(propRef, aliasOrCode)
    }

    if(valObj == null){
      valObj = getTypeKey(propRef, aliasOrCode)
    }
    return valObj
  }

  private static function getAliasByInternalCode(mapper: TypecodeMapper, typeList : String, namespace : String, code : String) : String {
    var aliases = mapper.getAliasesByInternalCode(typeList, namespace, code)
    return aliases.Count != 0 ? aliases[0] : null
  }

  /**
   * This is method is used to help in cases when a TunaValue is on a child property of the incoming bean used.
   * If a TunaValueDTO is annotated with any values for the ChildNodePropertyReferences,
   * iterate over the collection and get the bean value from each child property and return it.
   * @param bean - The entity we are using to map values TO/FROM
   * @param dto - The TunaValueDTO that we are using to get values from
  */
  private static function getPropOwningBean(bean: KeyableBean, dto: TunaValueDTO) : Object {

    var childNodeRefArray = dto.getAnnotation().ChildNodePropRefs

    if(childNodeRefArray == null) {
      return bean
    }

    var childNodeValue: Object = null

    childNodeRefArray?.each( \ childPropRef -> {
      childNodeValue = childPropRef.get((childNodeValue?: bean))
    })

    return childNodeValue
  }

  /**
  * Direction to map entity in
  */
  protected enum MapDTODirection {

    /**
     * Map an entity TO a DTO
    */
    TO(),
    /**
     * From a DTO to an entity
    */
    FROM()
  }
}