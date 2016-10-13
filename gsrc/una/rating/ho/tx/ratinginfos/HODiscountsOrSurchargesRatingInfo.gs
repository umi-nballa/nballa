package una.rating.ho.tx.ratinginfos

uses java.math.BigDecimal
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/1/16
 * Time: 5:51 PM
 */
class HODiscountsOrSurchargesRatingInfo {
  var _totalBasePremium: BigDecimal as TotalBasePremium
  var _yearBuilt: int as YearBuilt
  var _ageOfHome: int as AgeOfHome
  var _burglarAlarmType: String as BurglarAlarmType
  final var _ageOfHomeGreaterLimit: int as AgeOfHomeGreaterLimit = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, TC_TX)
  construct(lineVersion: HomeownersLine_HOE) {
    _yearBuilt = lineVersion.Dwelling?.YearBuilt
    var policyEffectiveDate = lineVersion.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate
    _ageOfHome = (policyEffectiveDate - _yearBuilt)

    if (lineVersion.Dwelling?.BurglarAlarm){
      _burglarAlarmType = lineVersion.Dwelling?.BurglarAlarmType.DisplayName
    }
  }
}