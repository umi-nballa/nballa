package gw.lob.common.schedules.impl

uses gw.api.domain.Clause
uses gw.api.productmodel.Schedule
uses gw.api.productmodel.ScheduleNamedInsuredPropertyInfo
uses gw.api.productmodel.SchedulePropertyInfo

class ProxyScheduleNamedInsuredPropertyInfo extends ProxyScheduleForeignKeyPropertyInfo {
  construct(colName: String, colLabel: String,
            valRangeGetterClassName: String, isRequired: boolean) {
    super(colName, colLabel, valRangeGetterClassName, isRequired)
  }

  override function toSchedulePropertyInfo<T extends Schedule & Clause>(owner : T) : SchedulePropertyInfo {
    var valRangeGetter = newValueRangeGetterInstance(owner)    
    return new ScheduleNamedInsuredPropertyInfo(ColumnName, 
      ColumnLabel, valRangeGetter, Required)
  }
}
