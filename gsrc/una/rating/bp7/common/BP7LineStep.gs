package una.rating.bp7.common

uses gw.api.productmodel.ClausePattern
uses java.util.Map
uses gw.lob.common.util.DateRange

uses java.util.Map
uses gw.lob.bp7.rating.BP7RatingStep
uses gw.lob.bp7.rating.BP7RateRoutineExecutor
uses gw.lob.bp7.rating.BP7CostData
uses gw.lob.bp7.rating.BP7LineCovCostData
uses una.rating.bp7.ratinginfos.BP7RatingInfo
uses una.rating.bp7.ratinginfos.BP7LineRatingInfo
uses gw.rating.CostData

class BP7LineStep extends BP7RatingStep {

  var _bp7RatingInfo : BP7RatingInfo
  var _lineRatingInfo : BP7LineRatingInfo

  construct(line : BP7Line, executor : BP7RateRoutineExecutor, daysInTerm : int, bp7RatingInfo : BP7RatingInfo, lineRatingInfo : BP7LineRatingInfo) {
    super(line, executor, daysInTerm)
    _bp7RatingInfo = bp7RatingInfo
    _lineRatingInfo = lineRatingInfo
  }

  override function getRateRoutineCode(coveragePattern : ClausePattern) : String {
    switch (coveragePattern) {
      case "BP7CyberOneCov_EXT" : return BP7RateRoutineNames.BP7_CYBER_ONE_COVERAGE_RATE_ROUTINE
      case "IdentityRecovCoverage_EXT" : return BP7RateRoutineNames.BP7_IDENTITY_RECOVERY_COVERAGE_RATE_ROUTINE
      case "BP7EmployeeDishty" : return BP7RateRoutineNames.BP7_LINE_EMPLOYEE_DISHONESTY_RATE_ROUTINE
      case "BP7ForgeryAlteration" : return BP7RateRoutineNames.BP7_FORGERY_OR_ALTERATION_RATE_ROUTINE
      case "BP7EquipBreakEndor_EXT" : return BP7RateRoutineNames.BP7_EQUIPMENT_BREAKDOWN_ENDORSEMENT_RATE_ROUTINE
      case "BP7HiredNonOwnedAuto" : return BP7RateRoutineNames.BP7_HIRED_NON_OWNED_AUTO_RATE_ROUTINE
      case "BP7AddlInsdGrantorOfFranchiseLine_EXT" : return BP7RateRoutineNames.BP7_ADDL_INSD_GRANTOR_OF_FRANCHISE_LINE_RATE_ROUTINE
      case "BP7AddlInsdLessorsLeasedEquipmtLine_EXT" : return BP7RateRoutineNames.BP7_ADDL_INSD_LESSORS_LEASED_EQUIPMENT_LINE_RATE_ROUTINE
      case "BP7AddlInsdManagersLessorsPremisesLine_EXT" : return BP7RateRoutineNames.BP7_ADDL_INSD_MANAGERS_LESSORS_PREMISES_LINE_RATE_ROUTINE
      case "BP7AddlInsdDesignatedPersonOrg" : return BP7RateRoutineNames.BP7_ADDL_INSD_DESIGNATED_PERSON_ORG_RATE_ROUTINE
      case "BP7BusinessLiability" : return BP7RateRoutineNames.BP7_MEDICAL_PAYMENT_INCREASE_RATE_ROUTINE
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  override function createParameterSet(lineCov : Coverage, costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object> {
    if(lineCov typeis BP7CyberOneCov_EXT || lineCov typeis BP7EmployeeDishty || lineCov typeis BP7ForgeryAlteration ||
       lineCov typeis BP7EquipBreakEndor_EXT || lineCov typeis BP7HiredNonOwnedAuto || lineCov typeis BP7AddlInsdGrantorOfFranchiseLine_EXT ||
       lineCov typeis BP7AddlInsdLessorsLeasedEquipmtLine_EXT || lineCov typeis BP7AddlInsdManagersLessorsPremisesLine_EXT || lineCov typeis BP7AddlInsdDesignatedPersonOrg ||
       lineCov typeis BP7BusinessLiability)
      return createLineRatingInfoParameterSet(costData)
    if(lineCov typeis IdentityRecovCoverage_EXT)
      return createLineParameterSet(costData)
    return createLineParameterSet(costData)
  }

  function rateNonPremiumAdditionalInsuredCoverages(lineCov : Coverage, sliceToRate : DateRange) : CostData<Cost, PolicyLine> {
    var costData = createCostData(lineCov, sliceToRate)
    costData.StandardBaseRate = 0.0
    costData.StandardAdjRate = 0.0
    costData.StandardTermAmount = 0.0
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  override function createCostData(coverage : Coverage, sliceToRate : DateRange) : BP7CostData<BP7Cost> {
    var costData = new BP7LineCovCostData(coverage, sliceToRate)
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    return costData
  }

  private function createLineParameterSet(costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object>{
    return
        {TC_POLICYLINE         -> _line,
         TC_COSTDATA           -> costData}
  }

  private function createLineRatingInfoParameterSet(costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object>{
    return
        {TC_POLICYLINE         -> _line,
         TC_LINERATINGINFO_EXT -> _lineRatingInfo,
         TC_RATINGINFO         -> _bp7RatingInfo,
         TC_COSTDATA           -> costData}
  }

}
