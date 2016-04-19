package gw.lob.bp7.schedules

uses gw.entity.ILinkPropertyInfo
uses gw.lob.common.AbstractExclusionMatcher

class BP7BldgSchedExclItemExclMatcher extends AbstractExclusionMatcher<BP7BldgSchedExclItemExcl> {
  construct(owner : BP7BldgSchedExclItemExcl) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7BldgSchedExclItemExcl#BldgSchedExclItem.PropertyInfo as ILinkPropertyInfo
  }

}