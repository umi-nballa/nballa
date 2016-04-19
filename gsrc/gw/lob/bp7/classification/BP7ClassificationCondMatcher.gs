package gw.lob.bp7.classification
uses gw.lob.common.AbstractConditionMatcher
uses gw.entity.ILinkPropertyInfo

class BP7ClassificationCondMatcher extends AbstractConditionMatcher<BP7ClassificationCond> {
  construct(owner : BP7ClassificationCond) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7ClassificationCond#Classification.PropertyInfo as ILinkPropertyInfo
  }

}
