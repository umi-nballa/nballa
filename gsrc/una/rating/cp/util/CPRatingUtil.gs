package una.rating.cp.util

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 */
class CPRatingUtil {

  private static var _line : CPLine

  static property set Line(line : CPLine){
    _line = line
  }

  static property get ScheduledRatingModifier(): BigDecimal {
    var scheduledRatingModifierFactor: BigDecimal = 1.0
    var modifiers = _line.Modifiers
    var scheduledRate = modifiers?.where(\m -> m.ScheduleRate)
    var rateFactors = scheduledRate*.RateFactors
    for (factor in rateFactors) {
      scheduledRatingModifierFactor += factor.AssessmentWithinLimits
    }
    return scheduledRatingModifierFactor
  }

  static property get ConsentToRateFactor() : BigDecimal {
    if(_line.Branch.ConsentToRateReceived_Ext || _line.Branch.Rule180_Ext)
      return _line.Branch.Factor_Ext
    return 1.0
  }
}