package gw.lob.bp7.schedules

uses gw.lob.common.AbstractConditionMatcher
uses gw.entity.ILinkPropertyInfo

class BP7LineSchedCondItemCondMatcher extends AbstractConditionMatcher<BP7LineSchedCondItemCond> {
  construct(owner : BP7LineSchedCondItemCond) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7LineSchedCondItemCond#LineSchedCondItem.PropertyInfo as ILinkPropertyInfo
  }

}