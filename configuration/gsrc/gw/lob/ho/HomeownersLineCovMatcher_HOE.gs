package gw.lob.ho

uses gw.coverage.AbstractCoverageMatcher
uses gw.entity.ILinkPropertyInfo

@Export
class HomeownersLineCovMatcher_HOE extends AbstractCoverageMatcher<HomeownersLineCov_HOE> {

  construct(owner : HomeownersLineCov_HOE) {
    super(owner)
  }

  override property get CoverableColumns() : List<ILinkPropertyInfo> {
    return {HomeownersLineCov_HOE.Type.TypeInfo.getProperty("HOLine") as ILinkPropertyInfo}
  }
}
