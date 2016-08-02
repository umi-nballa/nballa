package una.rating.ho

uses gw.lob.common.util.DateRange
uses gw.lob.ho.rating.HomeownersCovCostData_HOE
uses gw.lob.ho.rating.DwellingCovCostData_HOE
uses gw.lob.ho.rating.HOCostData_HOE
uses java.util.Map
uses una.logging.UnaLoggerCategory
uses gw.rating.CostData
uses gw.financials.PolicyPeriodFXRateCache
uses una.rating.ho.ratinginfos.HORatingInfo
uses una.rating.ho.ratinginfos.HOLineRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/18/16
 * Time: 6:30 PM
 */
class UNAHOTXRatingEngine extends UNAHORatingEngine_HOE<HomeownersLine_HOE>{

  final static var _logger = UnaLoggerCategory.UNA_RATING
  private static final var CLASS_NAME = UNAHOTXRatingEngine.Type.DisplayName
  private var _hoRatingInfo : HORatingInfo

  construct(line: HomeownersLine_HOE){
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
    _hoRatingInfo = new HORatingInfo()
  }

  /**
  * Rate the base premium for the TX HO
   */
  override function rateHOBasePremium(dwelling : Dwelling_HOE, rateCache : PolicyPeriodFXRateCache, dateRange : DateRange){

    var rater = new HOBasePremiumRaterTX(dwelling, PolicyLine, Executor, RateCache, _hoRatingInfo)
    var costs = rater.rateBasePremium(dateRange, this.NumDaysInCoverageRatedTerm)
    addCosts(costs)
    updateTotalBasePremium()

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
      case HOLI_UnitOwnersRentedtoOthers_HOE_Ext:
          rateUnitOwnersRentalToOthers(lineCov, dateRange, _hoRatingInfo)
          break
    }
  }

  /**
   * Rate the Dwelling level coverages
   */
  override function rateDwellingCoverages(dwellingCov : DwellingCov_HOE, dateRange : DateRange) {
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
      case HODW_SpecificAddAmt_HOE_Ext:
          rateSpecifiedAdditionalAmountCoverage(dwellingCov, dateRange, _hoRatingInfo)
          break
      case HODW_Personal_Property_HOE:
          rateIncreasedPersonalProperty(dwellingCov, dateRange)
          break
    }
  }

  /**
   * Function which rates the discounts and surcharges
  */
  override function rateDiscountsOrSurcharges(dwelling : Dwelling_HOE, dateRange : DateRange){
    if(dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEAS || dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC){

    }
  }

  /**
  *  Function to rate the Seasonal Or Secondary Residence Surcharge
   */
  function rateSeasonalOrSecondaryResidenceSurcharge(dwelling : Dwelling_HOE, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateSeasonalOrSecondaryResidenceSurcharge", this.IntrinsicType)
    //var lineRatingInfo = new HODiscountsOrSurchargesRatingInfo()

    /*lineRatingInfo.TotalBasePremium = hoRatingInfo.FinalAdjustedBaseClassPremium//need to update with the total base premium
    var costData = createCostDataForDiscountsOrSurcharges(lineCov, dateRange, HORateRoutineNames.UNIT_OWNERS_RENTED_TO_OTHERS_COV_ROUTINE_NAME, lineRatingInfo)
    if(costData != null)
      addCost(costData) */
    _logger.debug("Unit Owners Rental To Others Coverage Rated Successfully", this.IntrinsicType)
  }
  /**
  * Rate the unit owners - Rental to other coverage
   */
  function rateUnitOwnersRentalToOthers(lineCov : HOLI_UnitOwnersRentedtoOthers_HOE_Ext, dateRange : DateRange, hoRatingInfo : HORatingInfo){
    _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnersRentalToOthers to rate Unit Owners Rental To Others Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    lineRatingInfo.TotalBasePremium = hoRatingInfo.TotalBasePremium//need to update with the total base premium
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.UNIT_OWNERS_RENTED_TO_OTHERS_COV_ROUTINE_NAME, lineRatingInfo)
    if(costData != null)
      addCost(costData)
    _logger.debug("Unit Owners Rental To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the medical payments coverage
   */
  function rateMedicalPayments(lineCov: HOLI_Med_Pay_HOE, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateMedicalPayments to rate Medical Payments Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.MED_PAY_TX_ROUTINE_NAME, lineRatingInfo)
    if(costData != null)
      addCost(costData)
    _logger.debug("Medical Payments Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the personal liability coverage
   */
  function ratePersonalLiability(lineCov: HOLI_Personal_Liability_HOE, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalLiability to rate Personal Liability Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.PERSONAL_LIABILITY_TX_ROUTINE_NAME, lineRatingInfo)
    if(costData != null)
      addCost(costData)
    _logger.debug("Personal Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the additional residence rented to others coverage
  */
  function rateAdditionalResidenceRentedToOthersCoverage(lineCov: HOLI_AddResidenceRentedtoOthers_HOE, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateAdditionalResidenceRentedToOthersCoverage to rate Additional Residence Rented To Others Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.ADDITIONAL_RESIDENCE_RENTED_TO_OTHERS_TX_ROUTINE_NAME, lineRatingInfo)
    if(costData != null)
      addCost(costData)
    _logger.debug("Additional Residence Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Animal Liability Coverage
   */
  function rateAnimalLiabilityCoverage(lineCov : HOLI_AnimalLiabilityCov_HOE_Ext, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateAnimalLiabilityCoverage to rate Animal Liability Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.ANIMAL_LIABILITY_COV_ROUTINE_NAME, lineRatingInfo)
    if(costData != null)
      addCost(costData)
    _logger.debug("Additional Residence Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate personal injury line coverage
   */
  function ratePersonalInjury(lineCov: HOLI_PersonalInjury_HOE, dateRange : DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalInjury to rate Personal Injury Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.PERSONAL_INJURY_ROUTINE_NAME, lineRatingInfo)
    if(costData != null)
      addCost(costData)
    _logger.debug("Personal Injury Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Loss Assessment Coverage line coverage
   */
  function rateLossAssessmentCoverage(lineCov: HODW_LossAssessmentCov_HOE_Ext, dateRange : DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateLossAssessmentCoverage to rate Loss Assessment Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var costData = createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.LOSS_ASSESSMENT_COV_TX_ROUTINE_NAME, lineRatingInfo)
    if(costData != null)
      addCost(costData)
    _logger.debug("Loss Assessment Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Personal property - Increased limits coverage
  */
  function rateIncreasedPersonalProperty(dwellingCov : HODW_Personal_Property_HOE, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedPersonalProperty to rate Personal Property Increased Limit Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    if(dwellingRatingInfo.IsPersonalPropertyIncreasedLimit){
      var costData = createCostDataForDwellingCoverage(dwellingCov, dateRange, dwellingRatingInfo, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME)
      if(costData != null)
        addCost(costData)
    }
    _logger.debug("Personal Property Increased Limit Coverage Rated Successfully", this.IntrinsicType)
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

  /**
   * Rate the Unit Owners Outbuilding and Other Structures Coverage
  */
  function rateUnitOwnersOutbuildingAndOtherStructuresCoverage(dwellingCov : HODW_UnitOwnersOutbuildingCov_HOE_Ext, dateRange : DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnersOutbuildingAndOtherStructuresCoverage to rate Unit Owners Outbuilding and Other Structures Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    var costData = createCostDataForDwellingCoverage(dwellingCov, dateRange, dwellingRatingInfo, HORateRoutineNames.UNIT_OWNERS_OUTBUILDINGS_AND_OTHER_STRUCTURES_COV_TX_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Unit Owners Outbuilding and Other Structures Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the specified additional amount for coverage A
  */
  function rateSpecifiedAdditionalAmountCoverage(dwellingCov : HODW_SpecificAddAmt_HOE_Ext, dateRange : DateRange,hoRatingInfo : HORatingInfo){
    _logger.debug("Entering " + CLASS_NAME + ":: rateSpecifiedAdditionalAmountCoverage to rate Specified Additional Amount Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    dwellingRatingInfo.TotalBasePremium = hoRatingInfo.TotalBasePremium
    var costData = createCostDataForDwellingCoverage(dwellingCov, dateRange, dwellingRatingInfo, HORateRoutineNames.SPECIFIED_ADDITIONAL_AMOUNT_COV_ROUTINE_NAME)
    if(costData != null)
      addCost(costData)
    _logger.debug("Specified Additional Amount Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Residential Glass Coverage
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

  /**
  *  Returns the parameter set for the line level coverages
   */
  private function getLineCovParameterSet(costData : HOCostData_HOE, lineRatingInfo : HOLineRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> PolicyLine,
        TC_STATE -> this.BaseState.Code,
        TC_LINERATINGINFO_EXT -> lineRatingInfo,
        TC_COSTDATA -> costData
    }
  }

  /**
   * Returns the parameter set for the Dwelling level coverages
  */
  private function getDwellingCovParameterSet(costData : HOCostData_HOE, dwellingRatingInfo : HODwellingRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> PolicyLine,
        TC_STATE -> this.BaseState.Code,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo,
        TC_COSTDATA -> costData
    }
  }

  /**
   * creates cost data for the dwelling level coverages
  */
  private function createCostDataForDwellingCoverage(dwellingCov : DwellingCov_HOE, dateRange : DateRange, dwellingRatingInfo : HODwellingRatingInfo, routineName : String) : CostData{
    var costData = new DwellingCovCostData_HOE(dateRange.start, dateRange.end, dwellingCov.Currency, RateCache, dwellingCov.FixedId)
    costData.init(PolicyLine)
    costData.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getDwellingCovParameterSet(costData, dwellingRatingInfo)
    Executor.execute(routineName, dwellingCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * creates the cost data for the Line level coverages
  */
  private function createCostDataForLineCoverages(lineCov : HomeownersLineCov_HOE, dateRange : DateRange, routineName : String, lineRatingInfo : HOLineRatingInfo) : CostData{
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

  private function updateTotalBasePremium(){
    _hoRatingInfo.TotalBasePremium += (_hoRatingInfo.FinalAdjustedBaseClassPremium + _hoRatingInfo.ReplacementCostDwellingPremium)
  }

}