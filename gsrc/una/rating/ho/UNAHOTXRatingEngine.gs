package una.rating.ho

uses gw.lob.common.util.DateRange
uses gw.lob.ho.rating.HomeownersCovCostData_HOE
uses gw.lob.ho.rating.DwellingCovCostData_HOE
uses gw.lob.ho.rating.HOCostData_HOE
uses java.util.Map
uses una.logging.UnaLoggerCategory
uses gw.rating.CostData

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/18/16
 * Time: 6:30 PM
 */
class UNAHOTXRatingEngine extends UNAHORatingEngine_HOE<HomeownersLine_HOE>{

  final static var _logger = UnaLoggerCategory.UNA_RATING
  private static final var CLASS_NAME = UNAHOTXRatingEngine.Type.DisplayName

  construct(line: HomeownersLine_HOE){
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
  }

  /**
   * Rate the line level coverages
   */
  override function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange : DateRange) {
    switch (typeof lineCov) {
      case HOLI_Med_Pay_HOE:
          rateMedicalPayments(lineCov, dateRange)
          break
      case HOLI_Personal_Liability_HOE:
          ratePersonalLiability(lineCov, dateRange)
          break
      case HOLI_PersonalInjury_HOE:
          ratePersonalInjury(lineCov, dateRange)
          break
      case HODW_LossAssessmentCov_HOE_Ext:
          rateLossAssessmentCoverage(lineCov, dateRange)
          break
      case HOLI_AddResidenceRentedtoOthers_HOE:
          rateAdditionalResidenceRentedToOthersCoverage(lineCov, dateRange)
          break
      case HOLI_AnimalLiabilityCov_HOE_Ext:
          rateAnimalLiabilityCoverage(lineCov, dateRange)
          break
    }
  }

  /**
   * Rate the Dwelling level coverages
   */
  override function rateDwellingCoverages(dwellingCov : DwellingCov_HOE, dateRange : DateRange, ratingInfo : HORatingInfo) {
    switch(typeof dwellingCov){
      case HODW_EquipBreakdown_HOE_Ext:
          rateEquipmentBreakdownCoverage(dwellingCov, dateRange)
          break
      case HODW_SpecificOtherStructure_HOE_Ext:
          rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov, dateRange)
          break
      case HODW_ResidentialGlass_HOE_Ext:
          rateResidentialGlassCoverage(dwellingCov, dateRange)
          break
      case HODW_IdentityTheftExpenseCov_HOE_Ext:
          rateIdentityTheftExpenseCoverage(dwellingCov, dateRange)
          break
      case HODW_UnitOwnersOutbuildingCov_HOE_Ext:
          rateUnitOwnersOutbuildingAndOtherStructuresCoverage(dwellingCov, dateRange)
          break
    }
  }

  /**
   * Rate the medical payments coverage
   */
  function rateMedicalPayments(lineCov: HOLI_Med_Pay_HOE, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateMedicalPayments to rate Medical Payments Coverage", this.IntrinsicType)
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.MED_PAY_TX_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Medical Payments Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the personal liability coverage
   */
  function ratePersonalLiability(lineCov: HOLI_Personal_Liability_HOE, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalLiability to rate Personal Liability Coverage", this.IntrinsicType)
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.PERSONAL_LIABILITY_TX_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Personal Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  function rateAdditionalResidenceRentedToOthersCoverage(lineCov: HOLI_AddResidenceRentedtoOthers_HOE, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateAdditionalResidenceRentedToOthersCoverage to rate Additional Residence Rented To Others Coverage", this.IntrinsicType)
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.ADDITIONAL_RESIDENCE_RENTED_TO_OTHERS_TX_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Additional Residence Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Animal Liability Coverage
   */
  function rateAnimalLiabilityCoverage(lineCov : HOLI_AnimalLiabilityCov_HOE_Ext, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateAnimalLiabilityCoverage to rate Animal Liability Coverage", this.IntrinsicType)
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.ANIMAL_LIABILITY_COV_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Additional Residence Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate personal injury line coverage
   */
  function ratePersonalInjury(lineCov: HOLI_PersonalInjury_HOE, dateRange : DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalInjury to rate Personal Injury Coverage", this.IntrinsicType)
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.PERSONAL_INJURY_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Personal Injury Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Loss Assessment Coverage line coverage
   */
  function rateLossAssessmentCoverage(lineCov: HODW_LossAssessmentCov_HOE_Ext, dateRange : DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateLossAssessmentCoverage to rate Loss Assessment Coverage", this.IntrinsicType)
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.LOSS_ASSESSMENT_COV_TX_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Loss Assessment Coverage Rated Successfully", this.IntrinsicType)
  }

  function rateAdditionalInsuredCoverage(lineVersion: HomeownersLine_HOE, dateRange : DateRange){
    /*_logger.debug("Entering " + CLASS_NAME + ":: rateAdditionalInsuredCoverage to rate Additional Insured Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineVersion)
    var costData = new HomeownersCovCostData_HOE(dateRange.start, dateRange.end, lineVersion.PreferredCoverageCurrency, RateCache, lineVersion.FixedId, HOLineCostType_Ext.TC_ADDITIONALINSURED)
    costData.init(PolicyLine)
    costData.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getLineCovParameterSet(costData, lineRatingInfo)
    Executor.execute(HORateRoutineNames.LOSS_ASSESSMENT_COV_TX_ROUTINE_NAME, lineCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    if(costData != null)
      addCost(costData)
    _logger.debug("Loss Assessment Coverage Rated Successfully", this.IntrinsicType) */
  }

  /**
   * Rate Identity Theft Expense Coverage coverage
   */
  function rateIdentityTheftExpenseCoverage(dwellingCov : HODW_IdentityTheftExpenseCov_HOE_Ext, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateIdentityTheftExpenseCoverage to rate Identity Theft Expense Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    var costData = createCostDataForDwellingCoverage(dwellingCov, dateRange, dwellingRatingInfo, HORateRoutineNames.IDENTITY_THEFT_EXPENSE_COV_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Identity Theft Expense Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Equipment breakdown coverage
   */
  function rateEquipmentBreakdownCoverage(dwellingCov : HODW_EquipBreakdown_HOE_Ext, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateEquipmentBreakdownCoverage to rate Equipment Breakdown Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    var costData = createCostDataForDwellingCoverage(dwellingCov, dateRange, dwellingRatingInfo, HORateRoutineNames.EQUIPMENT_BREAKDOWN_COV_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Equipment Breakdown Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Other structures - Increased or decreased Limits coverage for HCONB
   */
  function rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov : HODW_SpecificOtherStructure_HOE_Ext, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresIncreasedOrDecreasedLimits to rate Other Structures Increased Or Decreased Limits Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    var costData = createCostDataForDwellingCoverage(dwellingCov, dateRange, dwellingRatingInfo, HORateRoutineNames.OTHER_STRUCTURES_INCREASED_OR_DECREASED_LIMITS_COV_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Other Structures Increased Or Decreased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  function rateUnitOwnersOutbuildingAndOtherStructuresCoverage(dwellingCov : HODW_UnitOwnersOutbuildingCov_HOE_Ext, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnersOutbuildingAndOtherStructuresCoverage to rate Unit Owners Outbuilding and Other Structures Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    var costData = createCostDataForDwellingCoverage(dwellingCov, dateRange, dwellingRatingInfo, HORateRoutineNames.UNIT_OWNERS_OUTBUILDINGS_AND_OTHER_STRUCTURES_COV_TX_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Unit Owners Outbuilding and Other Structures Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the residential Glass Coverage
   */
  function rateResidentialGlassCoverage(dwellingCov : HODW_ResidentialGlass_HOE_Ext, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateResidentialGlassCoverage to rate Residential Glass Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    if(dwellingRatingInfo.IsResidentialGlassCovUnscheduled == "Yes"){
      var costData = createCostDataForDwellingCoverage(dwellingCov, dateRange, dwellingRatingInfo, HORateRoutineNames.RESIDENTIAL_GLASS_TX_COV_ROUTINE_NAME)
      if(costData != null)
        addCost(costData)
    }
    _logger.debug("Residential Glass Coverage Rated Successfully", this.IntrinsicType)
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

  private function createCostDataForDwellingCoverage(dwellingCov : DwellingCov_HOE, dateRange : DateRange, dwellingRatingInfo : HODwellingRatingInfo, routineName : String) : CostData{
    var costData = new DwellingCovCostData_HOE(dateRange.start, dateRange.end, dwellingCov.Currency, RateCache, dwellingCov.FixedId)
    costData.init(PolicyLine)
    costData.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getDwellingCovParameterSet(costData, dwellingRatingInfo)
    Executor.execute(routineName, dwellingCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  private function createCostDataForLineCoverages(lineCov : HomeownersLineCov_HOE, dateRange : DateRange, routineName : String) : CostData{
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var costData = new HomeownersCovCostData_HOE(dateRange.start, dateRange.end, lineCov.Currency, RateCache, lineCov.FixedId)
    costData.init(PolicyLine)
    costData.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getLineCovParameterSet(costData, lineRatingInfo)
    Executor.execute(routineName, lineCov, rateRoutineParameterMap, costData)
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