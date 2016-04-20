package gw.lob.bp7.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses gw.lob.common.util.DateRange
uses gw.api.effdate.EffDatedUtil
uses entity.windowed.BP7ClassificationCovVersionList
uses entity.windowed.BP7BlanketedClassificationCovCostVersionList

class BP7BlanketedClassificationCovCostData extends BP7CostData<BP7BlanketedClassificationCovCost> {

  private var _blanketId : Key

  construct(__blanket : BP7Blanket, classificationCov : Coverage, sliceRange : DateRange) {
    super(classificationCov.FixedId, classificationCov.OwningCoverable.FixedId, sliceRange)
    assertKeyType(CoverableID, BP7Classification)
    assertKeyType(CoverageID, BP7ClassificationCov)
    _blanketId = __blanket.FixedId
  }

  construct(cost : BP7BlanketedClassificationCovCost) {
    super(cost)
    _blanketId = cost.getSlice(cost.EffectiveDate).ClassificationBlanket.FixedId
  }
  
  override function setSpecificFieldsOnCost(line : BP7Line, cost : BP7BlanketedClassificationCovCost) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("Classification", CoverableID)
    cost.setFieldValue("ClassificationCov", CoverageID)
    cost.setFieldValue("ClassificationBlanket", _blanketId)
  }

  protected override property get KeyValues() : List<Object> {
    return super.KeyValues.concat({_blanketId}).toList()
  }
 
  override function getVersionedCosts(line : BP7Line) : List<EffDatedVersionList> {
    var coverageVL = EffDatedUtil.createVersionList(line.Branch, CoverageID) as BP7ClassificationCovVersionList
    return coverageVL.BlanketedClassificationCovCosts
      .where(\ costVL -> isCostVersionListForThisCostData(costVL))
  }

  private function isCostVersionListForThisCostData(costVL : BP7BlanketedClassificationCovCostVersionList) : boolean {
    var v1 = costVL.AllVersions.first()
    return (this.CoverageID == v1.Coverage.FixedId and
            this.CoverableID == v1.Coverable.FixedId and
            this._blanketId == v1.ClassificationBlanket.FixedId)
  }
}