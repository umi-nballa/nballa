package gw.lob.bp7.location
uses gw.lob.common.AbstractExclusionMatcher
uses gw.entity.ILinkPropertyInfo

class BP7LocationExclMatcher extends AbstractExclusionMatcher<BP7LocationExcl> {
  construct(owner : BP7LocationExcl) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7LocationExcl#Location.PropertyInfo as ILinkPropertyInfo
  }

}
