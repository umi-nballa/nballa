package gw.lob.bp7.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses gw.lob.common.util.DateRange
uses gw.api.effdate.EffDatedUtil
uses entity.windowed.BP7LineCovVersionList
uses entity.windowed.BP7LineCovCostVersionList

class BP7LiabilityLessorCovCostData extends BP7CostData<BP7LiabilityLessorCovCost> {

  var _buildingID : Key

  construct(_building : BP7Building, liabilityCov : Coverage, sliceRange : DateRange) {
    super(liabilityCov.FixedId, liabilityCov.OwningCoverable.FixedId, sliceRange)
    _buildingID = _building.FixedId
    assertKeyType(_buildingID, BP7Building)
    assertKeyType(CoverableID, BP7BusinessOwnersLine)
    assertKeyType(CoverageID, BP7LineCov)
  }

  construct(cost : BP7LiabilityLessorCovCost) {
    super(cost)
    _buildingID = cost.getSlice(cost.EffectiveDate).AssociatedBuilding.FixedId
  }
  
  override function setSpecificFieldsOnCost(line : BP7Line, cost : BP7LiabilityLessorCovCost) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("LineCoverage", CoverageID)
    cost.setFieldValue("AssociatedBuilding", _buildingID)
  }
  
  override property get KeyValues() : List<Object> {
    return super.KeyValues.concat({_buildingID}).toList()
  }

  override function getVersionedCosts(line : BP7Line) : List<EffDatedVersionList> {
    var coverageVL = EffDatedUtil.createVersionList(line.Branch, CoverageID) as BP7LineCovVersionList
    return coverageVL.LineCovCosts
      .where(\ costVL -> isCostVersionListForCostData(costVL))
  }

  private function isCostVersionListForCostData(costVL : BP7LineCovCostVersionList) : boolean {
    var v1 = costVL.AllVersions.first()
    return v1 typeis BP7LiabilityLessorCovCost and
            this.CoverageID == v1.Coverage.FixedId and
            this.CoverableID == v1.Coverable.FixedId and
            this._buildingID == v1.AssociatedBuilding.FixedId
  }
}
