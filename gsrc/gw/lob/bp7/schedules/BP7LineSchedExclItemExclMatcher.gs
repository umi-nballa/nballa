package gw.lob.bp7.schedules

uses gw.entity.ILinkPropertyInfo
uses gw.lob.common.AbstractExclusionMatcher

class BP7LineSchedExclItemExclMatcher extends AbstractExclusionMatcher<BP7LineSchedExclItemExcl> {
  construct(owner : BP7LineSchedExclItemExcl) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7LineSchedExclItemExcl#LineSchedExclItem.PropertyInfo as ILinkPropertyInfo
  }

}