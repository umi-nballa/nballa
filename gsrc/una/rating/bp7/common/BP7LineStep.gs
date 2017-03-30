package una.rating.bp7.common

uses gw.api.productmodel.ClausePattern
uses java.util.Map
uses gw.lob.common.util.DateRange
uses gw.lob.bp7.rating.BP7RatingStep
uses gw.lob.bp7.rating.BP7RateRoutineExecutor
uses gw.lob.bp7.rating.BP7CostData
uses gw.lob.bp7.rating.BP7LineCovCostData
uses una.rating.bp7.ratinginfos.BP7RatingInfo
uses una.rating.bp7.ratinginfos.BP7LineRatingInfo
uses gw.rating.CostData
uses java.math.BigDecimal

/**
* Class which rates all the available BP7 line coverages
 */
class BP7LineStep extends BP7RatingStep {

  var _bp7RatingInfo : BP7RatingInfo
  var _lineRatingInfo : BP7LineRatingInfo

  construct(line : BP7Line, executor : BP7RateRoutineExecutor, daysInTerm : int, bp7RatingInfo : BP7RatingInfo, lineRatingInfo : BP7LineRatingInfo) {
    super(line, executor, daysInTerm)
    _bp7RatingInfo = bp7RatingInfo
    _lineRatingInfo = lineRatingInfo
  }

