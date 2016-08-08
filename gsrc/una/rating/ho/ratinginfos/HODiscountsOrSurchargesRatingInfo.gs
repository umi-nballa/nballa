package una.rating.ho.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/1/16
 * Time: 5:51 PM
 */
class HODiscountsOrSurchargesRatingInfo {

  var _totalBasePremium : BigDecimal as TotalBasePremium
  var _yearBuilt : int as YearBuilt
  var _ageOfHome : int as AgeOfHome
  var _burglarAlarmType : String as BurglarAlarmType

  construct(lineVersion : HomeownersLine_HOE){
    _yearBuilt = lineVersion.Dwelling?.YearBuilt
    var currentYear = lineVersion.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate
    _ageOfHome = (currentYear - _yearBuilt)

    if(lineVersion.Dwelling?.BurglarAlarm){
      _burglarAlarmType = lineVersion.Dwelling?.BurglarAlarmType.DisplayName
    }
  }

}