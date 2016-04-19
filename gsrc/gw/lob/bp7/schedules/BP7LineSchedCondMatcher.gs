package gw.lob.bp7.schedules

uses gw.entity.ILinkPropertyInfo
uses gw.lob.common.AbstractConditionMatcher

class BP7LineSchedCondMatcher extends AbstractConditionMatcher<BP7LineSchedCond> {

  construct(owner : BP7LineSchedCond) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7LineSchedCond#BP7Line.PropertyInfo as ILinkPropertyInfo
  }

}