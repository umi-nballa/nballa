package gw.lob.bp7.building
uses gw.lob.common.AbstractConditionMatcher
uses gw.entity.ILinkPropertyInfo

class BP7BuildingCondMatcher extends AbstractConditionMatcher<BP7BuildingCond> {
  construct(owner : BP7BuildingCond) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7BuildingCond#Building.PropertyInfo as ILinkPropertyInfo
  }

}