  /**
   * Returns the rate routine code based on coverage pattern
   */
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
      case "BP7EmploymentPracticesLiabilityCov_EXT" : return BP7RateRoutineNames.BP7_EMPLOYMENT_PRACTICES_LIABILITY_RATE_ROUTINE
      case "BP7CapLossesFromCertfdActsTerrsm" : return BP7RateRoutineNames.BP7_TERRORISM_COVERAGE_RATE_ROUTINE
      case "DataCmprmiseRspnseExpns_EXT" : return BP7RateRoutineNames.BP7_DATA_COMPROMISE_RESPONSE_EXPENSES_FIRST_PARTY_RATE_ROUTINE
      case "BP7DataCompromiseDfnseandLiabCov_EXT" : return BP7RateRoutineNames.BP7_DATA_COMPROMISE_RESPONSE_EXPENSES_FIRST_THIRD_PARTY_RATE_ROUTINE
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  /**
  * Creates the parameter set which is used to pass onto rate routines
   */
  override function createParameterSet(lineCov : Coverage, costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object> {
    if(lineCov typeis IdentityRecovCoverage_EXT)
      return createLineParameterSet(costData)
    else
      return createLineRatingInfoParameterSet(costData)
  }

  /**
  * Rates the additional insured which has no premium/no charge
   */
  function rateNonPremiumAdditionalInsuredCoverages(lineCov : Coverage, sliceToRate : DateRange) : CostData<Cost, PolicyLine> {
    var costData = createCostData(lineCov, sliceToRate)
    costData.StandardBaseRate = 0.0
    costData.StandardAdjRate = 0.0
    costData.StandardTermAmount = 0.0
    costData.PremiumNoCTR_Ext = _bp7RatingInfo.PremiumNoCTR
    costData.ActualCalculatedTermAmount_Ext = _bp7RatingInfo.ActualCalculatedAmount
    _bp7RatingInfo.ActualCalculatedAmount = 0.0
    _bp7RatingInfo.PremiumNoCTR = 0.0
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  override function rate(coverage : Coverage, sliceToRate : DateRange) : CostData<Cost, PolicyLine> {
    var costData = createCostData(coverage, sliceToRate)
    var parameterSet = createParameterSet(coverage, costData)
    _executor.execute(getRateRoutineCode(coverage.Pattern), coverage, parameterSet, costData)
    costData.PremiumNoCTR_Ext = _bp7RatingInfo.PremiumNoCTR
    costData.ActualCalculatedTermAmount_Ext = _bp7RatingInfo.ActualCalculatedAmount
    _bp7RatingInfo.ActualCalculatedAmount = 0.0
    _bp7RatingInfo.PremiumNoCTR = 0.0
    return costData
  }

  /**
  *  Rates the ordinance or Law coverage
   */
  function rateOrdinanceOrLawCoverage(lineCov : Coverage, sliceToRate : DateRange) : List<CostData<Cost, PolicyLine>> {
    var costDatas : List<CostData<Cost, PolicyLine>> = {}
    if(lineCov typeis BP7OrdinanceOrLawCov_EXT){
      if(_lineRatingInfo.OrdinanceOrLawCoverage == "Coverage 1 Only" || _lineRatingInfo.OrdinanceOrLawCoverage == "Coverage 1 2 and 3 Only" ||
          _lineRatingInfo.OrdinanceOrLawCoverage == "Coverage 1 and 3"){
        var costData = createCostData(lineCov, sliceToRate, BP7CostType_Ext.TC_ORDINANCEORLAWCOVERAGE1)
        var parameterSet = createParameterSet(lineCov, costData)
        _executor.execute(BP7RateRoutineNames.BP7_ORDINANCE_OR_LAW_COVERAGE_1_RATE_ROUTINE, lineCov, parameterSet, costData)
        costData.PremiumNoCTR_Ext = _bp7RatingInfo.PremiumNoCTR
        costData.ActualCalculatedTermAmount_Ext = _bp7RatingInfo.ActualCalculatedAmount
        _bp7RatingInfo.ActualCalculatedAmount = 0.0
        _bp7RatingInfo.PremiumNoCTR = 0.0
        costDatas.add(costData)
      }

      if(_lineRatingInfo.OrdinanceOrLawCoverage == "Coverage 3 Only" || _lineRatingInfo.OrdinanceOrLawCoverage == "Coverage 1 2 and 3 Only" ||
          _lineRatingInfo.OrdinanceOrLawCoverage == "Coverage 1 and 3"){
        var costData = createCostData(lineCov, sliceToRate, BP7CostType_Ext.TC_ORDINANCEORLAWCOVERAGE3)
        var parameterSet = createParameterSet(lineCov, costData)
        _executor.execute(BP7RateRoutineNames.BP7_ORDINANCE_OR_LAW_COVERAGE_3_RATE_ROUTINE, lineCov, parameterSet, costData)
        costData.PremiumNoCTR_Ext = _bp7RatingInfo.PremiumNoCTR
        costData.ActualCalculatedTermAmount_Ext = _bp7RatingInfo.ActualCalculatedAmount
        _bp7RatingInfo.ActualCalculatedAmount = 0.0
        _bp7RatingInfo.PremiumNoCTR = 0.0
        costDatas.add(costData)
      }

      if(_lineRatingInfo.OrdinanceOrLawCoverage == "Coverage 1 2 and 3 Only"){
        var costData = createCostData(lineCov, sliceToRate, BP7CostType_Ext.TC_ORDINANCEORLAWCOVERAGE2)
        var parameterSet = createParameterSet(lineCov, costData)
        _executor.execute(BP7RateRoutineNames.BP7_ORDINANCE_OR_LAW_COVERAGE_2_RATE_ROUTINE, lineCov, parameterSet, costData)
        costData.PremiumNoCTR_Ext = _bp7RatingInfo.PremiumNoCTR
        costData.ActualCalculatedTermAmount_Ext = _bp7RatingInfo.ActualCalculatedAmount
        _bp7RatingInfo.ActualCalculatedAmount = 0.0
        _bp7RatingInfo.PremiumNoCTR = 0.0
        costDatas.add(costData)
      }
    }
    return costDatas
  }

  function rateForgeryOrAlterationCoverage(lineCov : Coverage, sliceToRate : DateRange) : CostData<Cost, PolicyLine>{
    var employeeDishonestyPremium : BigDecimal = 0.0
    if(_line.BP7EmployeeDishtyExists){
      var costDataForEmployeeDishonesty = createCostData(_line.BP7EmployeeDishty, sliceToRate)
      var parameterSetForEmployeeDishonesty = createLineRatingInfoParameterSet(costDataForEmployeeDishonesty)
      _executor.execute(BP7RateRoutineNames.BP7_LINE_EMPLOYEE_DISHONESTY_RATE_ROUTINE, _line.BP7EmployeeDishty, parameterSetForEmployeeDishonesty, costDataForEmployeeDishonesty)
      employeeDishonestyPremium = costDataForEmployeeDishonesty?.ActualTermAmount
    }
    _lineRatingInfo.EmployeeDishonestyPremium = employeeDishonestyPremium
    var costData = createCostData(lineCov, sliceToRate)
    var parameterSet = createParameterSet(lineCov, costData)
    _executor.execute(getRateRoutineCode(lineCov.Pattern), lineCov, parameterSet, costData)
    costData.PremiumNoCTR_Ext = _bp7RatingInfo.PremiumNoCTR
    costData.ActualCalculatedTermAmount_Ext = _bp7RatingInfo.ActualCalculatedAmount
    _bp7RatingInfo.ActualCalculatedAmount = 0.0
    _bp7RatingInfo.PremiumNoCTR = 0.0
    return costData

  }

  function rateTerrorismCoverageRateRoutine(lineCov : Coverage, sliceToRate : DateRange, basePremiumForTerrorismCoverage : BigDecimal) : CostData<Cost, PolicyLine>{
    var costData = createCostData(lineCov, sliceToRate)
    var termAmount : BigDecimal = 100.0
    var parameterSet = createTerrorismParameterSet(costData, basePremiumForTerrorismCoverage)
    _executor.execute(getRateRoutineCode(lineCov.Pattern), lineCov, parameterSet, costData)
    costData.PremiumNoCTR_Ext = _bp7RatingInfo.PremiumNoCTR
    costData.ActualCalculatedTermAmount_Ext = _bp7RatingInfo.ActualCalculatedAmount
    _bp7RatingInfo.ActualCalculatedAmount = 0.0
    _bp7RatingInfo.PremiumNoCTR = 0.0
    return costData
  }

  /**
  *  Rates when there is Medical Payment increase
   */
  function rateBusinessLiabilityMedicalPaymentIncrease(lineCov : Coverage, sliceToRate : DateRange) : CostData<Cost, PolicyLine>{
    var costData = createCostData(lineCov, sliceToRate, BP7CostType_Ext.TC_MEDICALPAYMENTINCREASE)
    var parameterSet = createParameterSet(lineCov, costData)
    _executor.execute(getRateRoutineCode(lineCov.Pattern), lineCov, parameterSet, costData)
    costData.PremiumNoCTR_Ext = _bp7RatingInfo.PremiumNoCTR
    costData.ActualCalculatedTermAmount_Ext = _bp7RatingInfo.ActualCalculatedAmount
    _bp7RatingInfo.ActualCalculatedAmount = 0.0
    _bp7RatingInfo.PremiumNoCTR = 0.0
    return costData
  }

  /**
  * Creates the BP7 line cost data with no cost type
   */
  override function createCostData(coverage : Coverage, sliceToRate : DateRange) : BP7CostData<BP7Cost> {
    var costData = new BP7LineCovCostData(coverage, sliceToRate)
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    return costData
  }

  /**
  * Creates the BP7 line cost data with cost type
   */
  function createCostData(coverage : Coverage, sliceToRate : DateRange, costType : BP7CostType_Ext) : BP7CostData<BP7Cost> {
    var costData = new BP7LineCovCostData(coverage, sliceToRate, costType)
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    return costData
  }

  /**
  * creates the parameter set with no rating infos
   */
  private function createLineParameterSet(costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object>{
    return
        {TC_POLICYLINE         -> _line,
         TC_RATINGINFO         -> _bp7RatingInfo,
         TC_COSTDATA           -> costData}
  }

  /**
   * creates the parameter set for terrorism
   */
  private function createTerrorismParameterSet(costData : BP7CostData<BP7Cost>, basePremiumForTerrorismCoverage : BigDecimal) : Map<CalcRoutineParamName, Object>{
    return
        {TC_POLICYLINE         -> _line,
         TC_TERRORISMBASEPREMIUM_EXT -> basePremiumForTerrorismCoverage,
         TC_RATINGINFO         -> _bp7RatingInfo,
         TC_COSTDATA        -> costData}
  }

  /**
   * creates the parameter set with line rating infos
   */
  private function createLineRatingInfoParameterSet(costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object>{
    return
        {TC_POLICYLINE         -> _line,
         TC_LINERATINGINFO_EXT -> _lineRatingInfo,
         TC_RATINGINFO         -> _bp7RatingInfo,
         TC_COSTDATA           -> costData}
  }

}
