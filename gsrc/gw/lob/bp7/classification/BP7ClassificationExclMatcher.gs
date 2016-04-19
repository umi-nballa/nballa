package gw.lob.bp7.classification
uses gw.lob.common.AbstractExclusionMatcher
uses gw.entity.ILinkPropertyInfo

class BP7ClassificationExclMatcher extends AbstractExclusionMatcher<BP7ClassificationExcl> {
  construct(owner : BP7ClassificationExcl) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7ClassificationExcl#Classification.PropertyInfo as ILinkPropertyInfo
  }

}
