package gw.lob.bp7.schedules

uses gw.entity.ILinkPropertyInfo
uses gw.lob.common.AbstractExclusionMatcher

class BP7LineSchedExclMatcher extends AbstractExclusionMatcher<BP7LineSchedExcl> {

  construct(owner : BP7LineSchedExcl) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7LineSchedExcl#BP7Line.PropertyInfo as ILinkPropertyInfo
  }

}