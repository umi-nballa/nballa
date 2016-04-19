package gw.lob.bp7.classification
uses gw.coverage.AbstractCoverageMatcher
uses gw.entity.ILinkPropertyInfo

class BP7ClassificationCovMatcher extends AbstractCoverageMatcher<BP7ClassificationCov> {
  construct(owner : BP7ClassificationCov) {
    super(owner)
  }

  override property get CoverableColumns() : List<ILinkPropertyInfo> {
    return {BP7ClassificationCov#Classification.PropertyInfo as ILinkPropertyInfo}
  }

}
