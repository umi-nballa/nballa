package gw.lob.bp7.schedules

uses gw.entity.ILinkPropertyInfo
uses gw.lob.common.AbstractExclusionMatcher

class BP7ClassSchedExclItemExclMatcher extends AbstractExclusionMatcher<BP7ClassSchedExclItemExcl> {
  construct(owner : BP7ClassSchedExclItemExcl) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7ClassSchedExclItemExcl#ClassSchedExclItem.PropertyInfo as ILinkPropertyInfo
  }

}