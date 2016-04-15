package gw.lob.ho

uses gw.entity.ILinkPropertyInfo
uses gw.lob.common.AbstractExclusionMatcher

@Export
class HomeownersLineExclMatcher_HOE extends AbstractExclusionMatcher<HomeownersLineExcl_HOE>{

  construct(owner : HomeownersLineExcl_HOE) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return HomeownersLineExcl_HOE.Type.TypeInfo.getProperty("HOLine") as ILinkPropertyInfo
  }
}