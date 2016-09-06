package gw.lob.bp7.rating

uses java.util.Date
uses java.util.Map
uses gw.rating.CostData
uses gw.plugin.productmodel.IReferenceDatePlugin
uses gw.api.productmodel.CoveragePattern
uses gw.job.RenewalProcess
uses una.logging.UnaLoggerCategory
uses java.lang.Exception
uses gw.rating.rtm.NoSuitableRateBookFoundException
uses gw.rating.flow.util.QueryUtils
uses gw.api.rating.RatingException
uses java.lang.IllegalStateException

class BP7RateRoutineExecutor {

  var _referenceDate : IReferenceDatePlugin
  var _line : BP7BusinessOwnersLine
  var _ratingLevel : RateBookStatus
  final static var _logger = UnaLoggerCategory.UNA_RATING
  
  construct(referenceDate : IReferenceDatePlugin, line : BP7BusinessOwnersLine, ratingLevel : RateBookStatus) {
    _referenceDate = referenceDate
    _ratingLevel = ratingLevel
    _line = line
  }

  /**
   * Function which fetches the rate book and executes the rate routine
   */
  function execute(code : String, coverage : Coverage, paramSet : Map<CalcRoutineParamName,Object>, costData : CostData) {
    try{
      var refDate = _referenceDate.getCoverageReferenceDate(coverage.Pattern as CoveragePattern, coverage.OwningCoverable)
      var rateBook = getRateBook(refDate)
      rateBook.executeCalcRoutine(code, costData, costData, paramSet)
    } catch (ex : Exception){
      _logger.error("Error during executing rate routine : " + code , ex)
      throw ex
    }
  }

  /**
   * Retrieves the most updated rate book based on the reference date, state, Policy Line
   */
  private function getRateBook(refDate : Date) : RateBook {
    try{
    return RateBook.selectRateBook(refDate, _line.Branch.RateAsOfDate, _line.PolicyLine.PatternCode,
                                  _line.BaseState, _ratingLevel, _line.Branch.JobProcess typeis RenewalProcess, null)
    } catch (e : NoSuitableRateBookFoundException){
      if (QueryUtils.getRateBooksForLine("BP7BusinessOwnersLine").size() == 0) {
        _logger.error("No Rate Books are loaded for the BOP Line")
        throw new RatingException("No Rate Books are loaded for the BOP Line")
      } else {
        _logger.error("No Rate Books for BOP with " + _ratingLevel.Description + " status matches the filter criteria")
        throw new RatingException("No Rate Books for BOP with " + _ratingLevel.Description + " status matches the filter criteria")
      }
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
}

