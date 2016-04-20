package gw.lob.bp7.location
uses gw.lob.common.AbstractConditionMatcher
uses gw.entity.ILinkPropertyInfo

class BP7LocationCondMatcher extends AbstractConditionMatcher<BP7LocationCond> {
  construct(owner : BP7LocationCond) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7LocationCond#Location.PropertyInfo as ILinkPropertyInfo
  }

}
