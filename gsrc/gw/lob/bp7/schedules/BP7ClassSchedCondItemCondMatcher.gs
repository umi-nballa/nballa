package gw.lob.bp7.schedules

uses gw.lob.common.AbstractConditionMatcher
uses gw.entity.ILinkPropertyInfo

class BP7ClassSchedCondItemCondMatcher extends AbstractConditionMatcher<BP7ClassSchedCondItemCond> {
  construct(owner : BP7ClassSchedCondItemCond) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7ClassSchedCondItemCond#ClassSchedCondItem.PropertyInfo as ILinkPropertyInfo
  }

}