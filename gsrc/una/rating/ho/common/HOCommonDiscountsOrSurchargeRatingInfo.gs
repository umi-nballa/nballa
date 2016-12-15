package una.rating.ho.common

uses java.math.BigDecimal
uses una.config.ConfigParamsUtil
uses gw.api.util.DateUtil

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
  var _maxAgeOfHome: int as MaxAgeOfHome
  var _line : HomeownersLine_HOE as Line
  var _policyType : HOPolicyType_HOE as PolicyType
  var _typeOfPolicyForMultiLine : TypeofPolicy_Ext as TypeOfPolicyForMultiLine
  var _territoryCode : int as TerritoryCode

  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal) {
    _line = line
    _totalBasePremium = totalBasePremium
    _coverageALimit = line.Dwelling?.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value
    _personalPropertyLimit = line.Dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value
    _allPerilDeductible = line.Dwelling?.AllPerilsOrAllOtherPerilsCovTerm?.Value
    _maxAgeOfHome = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, line.BaseState)
    _policyType = line.HOPolicyType
    _territoryCode = line.Dwelling?.HOLocation?.TerritoryCodeTunaReturned_Ext?.toInt()
    if(line.Dwelling?.HOLocation?.OverrideTerritoryCode_Ext)
      _territoryCode = line.Dwelling?.HOLocation?.TerritoryCodeOverridden_Ext.toInt()
  }

  property get AgeOfHome() : int {
    return  this.Line.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate -  YearForAgeOfHomeCalc
  }

   property get YearForAgeOfHomeCalc() : int{
    return Line.Dwelling.OverrideYearbuilt_Ext? Line.Dwelling.YearBuiltOverridden_Ext : Line.Dwelling.YearBuilt
  }


}