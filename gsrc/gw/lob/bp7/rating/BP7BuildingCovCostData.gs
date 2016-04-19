package gw.lob.bp7.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses gw.api.effdate.EffDatedUtil
uses gw.lob.common.util.DateRange
uses entity.windowed.BP7BuildingCovVersionList
uses entity.windowed.BP7BuildingCovCostVersionList

class BP7BuildingCovCostData extends BP7CostData<BP7BuildingCovCost> {
  
  construct(buildingCov : Coverage, sliceRange : DateRange) {
    super(buildingCov.FixedId, buildingCov.OwningCoverable.FixedId, sliceRange )
    assertKeyType(CoverableID, BP7Building)
    assertKeyType(CoverageID, BP7BuildingCov)
  }

  construct(cost : BP7BuildingCovCost) {
    super(cost)
  }

  override function setSpecificFieldsOnCost(line : BP7Line, cost : BP7BuildingCovCost) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("Building", CoverableID)
    cost.setFieldValue("BuildingCov", CoverageID)
  }

  override function getVersionedCosts(line : BP7Line) : List<EffDatedVersionList> {
    var coverageVL = EffDatedUtil.createVersionList(line.Branch, CoverageID) as BP7BuildingCovVersionList
    return coverageVL.BuildingCovCosts
      .where(\ costVL -> isCostVersionListForThisCostData(costVL))
  }

  private function isCostVersionListForThisCostData(costVL : BP7BuildingCovCostVersionList) : boolean {
    var v1 = costVL.AllVersions.first()
    return (this.CoverageID == v1.Coverage.FixedId and
            this.CoverableID == v1.Coverable.FixedId and
            typeof(v1) == BP7BuildingCovCost)
  }
}