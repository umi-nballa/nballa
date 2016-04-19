package gw.lob.bp7.schedules

uses gw.coverage.AbstractCoverageMatcher
uses gw.entity.ILinkPropertyInfo

class BP7LineSchedCovItemCovMatcher extends AbstractCoverageMatcher<BP7LineSchedCovItemCov> {
  construct(owner : BP7LineSchedCovItemCov) {
    super(owner)
  }

  override property get CoverableColumns() :  List<ILinkPropertyInfo> {
    return {BP7LineSchedCovItemCov#LineSchedCovItem.PropertyInfo as ILinkPropertyInfo}
  }

}