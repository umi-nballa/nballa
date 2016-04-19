package gw.lob.bp7.schedules

uses gw.coverage.AbstractCoverageMatcher
uses gw.entity.ILinkPropertyInfo

class BP7ClassSchedCovItemCovMatcher extends AbstractCoverageMatcher<BP7ClassSchedCovItemCov> {
  construct(owner : BP7ClassSchedCovItemCov) {
    super(owner)
  }

  override property get CoverableColumns() :  List<ILinkPropertyInfo> {
    return {BP7ClassSchedCovItemCov#ClassSchedCovItem.PropertyInfo as ILinkPropertyInfo}
  }

}