package una.rating.ho.hawaii.ratinginfos
/**
 * Created with IntelliJ IDEA.
 * User: proy
 * Date: 3/28/17
 * Time: 4:40 PM
 * To change this template use File | Settings | File Templates.
 */
uses una.rating.ho.common.HOCommonDiscountsOrSurchargeRatingInfo
uses java.math.BigDecimal

class HOHIProtectiveDeviceDetailsRatingInfo extends HOCommonDiscountsOrSurchargeRatingInfo{

  var _fireAlarmReportCntlStn : boolean as FireAlarmReportCntlStn = false
  var _burglarAlarmReportCntlStn : boolean as BurglarAlarmReportCntlStn = false
  var _localFireAlarm : boolean as LocalFireAlarm = false
  var _completeLocalBurglarAlarm : boolean as CompleteLocalBurglarAlarm = false
  var _automaticSprinklerSystem : boolean as AutomaticSprinklerSystem = false
  var _gatedCommunity : boolean as GatedCommunity = false
  var _noProtectiveDevice : boolean as NoProtectiveDevice = false

  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal){
    super(line, totalBasePremium)
    var dwelling = line?.Dwelling

    if(dwelling?.DwellingProtectionDetails?.FireAlarmReportCntlStn){
      _fireAlarmReportCntlStn = true
    }
    if(dwelling?.DwellingProtectionDetails?.BurglarAlarmReportCntlStn){
      _burglarAlarmReportCntlStn = true
    }
    if(dwelling?.DwellingProtectionDetails?.FireAlarm){
      _localFireAlarm = true
    }
    if(dwelling?.DwellingProtectionDetails?.BurglarAlarm){
      _completeLocalBurglarAlarm = true
    }
    if(dwelling?.DwellingProtectionDetails?.AutomaticSprinkler){
      _automaticSprinklerSystem = true
    }
    if(dwelling?.DwellingProtectionDetails?.GatedCommunity){
      _gatedCommunity = true
    }
    if(_fireAlarmReportCntlStn == false and _burglarAlarmReportCntlStn == false and _localFireAlarm == false and
       _completeLocalBurglarAlarm == false and _automaticSprinklerSystem == false and _gatedCommunity == false){
        _noProtectiveDevice = true
    }
  }

}