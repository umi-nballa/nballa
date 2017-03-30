package gw.lob.bp7.rating
uses gw.api.productmodel.ClausePattern
uses java.util.Map
uses gw.lob.common.util.DateRange
uses una.rating.bp7.ratinginfos.BP7StructureRatingInfo
uses una.rating.bp7.ratinginfos.BP7RatingInfo
uses gw.rating.CostData
uses una.rating.bp7.common.BP7RateRoutineNames
uses una.rating.bp7.ratinginfos.BP7BuildingRatingInfo

class BP7BuildingStep extends BP7RatingStep {

  var _bp7RatingInfo : BP7RatingInfo

  construct(line : BP7Line, executor : BP7RateRoutineExecutor, daysInTerm : int, bp7RatingInfo : BP7RatingInfo) {
    super(line, executor, daysInTerm)
    _bp7RatingInfo = bp7RatingInfo
  }

  override function getRateRoutineCode(coveragePattern : ClausePattern) : String {
    switch (coveragePattern) {
      case "BP7Structure" : return BP7RateRoutineNames.BP7_STRUCTURE_RATE_ROUTINE
      case "BP7BuildingMoneySecurities_EXT" : return BP7RateRoutineNames.BP7_BUILDING_MONEY_AND_SECURITIES_RATE_ROUTINE
      case "BP7LocationOutdoorSigns_EXT" : return BP7RateRoutineNames.BP7_BUILDING_OUTDOOR_SIGNS_RATE_ROUTINE
      case "BP7SinkholeLossCoverage_EXT" : return BP7RateRoutineNames.BP7_SINKHOLE_LOSS_COVERAGE_RATE_ROUTINE
      case "BP7DamagePremisisRentedToYou_EXT" : return BP7RateRoutineNames.BP7_DAMAGE_PREMISES_RENTED_TO_YOU_RATE_ROUTINE
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  function rateBP7Structure(coverage : BP7Structure, sliceToRate : DateRange,bp7StructureRatingInfo : BP7StructureRatingInfo) : CostData<Cost, PolicyLine> {
    var costData = createCostData(coverage, sliceToRate)
    var parameterSet = createParameterSetForBP7Structure(coverage, costData, bp7StructureRatingInfo)
    _executor.execute(getRateRoutineCode(coverage.Pattern), coverage, parameterSet, costData)
    costData.PremiumNoCTR_Ext = _bp7RatingInfo.PremiumNoCTR
    costData.ActualCalculatedTermAmount_Ext = _bp7RatingInfo.ActualCalculatedAmount
    _bp7RatingInfo.ActualCalculatedAmount = 0.0
    _bp7RatingInfo.PremiumNoCTR = 0.0
    return costData
  }

  function rate(coverage : Coverage, sliceToRate : DateRange, buildingRatingInfo : BP7BuildingRatingInfo) : CostData<Cost, PolicyLine> {
    var costData = createCostData(coverage, sliceToRate)
    var parameterSet = createBuildingParameterSet(coverage, costData, buildingRatingInfo)
    _executor.execute(getRateRoutineCode(coverage.Pattern), coverage, parameterSet, costData)
    costData.PremiumNoCTR_Ext = _bp7RatingInfo.PremiumNoCTR
    costData.ActualCalculatedTermAmount_Ext = _bp7RatingInfo.ActualCalculatedAmount
    _bp7RatingInfo.ActualCalculatedAmount = 0.0
    _bp7RatingInfo.PremiumNoCTR = 0.0
    return costData
  }

  function createBuildingParameterSet(coverage : Coverage, costData : BP7CostData<BP7Cost>, buildingRatingInfo : BP7BuildingRatingInfo) : Map<CalcRoutineParamName, Object> {
    return 
    {TC_POLICYLINE         -> _line,
     TC_RATINGINFO         -> _bp7RatingInfo,
     TC_BUILDINGRATINGINFO_EXT  -> buildingRatingInfo,
     TC_COSTDATA           -> costData}
  }

  override function createParameterSet(coverage : Coverage, costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object> {
    return
        {TC_POLICYLINE         -> _line,
            TC_COVERAGE           -> coverage,
            TC_BUILDING           -> coverage.OwningCoverable,
            TC_COSTDATA           -> costData}
  }

  override function createCostData(coverage : Coverage, sliceToRate : DateRange) : BP7CostData<BP7Cost> {
    var costData : BP7CostData
    if (coverage typeis BP7Structure and coverage.InBlanket) {
      costData = new BP7BlanketedBuildingCovCostData(coverage.Blanket, coverage, sliceToRate)
    }
    else {
      costData = new BP7BuildingCovCostData(coverage, sliceToRate)
    }
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    return costData
  }

  function createParameterSetForBP7Structure(coverage : BP7Structure, costData : BP7CostData<BP7Cost>, bp7StructureRatingInfo : BP7StructureRatingInfo) : Map<CalcRoutineParamName, Object>{
    return
        {TC_POLICYLINE         -> _line,
         TC_RATINGINFO         -> _bp7RatingInfo,
         TC_BUILDINGRATINGINFO_EXT -> bp7StructureRatingInfo,
         TC_COSTDATA           -> costData}
  }

}
