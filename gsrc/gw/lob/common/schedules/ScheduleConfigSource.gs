package gw.lob.common.schedules

uses gw.api.domain.Clause
uses gw.api.productmodel.Schedule
uses gw.api.productmodel.SchedulePropertyInfo
uses gw.entity.IEntityPropertyInfo
uses gw.entity.ILinkPropertyInfo
uses gw.lang.reflect.IType
uses java.lang.Iterable
uses gw.lob.common.schedules.schemas.schedule_config.types.complex.PropertyInfoType
uses gw.api.productmodel.ClausePattern
uses gw.api.productmodel.SchedulePropertyValueProvider

interface ScheduleConfigSource {
  function getPropertyInfos<T extends Schedule & Clause>(owner: T): SchedulePropertyInfo[]

  function getScheduledItemValueProvider<V>(name: String, item: ScheduledItem): SchedulePropertyValueProvider<V>

  function getScheduledItemParentColumns(owner: Schedule & Clause, itemType: IType): Iterable<ILinkPropertyInfo>

  function getScheduledItemIdentityColumns(owner : Schedule & Clause, itemType : IType) : Iterable<IEntityPropertyInfo>

  function getClauseMultiPatterns(owner : Clause): List<ClausePattern>

  function getScheduledItemKeyColumns(item : ScheduledItem) : List<PropertyInfoType>

  function getScheduledItemKeyDisplayNames(item : ScheduledItem) : Iterable<String>

  function getSchedulePropertyInfoByName(name : String, schedule : Schedule & Clause) : SchedulePropertyInfo

  function getAmendedClause(schedule : Schedule & Clause, itemPattern : ClausePattern): ClausePattern

  function getWhenClause(schedule : Schedule & Clause, itemPattern : ClausePattern): ClausePattern

  function isHideFromSummary(schedule : Schedule & Clause, itemPattern : ClausePattern): boolean
}
