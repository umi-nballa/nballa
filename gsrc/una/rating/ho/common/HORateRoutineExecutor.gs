package una.rating.ho.common

uses java.util.Map
uses gw.rating.CostData
uses gw.plugin.productmodel.IReferenceDatePlugin
uses gw.lob.common.util.DateRange
uses una.logging.UnaLoggerCategory
uses java.lang.Exception
uses gw.api.productmodel.CoveragePattern
uses java.util.Date
uses java.lang.IllegalStateException
uses gw.job.RenewalProcess
uses gw.rating.rtm.NoSuitableRateBookFoundException
uses gw.rating.flow.util.QueryUtils
uses gw.api.rating.RatingException

/**
 * User: bduraiswamy
 * Date: 6/16/16
 * Time: 10:32 AM
 * This is the custom UNA implementation which executes the rate routines.
 */

class HORateRoutineExecutor {

  var _referenceDate : IReferenceDatePlugin
  var _line : HomeownersLine_HOE
  var _ratingLevel : RateBookStatus
  var _offeringCode : String
  var _sliceDateRange : DateRange
  final static var _logger = UnaLoggerCategory.UNA_RATING

  construct(referenceDate : IReferenceDatePlugin, line : HomeownersLine_HOE, ratingLevel : RateBookStatus, offeringCode : String) {
    _referenceDate = referenceDate
    _ratingLevel = ratingLevel
    _line = line
    _offeringCode = offeringCode
  }

  /**
  * Function which fetches the rate book and executes the rate routine
   */
  function execute(code : String, coverage : Coverage, paramSet : Map<CalcRoutineParamName,Object>, costData : CostData) {
    try{
      var refDate = _referenceDate.getCoverageReferenceDate(coverage.Pattern as CoveragePattern, coverage.OwningCoverable)
      var rateBook = getRateBook(refDate)
      rateBook.executeCalcRoutine(code, costData, costData, paramSet)
    } catch(ex : Exception){
      _logger.error("Error during executing rate routine : " + code , ex)
      throw ex
    }
  }

  /**
   * Function which fetches the rate book and executes the rate routine
   */
  function executeBasedOnSliceDate(code : String, paramSet : Map<CalcRoutineParamName,Object>, costData : CostData, refStartDate : Date, refEndDate : Date) {
    try{
      var policyPeriod = _line.Branch
      if(policyPeriod != null){
        if(refStartDate.before(policyPeriod.PeriodStart) or refEndDate.after(policyPeriod.PeriodEnd)){
          throw new IllegalStateException("Cannot lookup book for ${_line.BaseState}, the policy is not effective as of ${refStartDate.ShortFormat}")
        }
      }
      var rateBook = getRateBook(refStartDate)
      rateBook.executeCalcRoutine(code, costData, costData, paramSet)
    } catch(ex : Exception){
      _logger.error("Error during executing rate routine : " + code , ex)
      throw ex
    }
  }

  /**
   * Retrieves the most updated rate book based on the reference date, state, Policy Line
  */
  private function getRateBook(refDate : Date) : RateBook {
    try{
      _logger.info("Fetching the HO Rate Book for state : " + _line.BaseState.Description)
      var rateBook = RateBook.selectRateBook(refDate, _line.Branch.RateAsOfDate, _line.PolicyLine.PatternCode, _line.BaseState, _ratingLevel,
                                             _line.Branch.JobProcess typeis RenewalProcess, _offeringCode)
      return rateBook
    } catch (e : NoSuitableRateBookFoundException){
      if (QueryUtils.getRateBooksForLine("HomeownersLine_HOE").size() == 0) {
        _logger.error("No Rate Books are loaded for the HO Line")
        throw new RatingException("No Rate Books are loaded for the HO Line")
      } else {
        _logger.error("No Rate Books for HO with " + _ratingLevel.Description + " status matches the filter criteria")
        throw new RatingException("No Rate Books for HO with " + _ratingLevel.Description + " status matches the filter criteria")
      }
    }
  }
}