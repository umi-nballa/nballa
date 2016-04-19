package gw.lob.bp7.line

uses gw.entity.ILinkPropertyInfo
uses gw.lob.common.AbstractConditionMatcher

class BP7LineCondMatcher extends AbstractConditionMatcher<BP7LineCond> {

  construct(owner : BP7LineCond) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7LineCond#BP7Line.PropertyInfo as ILinkPropertyInfo
  }

}