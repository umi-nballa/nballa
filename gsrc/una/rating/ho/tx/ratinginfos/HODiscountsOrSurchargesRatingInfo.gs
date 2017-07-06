package una.rating.ho.tx.ratinginfos

uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/1/16
 * Time: 5:51 PM
 */
class HODiscountsOrSurchargesRatingInfo extends una.rating.ho.common.HOCommonDiscountsOrSurchargeRatingInfo {

  var _propertyCovByStateWindstorm : boolean as PropertyCovByStateWindstorm
  var _sprinklerSystemAllAreas : boolean as SprinklerSystemAllAreas
  var _fireAlarmReportCntlStn : boolean as FireAlarmReportCntlStn
  var _fireAlarmReportFireStn : boolean as FireAlarmReportFireStn
  var _completeLocalBurglarAlarm : boolean as CompleteLocalBurglarAlarm
  var _burglarAlarmReportCntlStn : boolean as BurglarAlarmReportCntlStn
  var _burglarAlarmReportPoliceStn : boolean as BurglarAlarmReportPoliceStn
  var _windPool : boolean as WindPool
  var _claimFreeYears : NoClaimFreeYears_Ext as ClaimFreeYears
  var _totalContentsPremium : BigDecimal as TotalContentsPremium
  var _totalDwellingPremium : BigDecimal as TotalDwellingPremium

  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal) {
    super(line, totalBasePremium)
    var dwelling = line.Dwelling
    _propertyCovByStateWindstorm = dwelling.PropertyCovByStateWndstorm_Ext
    _fireAlarmReportCntlStn = dwelling.DwellingProtectionDetails.FireAlarmReportCntlStn
    _fireAlarmReportFireStn = dwelling.DwellingProtectionDetails.FireAlarmReportFireStn
    _sprinklerSystemAllAreas = dwelling.DwellingProtectionDetails.SprinklerSystemAllAreas
    _completeLocalBurglarAlarm = dwelling.DwellingProtectionDetails.BurglarAlarm
    _burglarAlarmReportCntlStn = dwelling.DwellingProtectionDetails.BurglarAlarmReportCntlStn
    _burglarAlarmReportPoliceStn = dwelling.DwellingProtectionDetails.BurglarAlarmReportPoliceStn
    _windPool = dwelling.HOLocation.OverrideWindPool_Ext? dwelling.HOLocation.WindPoolOverridden_Ext : dwelling.HOLocation.WindPool_Ext
    _claimFreeYears =  line?.Dwelling?.Branch?.ClaimFreeYear
  }
}