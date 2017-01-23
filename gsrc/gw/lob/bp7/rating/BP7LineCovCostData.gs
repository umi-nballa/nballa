package gw.lob.bp7.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses gw.api.effdate.EffDatedUtil
uses entity.windowed.BP7LineCovVersionList
uses entity.windowed.BP7LineCovCostVersionList
uses gw.lob.common.util.DateRange

class BP7LineCovCostData extends BP7CostData<BP7LineCovCost> {

  var _costType : BP7CostType_Ext as CostType

  construct(lineCov : Coverage, sliceRange : DateRange) {
    super(lineCov.FixedId, lineCov.OwningCoverable.FixedId, sliceRange )
    assertKeyType(CoverableID, BP7BusinessOwnersLine)
    assertKeyType(CoverageID, BP7LineCov)
  }

  construct(lineCov : Coverage, sliceRange : DateRange, costType : BP7CostType_Ext){
    this(lineCov, sliceRange)
    _costType = costType
  }

  construct(cost : BP7LineCovCost) {
    super(cost)
  }

  override function setSpecificFieldsOnCost(line : BP7Line, cost : BP7LineCovCost) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("LineCoverage", CoverageID)
    if(_costType != null)
      cost.BP7CostType = _costType
  }

  override function getVersionedCosts(line : BP7Line) : List<EffDatedVersionList> {
    var coverageVL = EffDatedUtil.createVersionList(line.Branch, CoverageID) as BP7LineCovVersionList
    return coverageVL.LineCovCosts
      .where(\ costVL -> isCostVersionListForThisCostData(costVL))
  }

  private function isCostVersionListForThisCostData(costVL : BP7LineCovCostVersionList) : boolean {
    var v1 = costVL.AllVersions.first()
    if(v1.BP7CostType != null){
      return (this.CoverageID == v1.Coverage.FixedId and
              this.CoverableID == v1.Coverable.FixedId and
              this.CostType == v1.BP7CostType)
    }
    return (this.CoverageID == v1.Coverage.FixedId and
            this.CoverableID == v1.Coverable.FixedId)
  }

  override property get KeyValues() : List<Object> {
    if(CostType != null)
      return {this.CoverableID, this.CoverageID, CostType}
    return {this.CoverableID, this.CoverageID}
  }
}