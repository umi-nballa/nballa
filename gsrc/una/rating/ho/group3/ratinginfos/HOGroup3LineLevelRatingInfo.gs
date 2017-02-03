package una.rating.ho.group3.ratinginfos

uses java.math.BigDecimal
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/24/16
 * Time: 2:28 PM
 */
class HOGroup3LineLevelRatingInfo {
  var _policyType: HOPolicyType_HOE as PolicyType
  var _increasedPersonalPropertyPremium: BigDecimal as IncreasedPersonalPropertyPremium = 0.0
  var _valuationMethod : String as ValuationMethod
  var _line : HomeownersLine_HOE as Line
  var _yearOfConstructionMaxLimit : int as YearOfConstructionMaxLimit
  var _yearOfConstructionMinLimit : int as YearOfConstructionMinLimit

  construct(lineVersion: HomeownersLine_HOE) {
    _line = lineVersion
    _policyType = lineVersion.HOPolicyType
    if (lineVersion.Dwelling.HODW_Personal_Property_HOEExists){
      _valuationMethod = lineVersion.Dwelling?.HODW_Personal_Property_HOE?.HODW_PropertyValuation_HOE_ExtTerm?.Value.DisplayName
    }
    _yearOfConstructionMaxLimit = ConfigParamsUtil.getInt(TC_YearOfConstructionMaxLimit, lineVersion.BaseState, lineVersion.HOPolicyType.Code)
    _yearOfConstructionMinLimit = ConfigParamsUtil.getInt(TC_YearOfConstructionMinLimit, lineVersion.BaseState, lineVersion.HOPolicyType.Code)
  }

  property get AgeOfHome() : int {
    return  this.Line?.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate -  YearForAgeOfHomeCalc
  }

  property get YearForAgeOfHomeCalc() : int{
    return Line.Dwelling.OverrideYearbuilt_Ext? Line.Dwelling.YearBuiltOverridden_Ext : Line.Dwelling.YearBuilt
  }
}