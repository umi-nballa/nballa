package gw.api.productmodel
uses gw.entity.TypeKey
uses gw.entity.ITypeFilter
uses gw.entity.ITypeList
uses java.lang.IllegalArgumentException
uses gw.lang.reflect.IType

class ScheduleTypePropertyInfoWithDefaultValue<T extends TypeKey> extends ScheduleTypeKeyPropertyInfo<TypeKey> {

  var _defaultValue : String as DefaultValue

  construct(scheduledItemType : IType, columnName : String, colLabel : String, typeList : ITypeList<T>, typeFilter : ITypeFilter, isRequired : boolean, defaultVal : String) {
    super(scheduledItemType, columnName, colLabel, typeList, typeFilter, isRequired)
    _defaultValue = (getValueRange() as List<TypeKey>).firstWhere( \ t -> t.Code == defaultVal).Code
  }

  construct(columnName : String, colLabel : String, typeList : ITypeList<T>, typeFilter : ITypeFilter, isRequired : boolean, defaultVal : String) {
    super(columnName, colLabel, typeList, typeFilter, isRequired)
    _defaultValue = (getValueRange() as List<TypeKey>).firstWhere( \ t -> t.Code == defaultVal).Code
  }
}