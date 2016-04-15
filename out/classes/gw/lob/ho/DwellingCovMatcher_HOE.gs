package gw.lob.ho

uses gw.coverage.AbstractCoverageMatcher
uses gw.entity.ILinkPropertyInfo

@Export
class DwellingCovMatcher_HOE extends AbstractCoverageMatcher<DwellingCov_HOE> {

  construct(owner : DwellingCov_HOE) {
    super(owner)
  }

  override property get CoverableColumns() : List<ILinkPropertyInfo> {
    return {DwellingCov_HOE.Type.TypeInfo.getProperty("Dwelling") as ILinkPropertyInfo}
  }
}
