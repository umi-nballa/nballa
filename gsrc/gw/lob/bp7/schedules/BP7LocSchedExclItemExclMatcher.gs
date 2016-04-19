package gw.lob.bp7.schedules

uses gw.entity.ILinkPropertyInfo
uses gw.lob.common.AbstractExclusionMatcher

class BP7LocSchedExclItemExclMatcher extends AbstractExclusionMatcher<BP7LocSchedExclItemExcl> {
  construct(owner : BP7LocSchedExclItemExcl) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7LocSchedExclItemExcl#LocSchedExclItem.PropertyInfo as ILinkPropertyInfo
  }

}