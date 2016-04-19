package gw.lob.bp7.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses gw.lob.common.util.DateRange
uses entity.windowed.BP7BuildingCovVersionList
uses entity.windowed.BP7BlanketedBuildingCovCostVersionList
uses gw.api.effdate.EffDatedUtil

class BP7BlanketedBuildingCovCostData extends BP7CostData<BP7BlanketedBuildingCovCost> {

  private var _blanketId : Key

  construct(__blanket : BP7Blanket, buildingCov : Coverage, sliceRange : DateRange) {
    super(buildingCov.FixedId, buildingCov.OwningCoverable.FixedId, sliceRange )
    assertKeyType(CoverableID, BP7Building)
    assertKeyType(CoverageID, BP7BuildingCov)
    _blanketId = __blanket.FixedId
  }

  construct(cost : BP7BlanketedBuildingCovCost) {
    super(cost)
    _blanketId = cost.getSlice(cost.EffectiveDate).BuildingBlanket.FixedId
  }

  override function setSpecificFieldsOnCost(line : BP7Line, cost : BP7BlanketedBuildingCovCost) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("Building", CoverableID)
    cost.setFieldValue("BuildingCov", CoverageID)
    cost.setFieldValue("BuildingBlanket", _blanketId)
  }

  protected override property get KeyValues() : List<Object> {
    return super.KeyValues.concat({_blanketId}).toList()
  }

  override function getVersionedCosts(line : BP7Line) : List<EffDatedVersionList> {
    var coverageVL = EffDatedUtil.createVersionList(line.Branch, CoverageID) as BP7BuildingCovVersionList
    return coverageVL.BlanketedBuildingCovCosts
      .where(\ costVL -> isCostVersionListForThisCostData(costVL))
  }

  private function isCostVersionListForThisCostData(costVL : BP7BlanketedBuildingCovCostVersionList) : boolean {
    var v1 = costVL.AllVersions.first()
    return (this.CoverageID == v1.Coverage.FixedId and
            this.CoverableID == v1.Coverable.FixedId and
            this._blanketId == v1.BuildingBlanket.FixedId)
  }
}