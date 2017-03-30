package una.rating.ho.group3.ratinginfos

uses una.rating.ho.common.HOCommonBasePremiumRatingInfo
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 3/8/17
 * Time: 2:21 PM
 * To change this template use File | Settings | File Templates.
 */
class HOBasePremiumRatingInfo extends HOCommonBasePremiumRatingInfo {
  var _keyFactorGreaterLimitCovA: int as KeyFactorGreaterLimitCovA
  var _keyFactorGreaterLimitCovC: int as KeyFactorGreaterLimitCovC
  var _windExcluded : boolean as WindExcluded

  construct(dwelling: Dwelling_HOE) {
    super(dwelling)

    _keyFactorGreaterLimitCovA = ConfigParamsUtil.getInt(TC_KEYFACTORGREATERLIMIT, dwelling.CoverableState, dwelling.HOLine.HOPolicyType.Code + "CovA")
    _keyFactorGreaterLimitCovC = ConfigParamsUtil.getInt(TC_KEYFACTORGREATERLIMIT, dwelling.CoverableState, dwelling.HOLine.HOPolicyType.Code + "CovC")
    _windExcluded = dwelling.HOLine.HODW_WindstromHailExc_HOE_ExtExists


  }
}