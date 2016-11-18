package una.rating.ho.common

uses java.math.BigDecimal
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 10/12/16
 * Time: 9:56 AM
 */
class HOCommonDiscountsOrSurchargeRatingInfo {
  var _totalBasePremium: BigDecimal as TotalBasePremium
  var _coverageALimit: BigDecimal as CoverageALimit
  var _personalPropertyLimit: BigDecimal as PersonalPropertyLimit
  var _allPerilDeductible: BigDecimal as AllPerilDeductible
  var _ageOfHome: int as AgeOfHome
  var _maxAgeOfHome: int as MaxAgeOfHome
  var _line : HomeownersLine_HOE as Line
  var _policyType : HOPolicyType_HOE as PolicyType

  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal) {
    _line = line
    _totalBasePremium = totalBasePremium
    _coverageALimit = line.Dwelling?.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value
    _personalPropertyLimit = line.Dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value
    _allPerilDeductible = line.Dwelling?.AllPerilsOrAllOtherPerilsCovTerm?.Value
    _maxAgeOfHome = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, line.BaseState)
    _ageOfHome = determineAgeOfHome(Line.Dwelling.YearBuilt)
    _policyType = line.HOPolicyType
  }

  protected function determineAgeOfHome(year : int) : int {
    return this.Line.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate - year
  }
}