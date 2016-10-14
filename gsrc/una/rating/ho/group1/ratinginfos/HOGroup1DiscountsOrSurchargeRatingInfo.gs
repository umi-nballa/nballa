package una.rating.ho.group1.ratinginfos

uses gw.api.util.DateUtil
uses una.config.ConfigParamsUtil
uses una.rating.ho.common.HODiscountsOrSurchargeRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 9/1/16
 * Rating info for discounts and surcharges of group1 states for HO policies
 */
class HOGroup1DiscountsOrSurchargeRatingInfo extends HODiscountsOrSurchargeRatingInfo {
  var _isPrivateFireCompanyDiscountApplicable: boolean as IsPrivateFireCompanyDiscountApplicable
  var _ageOfHome: int as AgeOfHome
  var _maxAgeOfHome: int as MaxAgeOfHome
  construct(line: HomeownersLine_HOE) {
    super(line)
    _ageOfHome = determineAgeOfHome(line)
    _maxAgeOfHome = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, line.BaseState)
    this.CoverageALimit = line.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
    this.AllPerilDeductible = line.Dwelling.AllPerilsOrAllOtherPerilsCovTerm.Value
    _isPrivateFireCompanyDiscountApplicable = isPrivateFireCompanyDiscountApplicable(line)
  }

  private function determineAgeOfHome(line: HomeownersLine_HOE): int {
    var policyEffectiveDate = line.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate
    var yearForCalc: int
    if (line.BaseState != Jurisdiction.TC_NV and line.Dwelling?.HasAllRenovations) {
      yearForCalc = line.Dwelling.MostRecentRenovationYear
    } else {
      yearForCalc = line.Dwelling.YearBuilt
    }
    return DateUtil.currentDate().YearOfDate - yearForCalc
  }

  private function isPrivateFireCompanyDiscountApplicable(line: HomeownersLine_HOE): boolean {
    var territoryCode = line.Dwelling.HOLocation?.PolicyLocation?.TerritoryCodes?.single().Code
    var zipCode = line.Dwelling.HOLocation?.PolicyLocation?.PostalCode
    if ((territoryCode == "050" and (zipCode == "85268" || zipCode == "85269")) ||
        (territoryCode == "047" and zipCode == "85377")){
      return true
    }
    return false
  }
}