package gw.lob.ho

uses gw.lob.common.AbstractConditionMatcher
uses gw.entity.ILinkPropertyInfo

@Export
class HomeownersLineCondMatcher_HOE extends AbstractConditionMatcher<HomeownersLineCond_HOE> {

  construct(owner : HomeownersLineCond_HOE) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return HomeownersLineCond_HOE.Type.TypeInfo.getProperty("HOLine") as ILinkPropertyInfo
  }
}