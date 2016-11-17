package gw.lob.common.schedules

uses gw.lob.common.service.ServiceLocator
uses java.lang.Integer
uses gw.api.productmodel.ClausePattern
uses gw.api.domain.Clause
uses gw.api.productmodel.Schedule
uses gw.entity.TypeKey
uses gw.api.productmodel.ScheduleTypeKeyPropertyInfo
uses java.util.Date

enhancement ScheduledItemEnhancement : entity.ScheduledItem {
  property get Description() : String{
    return this.ScheduleParent?.getScheduledItemDescription(this)
  }

  public function setIntegerColumn(columnName : String, value : Integer) {
    ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<Integer>(columnName, this).setValue(value)
  }

  public function getIntegerColumn(columnName : String) : Integer {
    return ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<Integer>(columnName, this).Value
  }

  public function setStringColumn(columnName : String, value : String) {
    ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<String>(columnName, this).setValue(value)
  }

  public function getStringColumn(columnName : String) : String {
    return ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<String>(columnName, this).Value
  }

  public function setBooleanColumn(columnName : String, value : boolean) {
    ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<Boolean>(columnName, this).setValue(value)
  }

  public function getBooleanColumn(columnName : String) : boolean {
    return ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<Boolean>(columnName, this).Value
  }

  public function setTypeKeyColumn(columnName : String, value : TypeKey) {
    ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<String>(columnName, this).setValue(value.Code)
  }

  public function getTypeKeyColumn<T extends TypeKey>(columnName : String) : T {
    var typekeyInfo = ServiceLocator.get(ScheduleConfigSource)
      .getSchedulePropertyInfoByName(columnName, this.ScheduleParent as Clause & Schedule) as ScheduleTypeKeyPropertyInfo<T>

    return getTypeKeyColumnByPropertyInfo<T>(typekeyInfo)
  }

  public function setReadOnlyColumn(columnName : String, value : Object) {
    // Do nothing. It's read-only filed.
    // ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<String>(columnName, this).setValue(value)
  }

  public function getReadOnlyColumn<Object>(columnName : String) : Object {
    return ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<Object>(columnName, this).Value
  }

  public function getDateColumn(columnName : String) : Date {
    return ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<Date>(columnName, this).Value
  }

  public function getTypeKeyColumnByPropertyInfo<T extends TypeKey>(typekeyInfo : ScheduleTypeKeyPropertyInfo<T>) : T {
    var code = typekeyInfo.createValueProvider(this).Value as String

    if (code == null) return null

    var values = typekeyInfo.ValueRange as List<T>
    return values.singleWhere( \ value -> value.Code == code)
  }

  function isAvailableForItem(pattern : ClausePattern) : boolean {
    var schedule = this.ScheduleParent as Clause & gw.api.productmodel.Schedule
    var amendedClause = ServiceLocator.get(ScheduleConfigSource).getAmendedClause(schedule, pattern)
    var whenClause = ServiceLocator.get(ScheduleConfigSource).getWhenClause(schedule, pattern)

    /*print("## pattern is " + pattern)
    print("## this.ScheduleParent.ScheduledItemMultiPatterns?.contains(pattern) " + this.ScheduleParent.ScheduledItemMultiPatterns?.contains(pattern))
      print("## amendedClause " + amendedClause)
    print("## (this as Coverable).getCoverageConditionOrExclusion(amendedClause) " + (this as Coverable).getCoverageConditionOrExclusion(amendedClause))
    print("## whenClause " + whenClause)
    print("## schedule.OwningCoverable.getCoverageConditionOrExclusion(whenClause) " + schedule.OwningCoverable.getCoverageConditionOrExclusion(whenClause))*/

    return this.ScheduleParent.ScheduledItemMultiPatterns?.contains(pattern)
        and (amendedClause == null or (this as Coverable).getCoverageConditionOrExclusion(amendedClause) != null)
        and (whenClause == null or schedule.OwningCoverable.getCoverageConditionOrExclusion(whenClause) != null)
  }

  public function getAdditionalInsuredColumn(columnName: String = "AdditionalInsured") : PolicyAddlInsuredDetail {
    return ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<PolicyAddlInsuredDetail>(columnName, this).Value
  }

  public function setAdditionalInsuredColumn(columnName: String, value: PolicyAddlInsuredDetail) {
    ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<PolicyAddlInsuredDetail>(columnName, this).setValue(value)
  }

  public function getAdditionalInterestColumn(columnName: String = "AdditionalInterest") : AddlInterestDetail {
    return ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<AddlInterestDetail>(columnName, this).Value
  }

  public function setAdditionalInterestColumn(columnName: String, value: AddlInterestDetail) {
    ServiceLocator.get(ScheduleConfigSource).getScheduledItemValueProvider<AddlInterestDetail>(columnName, this).setValue(value)
  }
}
