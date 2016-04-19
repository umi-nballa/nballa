package gw.lob.bp7.schedules

uses gw.lob.common.AbstractConditionMatcher
uses gw.entity.ILinkPropertyInfo

class BP7LocSchedCondItemCondMatcher extends AbstractConditionMatcher<BP7LocSchedCondItemCond> {
  construct(owner : BP7LocSchedCondItemCond) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7LocSchedCondItemCond#LocSchedCondItem.PropertyInfo as ILinkPropertyInfo
  }

}