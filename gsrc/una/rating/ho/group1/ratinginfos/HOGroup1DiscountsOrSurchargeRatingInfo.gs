package una.rating.ho.group1.ratinginfos

uses java.math.BigDecimal
uses gw.api.util.DateUtil
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 9/1/16
 * Rating info for discounts and surcharges of group1 states for HO policies
 */
class HOGroup1DiscountsOrSurchargeRatingInfo {
  var _totalBasePremium : BigDecimal as TotalBasePremium
  var _ageOfHome : int as AgeOfHome
  var _maxAgeOfHome : int as MaxAgeOfHome
  var _coverageALimit : BigDecimal as CoverageALimit
  var _allPerilDeductible : BigDecimal as AllPerilDeductible
  var _isPrivateFireCompanyDiscountApplicable : boolean as IsPrivateFireCompanyDiscountApplicable

  construct(line : HomeownersLine_HOE){
    _ageOfHome = determineAgeOfHome(line)
    _maxAgeOfHome = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, line.BaseState)
    _coverageALimit = line.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
    _allPerilDeductible = line.Dwelling.AllPerilsOrAllOtherPerilsCovTerm.Value
    _isPrivateFireCompanyDiscountApplicable = isPrivateFireCompanyDiscountApplicable(line)
  }

  private function determineAgeOfHome(line : HomeownersLine_HOE): int {
   var policyEffectiveDate = line.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate
    var yearForCalc : int
    if(line.BaseState != Jurisdiction.TC_NV and line.Dwelling?.HasAllRenovations){
      yearForCalc = line.Dwelling.MostRecentRenovationYear
    } else{
      yearForCalc = line.Dwelling.YearBuilt
    }
    return DateUtil.currentDate().YearOfDate - yearForCalc
  }

  private function isPrivateFireCompanyDiscountApplicable(line : HomeownersLine_HOE) : boolean{
    var territoryCode = line.Dwelling.HOLocation?.PolicyLocation?.TerritoryCodes?.single().Code
    var zipCode = line.Dwelling.HOLocation?.PolicyLocation?.PostalCode
    if((territoryCode == "050" and (zipCode == "85268" || zipCode == "85269")) ||
       (territoryCode == "047" and zipCode == "85377")){
      return true
    }
    return false
  }
}