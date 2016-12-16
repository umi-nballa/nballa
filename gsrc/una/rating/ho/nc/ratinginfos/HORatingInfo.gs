package una.rating.ho.nc.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:16 PM
 * To change this template use File | Settings | File Templates.
 */
class HORatingInfo extends una.rating.ho.common.HORatingInfo {
  var _windHailCredit: BigDecimal as WindHailExclusionCredit = 0.0
  var _keyFactor : BigDecimal as KeyFactor = 0.0
}