package gw.lob.common.schedules.impl

uses com.guidewire.commons.config.APIConfigFileAccess
uses gw.api.productmodel.ClausePattern
uses gw.api.productmodel.Schedule
uses gw.api.productmodel.SchedulePropertyInfo
uses gw.api.productmodel.SchedulePropertyValueProvider
uses gw.entity.IEntityPropertyInfo
uses gw.entity.ILinkPropertyInfo
uses gw.lang.reflect.IType
uses gw.lang.reflect.TypeSystem
uses gw.lob.common.schedules.ScheduleConfigSource
uses gw.lob.common.schedules.schemas.schedule_config.Clause
uses gw.lob.common.schedules.schemas.schedule_config.Item
uses gw.lob.common.schedules.schemas.schedule_config.ScheduleConfig
uses gw.lob.common.schedules.schemas.schedule_config.types.complex.ForeignKeyPropertyInfoType
uses gw.lob.common.schedules.schemas.schedule_config.types.complex.PropertyInfoType
uses gw.lob.common.schedules.schemas.schedule_config.types.complex.TypeKeyPropertyInfoType

uses java.lang.Iterable
uses java.util.LinkedHashMap
uses java.util.Map

class ScheduleConfigXMLSource implements ScheduleConfigSource {

  var _scheduleConfigFileName : String
  
  var _propInfoProvider = new ScheduleConfigXMLInfoProvider()
  
  /*
   * a map of clause pattern (or owner relative name) to its schedule property infos,
   * which are, in turn, mapped by their name (as defined in the config XML file)
   */
  var _schedulePropertyInfos : Map<String, LinkedHashMap<String, PropertyInfoType>> = {}

  var _complexScheduleCoverages : Map<String, List<Item>> = {}.toAutoMap(\ defaultToEmpty -> {return {}})

  construct() {
    this("config/resources/schedule-config.xml")
  }
  
  construct(scheduleConfigFileName : String) {
    _scheduleConfigFileName = scheduleConfigFileName
    initSchedulePropertyInfos()    
  }

  private function initSchedulePropertyInfos() {
    var scheduleConfig =  getScheduleConfig()    
    for (clause in scheduleConfig.Clause) {      
      initSchedulePropertyInfosForClause(clause)
      initScheduleMultiPatterns(clause)
    }
  }
  
  private function getScheduleConfig() : ScheduleConfig {
    var scheduleConfigFile = APIConfigFileAccess.INSTANCE.getConfigFile(_scheduleConfigFileName)
    if (scheduleConfigFile == null or not scheduleConfigFile.exists()) {
      throw "could not find ${_scheduleConfigFileName}"
    }    
    return ScheduleConfig.parse(scheduleConfigFile) 
  }

  private function initScheduleMultiPatterns(clause : Clause) {
    if (clause.Item.HasElements) {
      _complexScheduleCoverages.put(clause.Pattern, clause.Item)
    }
  }

  private function initSchedulePropertyInfosForClause(clause : Clause) {
    var clauseSchedPropertyInfos = new LinkedHashMap<String, PropertyInfoType>()
    clause.PropertyInfos.orderBy(\ p -> p.Priority).each(\ p -> {
      clauseSchedPropertyInfos.put(p.Name, p)
    })    
    _schedulePropertyInfos.put(clause.Pattern, clauseSchedPropertyInfos)
  }

  override function getPropertyInfos<T extends Schedule & gw.api.domain.Clause>(owner : T) : SchedulePropertyInfo[] {
    var clauseSchedPropertyInfos = _schedulePropertyInfos.get((typeof owner).RelativeName)
    if (clauseSchedPropertyInfos == null) {
      throw "no schedule properties defined for ${(typeof owner).RelativeName}"
    }
    /* 
     * this returns a new array of the property infos;
     * the property infos themselves are immutable, making them safe to export   
     */
    return clauseSchedPropertyInfos
      .Values
      .where( \ elt -> true)  //schedule availability
      .map(\ info -> {
        var schedulePropInfo = _propInfoProvider.newSchedulePropertyInfo(info)
        if (ProxyScheduleForeignKeyPropertyInfo.Type.isAssignableFrom(typeof schedulePropInfo)) {
          return (schedulePropInfo as ProxyScheduleForeignKeyPropertyInfo).toSchedulePropertyInfo(owner)
        }
        return schedulePropInfo
      })
      .toTypedArray()
  }

  override function getScheduledItemValueProvider<V>(name: String, item: ScheduledItem): SchedulePropertyValueProvider<V> {
    var provider : SchedulePropertyValueProvider<V> = null

    var schedulePropInfo = getSchedulePropertyInfoByName(name, item.ScheduleParent as gw.api.domain.Clause & Schedule)
    if (schedulePropInfo <> null) {
      // Can we just use createValueProvider(item) instead of the following??
      var propInfo = schedulePropInfo.PropertyInfo
      if (ProxyScheduleForeignKeyPropertyInfo.Type
          .isAssignableFrom(typeof schedulePropInfo)) {
        propInfo = (schedulePropInfo as ProxyScheduleForeignKeyPropertyInfo)
            .getPropertyInfo(item.ScheduleParent as Schedule & gw.api.domain.Clause)
      }
      provider = new SchedulePropertyValueProvider<V>(item, propInfo)
    }

    if (provider == null) {
      throw "could not find schedule info property with " + 
        "name ${name} for owner ${typeof item.ScheduleParent}"  
    }
    return provider
  }

