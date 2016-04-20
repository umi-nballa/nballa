package gw.lob.bp7.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses gw.api.effdate.EffDatedUtil
uses gw.lob.common.util.DateRange
uses entity.windowed.BP7LocationCovVersionList
uses entity.windowed.BP7LocationCovCostVersionList

class BP7LocationCovCostData extends BP7CostData<BP7LocationCovCost> {
  
  construct(locationCov : Coverage, sliceRange : DateRange) {
    super(locationCov.FixedId, locationCov.OwningCoverable.FixedId, sliceRange )
    assertKeyType(CoverableID, BP7Location)
    assertKeyType(CoverageID, BP7LocationCov)
  }

  construct(cost : BP7LocationCovCost) {
    super(cost)
  }

  override function setSpecificFieldsOnCost(line : BP7Line, cost : BP7LocationCovCost) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("Location", CoverableID)
    cost.setFieldValue("LocationCov", CoverageID)
  }

  override function getVersionedCosts(line : BP7Line) : List<EffDatedVersionList> {
    var coverageVL = EffDatedUtil.createVersionList(line.Branch, CoverageID) as BP7LocationCovVersionList
    return coverageVL.LocationCovCosts
      .where(\ costVL -> isCostVersionListForThisCostData(costVL))
  }

  private function isCostVersionListForThisCostData(costVL : BP7LocationCovCostVersionList) : boolean {
    var v1 = costVL.AllVersions.first()
    return (this.CoverageID == v1.Coverage.FixedId and
            this.CoverableID == v1.Coverable.FixedId)
  }
}