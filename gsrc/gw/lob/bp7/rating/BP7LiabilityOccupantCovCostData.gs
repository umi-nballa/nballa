package gw.lob.bp7.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses gw.lob.common.util.DateRange
uses gw.api.effdate.EffDatedUtil
uses entity.windowed.BP7LineCovVersionList
uses entity.windowed.BP7LineCovCostVersionList

class BP7LiabilityOccupantCovCostData extends BP7CostData<BP7LiabilityOccupantCovCost> {

  var _classificationID : Key

  construct(_classification : BP7Classification, liabilityCov : Coverage, sliceRange : DateRange) {
    super(liabilityCov.FixedId, liabilityCov.OwningCoverable.FixedId, sliceRange)
    _classificationID = _classification.FixedId
    assertKeyType(_classificationID, BP7Classification)
    assertKeyType(CoverableID, BP7BusinessOwnersLine)
    assertKeyType(CoverageID, BP7LineCov)
  }

  construct(cost : BP7LiabilityOccupantCovCost) {
    super(cost)
    _classificationID = cost.getSlice(cost.EffectiveDate).AssociatedClassification.FixedId
  }
  
  override function setSpecificFieldsOnCost(line : BP7Line, cost : BP7LiabilityOccupantCovCost) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("LineCoverage", CoverageID)
    cost.setFieldValue("AssociatedClassification", _classificationID)
  }
  
  protected override property get KeyValues() : List<Object> {
    return super.KeyValues.concat({_classificationID}).toList()
  }

  override function getVersionedCosts(line : BP7Line) : List<EffDatedVersionList> {
    var coverageVL = EffDatedUtil.createVersionList(line.Branch, CoverageID) as BP7LineCovVersionList
    return coverageVL.LineCovCosts
      .where(\ costVL -> isCostVersionListForCostData(costVL))
  }

  private function isCostVersionListForCostData(costVL : BP7LineCovCostVersionList) : boolean {
    var v1 = costVL.AllVersions.first()
    return v1 typeis BP7LiabilityOccupantCovCost and
           this.CoverageID == v1.Coverage.FixedId and
           this.CoverableID == v1.Coverable.FixedId and
           this._classificationID == v1.AssociatedClassification.FixedId
  }
}
