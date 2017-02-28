package una.rating.ho.hawaii.ratinginfos

uses java.math.BigDecimal


/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:16 PM
 * To change this template use File | Settings | File Templates.
 */
class HORatingInfo extends una.rating.ho.common.HORatingInfo {
  var _affinityDiscount : BigDecimal as AffinityDiscount = 0.0
  var _lossHistoryRatingPlan : BigDecimal as LossHistoryRatingPlan = 0.0
  var _vacancySurcharge : BigDecimal as VacancySurcharge = 0.0
  var _tenantSeasonalSurcharge : BigDecimal as TenantSeasonalSurcharge = 0.0


}