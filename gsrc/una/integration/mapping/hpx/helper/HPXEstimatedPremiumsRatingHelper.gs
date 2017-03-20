package una.integration.mapping.hpx.helper

uses java.util.ArrayList
uses java.util.HashMap
uses java.util.Map
uses una.integration.mapping.hpx.common.HPXEstimatedPremium
uses gw.rating.rtm.RateBookEnhancement
uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.ho.rating.HomeownersBaseCostData_HOE
uses una.rating.ho.group1.ratinginfos.HOGroup1DwellingRatingInfo
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 1/17/17
 * Time: 1:54 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXEstimatedPremiumsRatingHelper {

  function getEstimatedPremiums(policyPeriod : PolicyPeriod) : List<HPXEstimatedPremium> {
    var estimatedPremiums = new ArrayList<HPXEstimatedPremium>()
    if (policyPeriod.HomeownersLine_HOEExists) {
      var jurisdictionState = policyPeriod.BaseState
      switch (jurisdictionState) {
        case typekey.Jurisdiction.TC_CA :
            estimatedPremiums.add(getCaliforniaLimitedEarthquakePremiumEstimate(policyPeriod))
            break
      }
    }
    return estimatedPremiums
  }

  public function getEstmatedLimitedEarthquakePremium(period : PolicyPeriod, exposure :BigDecimal, deductible : BigDecimal) : BigDecimal {
    var ratebook = RateBookEnhancement.selectRateBook(new java.util.Date(), new java.util.Date(), typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE, typekey.Jurisdiction.TC_CA, typekey.RateBookStatus.TC_STAGE, false, null, null)
    var calcRoutine = ratebook.getCalcRoutine("UNAHOEarthquakeLimitedCovRateRoutine")
    var dateRange = period.SliceDateRange
    var rateCache = new PolicyPeriodFXRateCache(period)
    var costData = new HomeownersBaseCostData_HOE(dateRange.Start, dateRange.End, period.PreferredCoverageCurrency, rateCache, HOCostType_Ext.TC_BASEPREMIUM)
    costData.init(period.HomeownersLine_HOE)
    var ratingInfo = new HOGroup1DwellingRatingInfo(period.HomeownersLine_HOE.Dwelling)
    ratingInfo.EarthquakeLimitedLimit = period.HomeownersLine_HOE.Dwelling.DwellingLimitCovTerm.Value
    ratingInfo.EarthquakeDeductible = deductible
    ratingInfo.EarthquakeConstructionType = period.HomeownersLine_HOE.Dwelling.EarthquakeConstrn_Ext
    ratingInfo.EarthquakeGrading = period.HomeownersLine_HOE.Dwelling.BCEGOrOverride?.Value
    ratingInfo.EarthquakeTerritoryValue = period.HomeownersLine_HOE.Dwelling.EarthquakeTerOverridden_Ext
    ratingInfo.YearBuilt = period.HomeownersLine_HOE.Dwelling.YearBuilt
    var hoRatingInfo = new una.rating.ho.group1.ratinginfos.HORatingInfo()
    var parameterMap = new HashMap<CalcRoutineParamName, Object>()  {
        TC_POLICYLINE -> period.HomeownersLine_HOE,
        TC_DWELLINGRATINGINFO_EXT -> ratingInfo,
        TC_STATE -> typekey.Jurisdiction.TC_CA,
        TC_RATINGINFO -> hoRatingInfo
    }
    parameterMap.put(TC_COSTDATA, costData)
    ratebook.executeCalcRoutine(calcRoutine.Code, costData, costData, parameterMap)
    return costData.StandardTermAmount
  }

  function getCaliforniaLimitedEarthquakePremiumEstimate(policyPeriod : PolicyPeriod) : HPXEstimatedPremium {
    var estimatedPremium = new HPXEstimatedPremium()
    var exposure = 0
    var deductible = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingLimitCovTerm.Value * 0.15
    var policyType = policyPeriod.HomeownersLine_HOE.Dwelling.HOLine.HOPolicyType
    if(policyType == HOPolicyType_HOE.TC_HO4 or policyType == HOPolicyType_HOE.TC_HO6){
      exposure = 5000
    } else {
      exposure = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingLimitCovTerm.Value
    }
    estimatedPremium.Premium = getEstmatedLimitedEarthquakePremium(policyPeriod, exposure, deductible)
    estimatedPremium.Code = "LimitedEarthquakePremiumEstimate"
    estimatedPremium.Description = "Estimated Premium if Limited Earthquake coverage is selected"
    estimatedPremium.Deductible = deductible
    estimatedPremium.Exposure = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingLimitCovTerm.Value
    return estimatedPremium
  }
}