package gw.lob.bp7.line

uses gw.coverage.AbstractCoverageMatcher
uses gw.entity.ILinkPropertyInfo

class BP7LineCovMatcher extends AbstractCoverageMatcher<BP7LineCov> {

  construct(owner : BP7LineCov) {
    super(owner)
  }

  override property get CoverableColumns() : List<ILinkPropertyInfo> {
    return {
      BP7LineCov#BP7Line.PropertyInfo as ILinkPropertyInfo
    }
  }

}