package una.rating.ho.tx.ratinginfos

uses java.math.BigDecimal
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/1/16
 * Time: 5:51 PM
 */
class HODiscountsOrSurchargesRatingInfo extends una.rating.ho.common.HOCommonDiscountsOrSurchargeRatingInfo {

  var _burglarAlarmType: String as BurglarAlarmType
  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal) {
    super(line, totalBasePremium)
    if (line.Dwelling?.DwellingProtectionDetails?.BurglarAlarm){
      _burglarAlarmType = line.Dwelling?.DwellingProtectionDetails?.BurglarAlarmType.DisplayName
    }
  }
}