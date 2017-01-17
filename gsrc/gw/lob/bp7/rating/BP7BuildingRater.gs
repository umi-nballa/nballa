package gw.lob.bp7.rating

uses gw.lob.common.util.DateRange
uses java.math.BigDecimal
uses gw.api.database.Query

class BP7BuildingRater extends BP7AbstractRater {

  construct(ratingEngine : BP7SysTableRatingEngine) {
    _ratingEngine = ratingEngine
  }
  
  public function rateSlice(building : BP7Building, sliceToRate : DateRange) : List<BP7CostData> {
    var costDatas : List<BP7CostData> = {}

    if (building.BP7StructureExists) {
      var coverage = building.BP7Structure
      var cost = createCostData(coverage, sliceToRate)

      calculateRates(cost, building.BuildingClassCode, coverage.BP7BuildingLimitTerm.Value)
      costDatas.add(cost)
    }

    return costDatas
  }
  
  override protected function getLimitRelativityFactor(limit : BigDecimal) : BigDecimal {
    var queryForGroup = Query.make(BP7BuildingLimitOfInsRelativityGroup)
    var relGroup = BP7BuildingLimitOfInsRelativityGroup#RelativityGroup.get(queryForGroup.select().AtMostOneRow)
    
    var queryForFactor = Query.make(BP7BuildingLimitOfInsRelativityFactor)
    queryForFactor.compare(BP7BuildingLimitOfInsRelativityFactor#RelativityGroup.PropertyInfo.Name, Equals, relGroup)
    var orderedResult = queryForFactor.select().orderBy(\ b -> b.BuildingLimit)  
    return getInterpolateFactor(orderedResult.toList(), BP7BuildingLimitOfInsRelativityFactor#BuildingLimit, 
                                BP7BuildingLimitOfInsRelativityFactor#RelativityFactor, limit.intValue())
  }
  
  override property get RateFactorTable() : Type {
    return BP7BuildingRateNumberFactor
  }

  override property get BaseRateTable() : Type {
    return BP7BuildingRate
  }
  
  private function createCostData(coverage : BP7BuildingCov, sliceToRate : DateRange) : BP7CostData {
  return coverage.InBlanket
  ? new BP7BlanketedBuildingCovCostData(coverage.Blanket, coverage, sliceToRate)
  : new BP7BuildingCovCostData(coverage, sliceToRate)
  }
}
