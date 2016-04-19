package gw.lob.bp7.rating

uses gw.lob.common.util.DateRange
uses java.math.BigDecimal
uses gw.api.database.Query

class BP7ClassificationRater extends BP7AbstractRater {

  construct(ratingEngine : BP7SysTableRatingEngine) {
    _ratingEngine = ratingEngine
  }
  
  public function rateSlice(classification : BP7Classification, sliceToRate : DateRange) : List<BP7CostData> {
    var costDatas : List<BP7CostData> = {}

    if (classification.BP7ClassificationBusinessPersonalPropertyExists) {
      var coverage = classification.BP7ClassificationBusinessPersonalProperty
      var cost = createCostData(coverage, sliceToRate)

      calculateRates(cost, classification.ClassificationClassCode, coverage.BP7BusnPrsnlPropLimitTerm.Value)
      costDatas.add(cost)
    }

    return costDatas
  }
  
  override protected function getLimitRelativityFactor(limit : BigDecimal) : BigDecimal {
    var query = Query.make(BP7BPPLimitOfInsRelativityFactor)
    var orderedResult = query.select().orderBy(\ b -> b.BPPLimit)  
    return getInterpolateFactor(orderedResult.toList(), BP7BPPLimitOfInsRelativityFactor#BPPLimit, 
                                BP7BPPLimitOfInsRelativityFactor#RelativityFactor, limit.intValue())
  }
  
  override property get RateFactorTable() : Type {
    return BP7BPPRateNumberFactor
  }

  override property get BaseRateTable() : Type {
    return BP7BPPRate
  }

  private function createCostData(coverage : BP7ClassificationCov, sliceToRate : DateRange) : BP7CostData {
    return coverage.InBlanket
      ? new BP7BlanketedClassificationCovCostData(coverage.Blanket, coverage, sliceToRate)
      : new BP7ClassificationCovCostData(coverage, sliceToRate)
  }
}