  override function getScheduledItemParentColumns(owner : Schedule & gw.api.domain.Clause, itemType : IType) : Iterable<ILinkPropertyInfo> {
    var clauseSchedPropertyInfos = _schedulePropertyInfos.get(owner.Pattern.CodeIdentifier)
    if (clauseSchedPropertyInfos == null) {
      throw "no schedule properties defined for ${owner.Pattern.CodeIdentifier}"
    }
    /*
     * this returns a new array of the property infos;
     * the property infos themselves are immutable, making them safe to export
     */
    return clauseSchedPropertyInfos
      .Values
      .where(\ info -> info.IsKey and (info typeis ForeignKeyPropertyInfoType))
      .map(\ info -> itemType.TypeInfo.getProperty(info.ColumnName) as ILinkPropertyInfo)
  }

  override function getScheduledItemIdentityColumns(owner : Schedule & gw.api.domain.Clause, itemType : IType) : Iterable<IEntityPropertyInfo> {
    var clauseSchedPropertyInfos = _schedulePropertyInfos.get(owner.Pattern.CodeIdentifier)
    if (clauseSchedPropertyInfos == null) {
      throw "no schedule properties defined for ${owner.Pattern.CodeIdentifier}"
    }
    /*
     * this returns a new array of the property infos;
     * the property infos themselves are immutable, making them safe to export
     */
    var keyColumns = clauseSchedPropertyInfos
      .Values
      .where(\ info -> info.IsKey)
    var nonForeignKeyColumns = keyColumns
      .where(\ info -> not (info typeis ForeignKeyPropertyInfoType))
      .map(\ info -> itemType.TypeInfo.getProperty(info.ColumnName) as IEntityPropertyInfo)
    /*
     * if non-foreign key scheduled item columns are present then return them
     * if foreign key columns are the only key columns then return empty array
     * if no key columns defined then return ID column
     */
    return nonForeignKeyColumns.HasElements ? nonForeignKeyColumns : (keyColumns.HasElements ? {} : {itemType.TypeInfo.getProperty("ID") as IEntityPropertyInfo})
  }

  override function getClauseMultiPatterns(owner : gw.api.domain.Clause): List<ClausePattern> {
    return _complexScheduleCoverages.get(owner.Pattern.CodeIdentifier)*.Pattern.toList() as List<ClausePattern>
  }

  override function getScheduledItemKeyColumns(item : ScheduledItem) : List<PropertyInfoType>{
    var propertyName = (typeof item.ScheduleParent).RelativeName
    var clauseSchedPropertyInfos = _schedulePropertyInfos.get(propertyName)
    if (clauseSchedPropertyInfos == null) {
      throw "no schedule properties defined for ${propertyName}"
    }
    /*
     * this returns a new array of the property infos;
     * the property infos themselves are immutable, making them safe to export
     */
    return clauseSchedPropertyInfos
      .Values
      .where(\ info -> info.IsKey)
  }

  override function getScheduledItemKeyDisplayNames(item: ScheduledItem): Iterable<String> {
    return getScheduledItemKeyColumns(item).map(\info -> {
      var value = item.getFieldValue(info.ColumnName)
      if (info typeis TypeKeyPropertyInfoType) {
        var typeList = TypeSystem.getByFullName("typekey.${info.TypeList}") as gw.entity.ITypeList
        value = typeList.getTypeKey(value as String).DisplayName
      }
      return (info typeis ForeignKeyPropertyInfoType)
           ? (value as EffDated).DisplayName
           : value as String
    })
  }

  override function getSchedulePropertyInfoByName(name: String, schedule: gw.api.domain.Clause & Schedule): SchedulePropertyInfo {
    var schedulePropInfo: SchedulePropertyInfo = null
    var clausePattern = schedule.Pattern.CodeIdentifier
    var clauseSchedPropertyInfos = _schedulePropertyInfos.get(clausePattern)
    if (clauseSchedPropertyInfos <> null) {
      var info = clauseSchedPropertyInfos.get(name)
      if (info <> null) {
        schedulePropInfo = _propInfoProvider.newSchedulePropertyInfo(info)
      }
    }

    if (schedulePropInfo == null) {
      throw "could not find schedule info property with name ${name} for schedule " + clausePattern
    }

    if (ProxyScheduleForeignKeyPropertyInfo.Type.isAssignableFrom(typeof schedulePropInfo)) {
      return (schedulePropInfo as ProxyScheduleForeignKeyPropertyInfo).toSchedulePropertyInfo(schedule)
    }
    return schedulePropInfo
  }

  override function getAmendedClause(schedule: gw.api.domain.Clause & Schedule, itemPattern: ClausePattern): ClausePattern {
    var schedItems = _complexScheduleCoverages.get(schedule.Pattern.CodeIdentifier)
    var itemClause = schedItems.firstWhere(\item -> item.Pattern == itemPattern.CodeIdentifier)
    var pattern = itemClause.AmendmentOf
    return pattern.HasContent ? pattern : null
  }

  override function getWhenClause(schedule: gw.api.domain.Clause & Schedule, itemPattern: ClausePattern): ClausePattern {
    var schedItems = _complexScheduleCoverages.get(schedule.Pattern.CodeIdentifier)
    var itemClause = schedItems.firstWhere(\item -> item.Pattern == itemPattern.CodeIdentifier)
    var pattern = itemClause.WhenClause
    return pattern.HasContent ? pattern : null
  }

  override function isHideFromSummary(schedule: gw.api.domain.Clause & Schedule, itemPattern: ClausePattern): boolean {
    var schedItems = _complexScheduleCoverages.get(schedule.Pattern.CodeIdentifier)
    var itemClause = schedItems.firstWhere(\item -> item.Pattern == itemPattern.CodeIdentifier)
    return itemClause.HideFromSummary
  }
}
