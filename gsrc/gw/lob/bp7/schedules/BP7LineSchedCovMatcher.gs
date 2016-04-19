package gw.lob.bp7.schedules

uses gw.entity.ILinkPropertyInfo
uses gw.coverage.AbstractCoverageMatcher

class BP7LineSchedCovMatcher extends AbstractCoverageMatcher<BP7LineSchedCov> {

  construct(owner : BP7LineSchedCov) {
    super(owner)
  }

  override property get CoverableColumns() : List<ILinkPropertyInfo> {
    return {
      BP7LineSchedCov#BP7Line.PropertyInfo as ILinkPropertyInfo
    }
  }

}