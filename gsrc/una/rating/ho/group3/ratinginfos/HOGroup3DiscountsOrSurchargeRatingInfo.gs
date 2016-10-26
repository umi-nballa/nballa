package una.rating.ho.group3.ratinginfos

uses una.rating.ho.common.HOCommonDiscountsOrSurchargeRatingInfo
uses java.math.BigDecimal
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Rating info for the discounts and surcharges for the group3 states
 */
class HOGroup3DiscountsOrSurchargeRatingInfo extends HOCommonDiscountsOrSurchargeRatingInfo {

  var _yearOfConstructionMaxLimit : int as YearOfConstructionMaxLimit
  var _yearOfConstructionMinLimit : int as YearOfConstructionMinLimit
  var _yearOfConstruction : int as YearOfConstruction

  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal) {
    super(line, totalBasePremium)
    MaxAgeOfHome = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, line.BaseState, line.HOPolicyType.Code)
    _yearOfConstructionMaxLimit = ConfigParamsUtil.getInt(TC_YearOfConstructionMaxLimit, line.BaseState, line.HOPolicyType.Code)
    _yearOfConstructionMinLimit = ConfigParamsUtil.getInt(TC_YearOfConstructionMinLimit, line.BaseState, line.HOPolicyType.Code)
    _yearOfConstruction = line.Dwelling.YearBuilt
  }
}