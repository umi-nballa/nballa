package una.rating.ho

uses gw.lob.common.util.DateRange
uses gw.lob.ho.rating.HomeownersCovCostData_HOE
uses java.util.Map
uses gw.lob.ho.rating.HOCostData_HOE
uses una.logging.UnaLoggerCategory
uses gw.lob.ho.rating.DwellingCovCostData_HOE
uses gw.rating.CostData

/**
 * User: bduraiswamy
 * Date: 6/16/16
 * Time: 10:32 AM
 * This is the custom UNA implementation of the HO rating engine which extends the HO Abstract Rating engine which rates
 * the HO coverages and updates the cost objects accordingly.
 */
class UNAHORatingEngine_HOE extends UNAHOAbstractRatingEngine_HOE<HomeownersLine_HOE>{

  final static var _logger = UnaLoggerCategory.UNA_RATING
  private static final var CLASS_NAME = UNAHORatingEngine_HOE.Type.DisplayName

  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
  }

  /**
  * Rate the medical payments coverage
   */
  override function rateMedicalPayments(lineCov: HOLI_Med_Pay_HOE, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateMedicalPayments to rate Medical Payments Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var costData = new HomeownersCovCostData_HOE(dateRange.start, dateRange.end, lineCov.Currency, RateCache, lineCov.FixedId)
    costData.init(PolicyLine)
    costData.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getLineCovParameterSet(costData, lineRatingInfo)
    Executor.execute(HORateRoutineNames.MED_PAY_TX_ROUTINE_NAME, lineCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    //addWorksheetForCoverage(lineCov, costData)
    addCost(costData)
    _logger.debug("Medical Payments Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
  *  rate the personal liability coverage
   */
  override function ratePersonalLiability(lineCov: HOLI_Personal_Liability_HOE, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalLiability to rate Personal Liability Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var costData = new HomeownersCovCostData_HOE(dateRange.start, dateRange.end, lineCov.Currency, RateCache, lineCov.FixedId)
    costData.init(PolicyLine)
    costData.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getLineCovParameterSet(costData, lineRatingInfo)
    Executor.execute(HORateRoutineNames.PERSONAL_LIABILITY_TX_ROUTINE_NAME, lineCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    //addWorksheetForCoverage(lineCov, costData)
    addCost(costData)
    _logger.debug("Personal Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  override function rateEquipmentBreakdownCoverage(dwellingCov : HODW_EquipBreakdown_HOE_Ext, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateEquipmentBreakdownCoverage to rate Equipment Breakdown Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    var costData = new DwellingCovCostData_HOE(dateRange.start, dateRange.end, dwellingCov.Currency, RateCache, dwellingCov.FixedId)
    costData.init(PolicyLine)
    costData.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getDwellingCovParameterSet(costData, dwellingRatingInfo)
    Executor.execute(HORateRoutineNames.EQUIPMENT_BREAKDOWN_COV_ROUTINE_NAME, dwellingCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    addCost(costData)
    _logger.debug("Equipment Breakdown Coverage Rated Successfully", this.IntrinsicType)
  }

  override function rateAnimalLiabilityCoverage(dwellingCov : HODW_AnimalLiability_HOE_Ext, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateAnimalLiabilityCoverage to rate Animal Liability Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    var costData = new DwellingCovCostData_HOE(dateRange.start, dateRange.end, dwellingCov.Currency, RateCache, dwellingCov.FixedId)
    costData.init(PolicyLine)
    costData.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getDwellingCovParameterSet(costData, dwellingRatingInfo)
    Executor.execute(HORateRoutineNames.ANIMAL_LIABILITY_COV_ROUTINE_NAME, dwellingCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    addCost(costData)
    _logger.debug("Animal Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  override function rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov : HODW_SpecificOtherStructure_HOE_Ext, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresIncreasedOrDecreasedLimits to rate Other Structures Increased Or Decreased Limits Coverage", this.IntrinsicType)
    var costData = createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_INCREASED_OR_DECREASED_LIMITS_COV_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Other Structures Increased Or Decreased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  // Returns the parameter set for the line coverages
  private function getLineCovParameterSet(costData : HOCostData_HOE, lineRatingInfo : HOLineRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> PolicyLine,
        TC_STATE -> this.BaseState,
        TC_RATINGINFO -> lineRatingInfo,
        TC_COSTDATA -> costData
    }
  }

  // Returns the parameter set for the Dwelling level coverages
  private function getDwellingCovParameterSet(costData : HOCostData_HOE, dwellingRatingInfo : HODwellingRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> PolicyLine,
        TC_STATE -> this.BaseState.Code,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo,
        TC_COSTDATA -> costData
    }
  }

  private function createCostDataForDwellingCoverage(dwellingCov : DwellingCov_HOE, dateRange : DateRange, routineName : String) : CostData{
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    var costData = new DwellingCovCostData_HOE(dateRange.start, dateRange.end, dwellingCov.Currency, RateCache, dwellingCov.FixedId)
    costData.init(PolicyLine)
    costData.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getDwellingCovParameterSet(costData, dwellingRatingInfo)
    Executor.execute(routineName, dwellingCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  /*private function addWorksheetForCoverage(coverage : EffDated, costData : HOCostData_HOE){
    if(Plugins.get(IRateRoutinePlugin).worksheetsEnabledForLine(PolicyLine.PatternCode)){
      var worksheet = new Worksheet(){ :WorksheetEntries = costData.WorksheetEntries }
      PolicyLine.Branch.addWorksheetFor(coverage, worksheet)
    }
  }*/
}