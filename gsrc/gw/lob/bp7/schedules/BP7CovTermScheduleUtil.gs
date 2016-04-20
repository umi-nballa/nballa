package gw.lob.bp7.schedules
uses gw.api.domain.covterm.CovTerm
uses gw.lob.bp7.BP7PostOnChangeHandler

class BP7CovTermScheduleUtil {

  static function showSchedule(term : CovTerm) : boolean {
    return isScheduleCovTerm(term) and isYes(term)
  }

  static function isScheduleCovTerm(term : CovTerm) : boolean {
    return BP7PostOnChangeHandler.doesCovTermHaveSchedule(term)
  }

  private static function isYes(term : CovTerm) : boolean {
    return term.ValueAsString?.toLowerCase() == "yes" or 
           term.ValueAsString?.toLowerCase() == "true"
  }
}