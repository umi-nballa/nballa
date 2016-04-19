package gw.lob.bp7.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses gw.api.effdate.EffDatedUtil
uses gw.lob.common.util.DateRange
uses entity.windowed.BP7ClassificationCovVersionList
uses entity.windowed.BP7ClassificationCovCostVersionList

class BP7ClassificationCovCostData extends BP7CostData<BP7ClassificationCovCost> {
  
  construct(classificationCov : Coverage, sliceRange : DateRange) {
    super(classificationCov.FixedId, classificationCov.OwningCoverable.FixedId, sliceRange)
    assertKeyType(CoverableID, BP7Classification)
    assertKeyType(CoverageID, BP7ClassificationCov)
  }

  construct(cost : BP7ClassificationCovCost) {
    super(cost)
  }

  override function setSpecificFieldsOnCost(line : BP7Line, cost : BP7ClassificationCovCost) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("Classification", CoverableID)
    cost.setFieldValue("ClassificationCov", CoverageID)
  }

  override function getVersionedCosts(line : BP7Line) : List<EffDatedVersionList> {
    var coverageVL = EffDatedUtil.createVersionList(line.Branch, CoverageID) as BP7ClassificationCovVersionList
    return coverageVL.ClassificationCovCosts
      .where(\ costVL -> isCostVersionListForThisCostData(costVL))
  }

  private function isCostVersionListForThisCostData(costVL : BP7ClassificationCovCostVersionList) : boolean {
    var v1 = costVL.AllVersions.first()
    return (this.CoverageID == v1.Coverage.FixedId and
            this.CoverableID == v1.Coverable.FixedId and
            typeof(v1) == BP7ClassificationCovCost)
  }
}