package gw.lob.bp7.location
uses gw.coverage.AbstractCoverageMatcher
uses gw.entity.ILinkPropertyInfo

class BP7LocationCovMatcher extends AbstractCoverageMatcher<BP7LocationCov> {
  construct(owner : BP7LocationCov) {
    super(owner)
  }

  override property get CoverableColumns() : List<ILinkPropertyInfo> {
    return {BP7LocationCov#Location.PropertyInfo as ILinkPropertyInfo}
  }

}
