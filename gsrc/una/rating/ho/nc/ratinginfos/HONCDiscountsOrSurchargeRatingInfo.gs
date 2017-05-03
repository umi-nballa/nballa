package una.rating.ho.nc.ratinginfos

uses una.rating.ho.common.HOCommonDiscountsOrSurchargeRatingInfo
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:15 PM
 * To change this template use File | Settings | File Templates.
 */
class HONCDiscountsOrSurchargeRatingInfo extends HOCommonDiscountsOrSurchargeRatingInfo {
   construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal){
      super(line, totalBasePremium)
   }
  }