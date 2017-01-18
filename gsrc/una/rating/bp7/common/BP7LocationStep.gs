package una.rating.bp7.common

uses gw.api.productmodel.ClausePattern
uses java.util.Map
uses gw.lob.common.util.DateRange
uses gw.lob.bp7.rating.BP7RatingStep
uses gw.lob.bp7.rating.BP7RateRoutineExecutor
uses gw.lob.bp7.rating.BP7CostData
uses una.rating.bp7.ratinginfos.BP7RatingInfo
uses gw.lob.bp7.rating.BP7LocationCovCostData
uses una.rating.bp7.ratinginfos.BP7LocationRatingInfo
uses gw.rating.CostData

class BP7LocationStep extends BP7RatingStep {

  var _bp7RatingInfo : BP7RatingInfo
  var _locationRatingInfo : BP7LocationRatingInfo

  construct(line : BP7Line, executor : BP7RateRoutineExecutor, daysInTerm : int, bp7RatingInfo : BP7RatingInfo, locationRatingInfo : BP7LocationRatingInfo) {
    super(line, executor, daysInTerm)
    _bp7RatingInfo = bp7RatingInfo
    _locationRatingInfo = locationRatingInfo
  }

  override function getRateRoutineCode(coveragePattern : ClausePattern) : String {
    switch (coveragePattern) {
      case "BP7AddlInsdGrantorOfFranchiseEndorsement" : return BP7RateRoutineNames.BP7_LOCATION_ADDL_INSD_GRANTOR_OF_FRANCHISE_RATE_ROUTINE
      case "BP7AddlInsdDesignatedPersonOrgLocation_EXT" : return BP7RateRoutineNames.BP7_LOCATION_ADDL_INSD_DESIGNATED_PERSON_ORG_RATE_ROUTINE
      case "BP7AddlInsdManagersLessorsPremises" : return BP7RateRoutineNames.BP7_LOCATION_ADDL_INSD_MANAGERS_LESSORS_PREMISES_RATE_ROUTINE
      case "BP7AddlInsdLessorsLeasedEquipmt" : return BP7RateRoutineNames.BP7_LOCATION_ADDL_INSD_LESSORS_LEASED_EQUIPMENT_RATE_ROUTINE
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  function rateNonPremiumAdditionalInsuredCoverages(locationCov : Coverage, sliceToRate : DateRange) : CostData<Cost, PolicyLine> {
    var costData = createCostData(locationCov, sliceToRate)
    costData.StandardBaseRate = 0.0
    costData.StandardAdjRate = 0.0
    costData.StandardTermAmount = 0.0
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  override function createParameterSet(lineCov : Coverage, costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object> {
    return
        {TC_POLICYLINE         -> _line,
         TC_LOCATIONRATINGINFO_EXT -> _locationRatingInfo,
         TC_RATINGINFO         -> _bp7RatingInfo,
         TC_COSTDATA           -> costData}
  }

  override function createCostData(coverage : Coverage, sliceToRate : DateRange) : BP7CostData<BP7Cost> {
    var costData = new BP7LocationCovCostData(coverage, sliceToRate)
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    return costData
  }
}
