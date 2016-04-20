package gw.lob.bp7.rating

uses java.util.Date
uses java.util.Map
uses gw.rating.CostData
uses gw.plugin.productmodel.IReferenceDatePlugin
uses gw.api.productmodel.CoveragePattern
uses gw.job.RenewalProcess

class BP7RateRoutineExecutor {

  var _referenceDate : IReferenceDatePlugin
  var _line : BP7BusinessOwnersLine
  var _ratingLevel : RateBookStatus
  
  construct(referenceDate : IReferenceDatePlugin, line : BP7BusinessOwnersLine, ratingLevel : RateBookStatus) {
    _referenceDate = referenceDate
    _ratingLevel = ratingLevel
    _line = line
  }

  function execute(code : String, coverage : Coverage, paramSet : Map<CalcRoutineParamName,Object>, costData : CostData) {
    var refDate = _referenceDate.getCoverageReferenceDate(coverage.Pattern as CoveragePattern, coverage.OwningCoverable)
    var rateBook = getRateBook(refDate)    
    rateBook.executeCalcRoutine(code, costData, costData, paramSet)
  }
  
  private function getRateBook(refDate : Date) : RateBook {  
    return RateBook.selectRateBook(refDate, _line.Branch.RateAsOfDate, _line.PolicyLine.PatternCode,
                                  _line.BaseState, _ratingLevel, _line.Branch.JobProcess typeis RenewalProcess, null)
  }
}

