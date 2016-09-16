package una.rating.ho.group1.ratinginfos

uses java.math.BigDecimal
uses java.lang.Math
uses gw.api.util.DateUtil
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 9/1/16
 * Time: 1:10 PM
 * To change this template use File | Settings | File Templates.
 */
class HOGroup1DiscountsOrSurchargeRatingInfo {
  var _totalBasePremium : BigDecimal as TotalBasePremium
  var _ageOfHome : int as AgeOfHome
  var _maxAgeOfHome : int as MaxAgeOfHome
  var _coverageALimit : BigDecimal as CoverageALimit
  var _allPerilDeductible : BigDecimal as AllPerilDeductible

  construct(lineCoverage : HomeownersLine_HOE){
    _ageOfHome = determineAgeOfHome(lineCoverage)
    _maxAgeOfHome = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, lineCoverage.BaseState)
    _coverageALimit = lineCoverage.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
    _allPerilDeductible = lineCoverage.Dwelling.AllPerilsOrAllOtherPerilsCovTerm.Value
  }

  private function determineAgeOfHome(lineCoverage : HomeownersLine_HOE): int {
   var policyEffectiveDate = lineCoverage.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate
    var yearForCalc : int
    if(lineCoverage.BaseState != Jurisdiction.TC_NV and lineCoverage.Dwelling?.HasAllRenovations){
      yearForCalc = lineCoverage.Dwelling.MostRecentRenovationYear
    } else{
      yearForCalc = lineCoverage.Dwelling.YearBuilt
    }

    return DateUtil.currentDate().YearOfDate - yearForCalc

  }


}