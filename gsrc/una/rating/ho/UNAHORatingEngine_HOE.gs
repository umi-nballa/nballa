package una.rating.ho

uses gw.lob.common.util.DateRange
uses gw.lob.ho.rating.HomeownersCovCostData_HOE
uses java.util.Map
uses gw.lob.ho.rating.HOCostData_HOE
uses una.logging.UnaLoggerCategory

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

  // Returns the parameter set for the line coverages
  private function getLineCovParameterSet(costData : HOCostData_HOE, lineRatingInfo : HOLineRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> PolicyLine,
        TC_STATE -> this.BaseState,
        TC_RATINGINFO -> lineRatingInfo,
        TC_COSTDATA -> costData
    }
  }

  /*private function addWorksheetForCoverage(coverage : EffDated, costData : HOCostData_HOE){
    if(Plugins.get(IRateRoutinePlugin).worksheetsEnabledForLine(PolicyLine.PatternCode)){
      var worksheet = new Worksheet(){ :WorksheetEntries = costData.WorksheetEntries }
      PolicyLine.Branch.addWorksheetFor(coverage, worksheet)
    }
  }*/
}