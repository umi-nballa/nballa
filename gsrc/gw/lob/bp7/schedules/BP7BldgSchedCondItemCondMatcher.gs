package gw.lob.bp7.schedules

uses gw.lob.common.AbstractConditionMatcher
uses gw.entity.ILinkPropertyInfo

class BP7BldgSchedCondItemCondMatcher extends AbstractConditionMatcher<BP7BldgSchedCondItemCond> {
  construct(owner : BP7BldgSchedCondItemCond) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7BldgSchedCondItemCond#BldgSchedCondItem.PropertyInfo as ILinkPropertyInfo
  }

}