package gw.lob.bp7.building
uses gw.coverage.AbstractCoverageMatcher
uses gw.entity.ILinkPropertyInfo

class BP7BuildingCovMatcher extends AbstractCoverageMatcher<BP7BuildingCov> {
  construct(owner : BP7BuildingCov) {
    super(owner)
  }

  override property get CoverableColumns() : List<ILinkPropertyInfo> {
    return {BP7BuildingCov#Building.PropertyInfo as ILinkPropertyInfo}
  }

}
