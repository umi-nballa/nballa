package una.rating.ho.group2.ratinginfos

uses una.rating.ho.common.HODiscountsOrSurchargeRatingInfo
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/26/16
 * Rating info for the discounts and surcharges for the group2 states
 */
class HOGroup2DiscountsOrSurchargeRatingInfo extends HODiscountsOrSurchargeRatingInfo {
  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal) {
    super(line, totalBasePremium)
  }
}