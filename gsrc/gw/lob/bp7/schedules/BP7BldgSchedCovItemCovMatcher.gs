package gw.lob.bp7.schedules

uses gw.coverage.AbstractCoverageMatcher
uses gw.entity.ILinkPropertyInfo

class BP7BldgSchedCovItemCovMatcher extends AbstractCoverageMatcher<BP7BldgSchedCovItemCov> {
  construct(owner : BP7BldgSchedCovItemCov) {
    super(owner)
  }

  override property get CoverableColumns() :  List<ILinkPropertyInfo> {
    return {BP7BldgSchedCovItemCov#BldgSchedCovItem.PropertyInfo as ILinkPropertyInfo}
  }

}