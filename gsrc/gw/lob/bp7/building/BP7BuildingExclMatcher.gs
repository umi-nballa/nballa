package gw.lob.bp7.building

uses gw.lob.common.AbstractExclusionMatcher
uses gw.entity.ILinkPropertyInfo

class BP7BuildingExclMatcher extends AbstractExclusionMatcher<BP7BuildingExcl> {
  construct(owner : BP7BuildingExcl) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return BP7BuildingExcl#Building.PropertyInfo as ILinkPropertyInfo
  }

}
