package gw.lob.bp7.schedules

uses gw.coverage.AbstractCoverageMatcher
uses gw.entity.ILinkPropertyInfo

class BP7LocSchedCovItemCovMatcher extends AbstractCoverageMatcher<BP7LocSchedCovItemCov> {
  construct(owner : BP7LocSchedCovItemCov) {
    super(owner)
  }

  override property get CoverableColumns() :  List<ILinkPropertyInfo> {
    return {BP7LocSchedCovItemCov#LocSchedCovItem.PropertyInfo as ILinkPropertyInfo}
  }

}