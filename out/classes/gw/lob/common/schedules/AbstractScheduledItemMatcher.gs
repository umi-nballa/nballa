package gw.lob.common.schedules

uses gw.api.domain.Clause
uses gw.api.logicalmatch.AbstractEffDatedPropertiesMatcher
uses gw.api.productmodel.Schedule
uses gw.entity.IEntityPropertyInfo
uses gw.entity.ILinkPropertyInfo
uses gw.lob.common.service.ServiceLocator

uses java.lang.Iterable

abstract class AbstractScheduledItemMatcher<T extends EffDated & ScheduledItem> extends AbstractEffDatedPropertiesMatcher<T> {

  var _schedClause : Schedule & Clause
  var _scheduleParentProperty : String
  var _parentColumns : Iterable<ILinkPropertyInfo>
  var _identityColumns : Iterable<IEntityPropertyInfo>

  construct(owner : T, scheduleParentProperty : String) {
    super(owner)
    _scheduleParentProperty = scheduleParentProperty
  }

  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    if(_parentColumns == null){
      _parentColumns =  ServiceLocator
            .get(ScheduleConfigSource)
            .getScheduledItemParentColumns(ScheduleClause, T)
            .concat({T.Type.TypeInfo.getProperty(_scheduleParentProperty) as ILinkPropertyInfo})
    }
    return _parentColumns
  }

  override property get IdentityColumns() : Iterable<IEntityPropertyInfo> {
    if(_identityColumns == null){
      _identityColumns = ServiceLocator
            .get(ScheduleConfigSource)
            .getScheduledItemIdentityColumns(ScheduleClause, T)
    }
    return _identityColumns
  }

  private property get ScheduleClause() : Schedule & Clause {
    _schedClause = _entity.ScheduleParent as Schedule & Clause
    if(_schedClause == null){
      // to support some OOSE scenarios
      var orderedVersions = _entity.AdditionalVersions.orderBy(\ effDated -> effDated.EffectiveDate)
      for (version in orderedVersions) {
        _schedClause = (version as ScheduledItem).ScheduleParent as Schedule & Clause
        if (_schedClause != null) {
          break
        }
      }
      if(_schedClause == null) {
        _schedClause = (_entity.getSliceUntyped(_entity.EffectiveDate) as ScheduledItem).ScheduleParent as Schedule & Clause
      }
    }

    return _schedClause
  }
}