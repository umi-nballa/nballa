package gw.lob.bp7.line

uses gw.entity.ILinkPropertyInfo
uses gw.lob.common.AbstractExclusionMatcher

class BP7LineExclMatcher extends AbstractExclusionMatcher<BP7LineExcl> {

  construct(owner : BP7LineExcl) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7LineExcl#BP7Line.PropertyInfo as ILinkPropertyInfo
  }

}