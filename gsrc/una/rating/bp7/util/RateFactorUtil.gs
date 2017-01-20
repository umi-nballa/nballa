package una.rating.bp7.util

uses java.math.BigDecimal
uses gw.api.util.DateUtil
uses gw.rating.rtm.query.RateBookQueryFilter
uses gw.rating.rtm.query.RatingQueryFacade
uses java.lang.Comparable

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 1/18/17
 */
class RateFactorUtil {

  static var _accountModificationFactor : BigDecimal as AccountModificationFactor = 1.0
  static var _buildingAgeFactor : BigDecimal = 1.0
  static var _experienceRatingFactor : BigDecimal = 1.0
  static var _minimumFactor : BigDecimal = 0.75
  static var _territoryModificationFactor : BigDecimal = 1.0

  static var _sprinklerFactor : BigDecimal = 0.65

  static var _buildingDeductibleFactor : BigDecimal = 1.0
  static var _contentDeductibleFactor : BigDecimal = 1.0

  static var _bcegFactor : BigDecimal = 1.0
  static var _windExclusionFactor : BigDecimal = 1.0

  static function setAccountModificationFactor(line : BP7Line){
    var modifiers = line.Modifiers
    var scheduledRate = modifiers.where( \ m -> m.ScheduleRate)
    var rateFactors = scheduledRate*.RateFactors
    for(factor in rateFactors){
      _accountModificationFactor += factor.AssessmentWithinLimits
    }
  }

  static function setBuildingAgeFactor(line : BP7Line, minimumRatingLevel : RateBookStatus, building : BP7Building){
    var currentYear = DateUtil.getYear(DateUtil.currentDate())
    var buildingYearBuilt = building.YearBuilt_Ext
    var buildingAge = currentYear - buildingYearBuilt

    if(buildingAge < 11){
      _buildingAgeFactor = getRateTableFactor(line, minimumRatingLevel, "bp7_building_age", {buildingAge})
    } else{
      _buildingAgeFactor = getRateTableFactor(line, minimumRatingLevel, "bp7_building_age_greater_than", {11})
    }
  }

  static function setExperienceRatingFactor(line : BP7Line, minimumRatingLevel : RateBookStatus){
    var _claimFreeYear = line.AssociatedPolicyPeriod?.ClaimFreeYear
    if(_claimFreeYear == NoClaimFreeYears_Ext.TC_0 || _claimFreeYear == NoClaimFreeYears_Ext.TC_1 || _claimFreeYear == NoClaimFreeYears_Ext.TC_2){
      _experienceRatingFactor = getRateTableFactor(line, minimumRatingLevel, "bp7_experience_rating", {_claimFreeYear.Value as int})
    } else{
      _experienceRatingFactor = getRateTableFactor(line, minimumRatingLevel, "bp7_experience_rating_greater_than", {3})
    }
  }

  static function setTerritoryModificationFactor(line : BP7Line, minimumRatingLevel : RateBookStatus, building : BP7Building){
    var territoryCode = building?.Location?.OverrideTerritoryCode_Ext? building?.Location?.TerritoryCodeOverridden_Ext : building?.Location?.TerritoryCodeTunaReturned_Ext
    _territoryModificationFactor = getRateTableFactor(line, minimumRatingLevel, "bp7_territory_definitions_multipier_table", {territoryCode})
    if(_territoryModificationFactor == null)
      _territoryModificationFactor = 1.0
  }

  static function setNetAdjustmentFactor(line : BP7Line, minimumRatingLevel : RateBookStatus, building : BP7Building) : BigDecimal{
    setAccountModificationFactor(line)
    setBuildingAgeFactor(line, minimumRatingLevel,building)
    setExperienceRatingFactor(line, minimumRatingLevel)
    setTerritoryModificationFactor(line, minimumRatingLevel, building)
    var totalFactor = _accountModificationFactor * _experienceRatingFactor * _buildingAgeFactor
    if(totalFactor < _minimumFactor)
      totalFactor = _minimumFactor
    return (totalFactor * _territoryModificationFactor)
  }

  static function setBCEGFactor(line : BP7Line, minimumRatingLevel : RateBookStatus, building : BP7Building){
    if(line.BP7WindstormOrHailExcl_EXTExists){
      _bcegFactor = 1.0
    } else{
      var territoryCode = building?.Location?.OverrideTerritoryCode_Ext? building?.Location?.TerritoryCodeOverridden_Ext : building?.Location?.TerritoryCodeTunaReturned_Ext
      var bcegGrade = building.OverrideBCEG_Ext? building.BCEGOverridden_Ext : building?.BldgCodeEffGrade.Code
      if(bcegGrade == "Ungraded")
        bcegGrade = "99"
      else if(bcegGrade == "NotEligible")
        bcegGrade = "98"
      _bcegFactor = getRateTableFactor(line, minimumRatingLevel, "bp7_bceg", {territoryCode, bcegGrade})
      if(_bcegFactor == null)
        _bcegFactor = 1.0
    }
  }

  static function setWindExclusionFactor(line : BP7Line, minimumRatingLevel : RateBookStatus, building : BP7Building){
    if(line.BP7WindstormOrHailExcl_EXTExists){
      var constructionType = building?.ConstructionType
      var territoryCode = building?.Location?.OverrideTerritoryCode_Ext? building?.Location?.TerritoryCodeOverridden_Ext : building?.Location?.TerritoryCodeTunaReturned_Ext
      _windExclusionFactor = getRateTableFactor(line, minimumRatingLevel, "bp7_windstorm_and_hail_exclusion", {constructionType, territoryCode})
      if(_windExclusionFactor == null)
        _windExclusionFactor = 1.0
    } else{
      _windExclusionFactor = 1.0
    }
  }

  static function setBuildingDeductibleFactor(line : BP7Line, minimumRatingLevel : RateBookStatus, building : BP7Building){
    var windOrHailPercentage = line.BP7LocationPropertyDeductibles_EXT?.BP7WindHailDeductible_EXTTerm?.DisplayValue
    if(windOrHailPercentage != "Not Applicable"){
      var optionalDeductible = line.BP7LocationPropertyDeductibles_EXT?.BP7OptionalDeductible_EXTTerm?.Value
      var buildingLimit = building?.BP7Structure?.BP7BuildingLimitTerm?.Value
      _buildingDeductibleFactor = getRateTableFactor(line, minimumRatingLevel, "bp7_windstorm_hail_deductible", {buildingLimit, windOrHailPercentage, optionalDeductible})
      if(_buildingDeductibleFactor == null)
        _buildingDeductibleFactor = 1.0
    }
  }

  static function setContentDeductibleFactor(line : BP7Line, minimumRatingLevel : RateBookStatus, classification : BP7Classification){
    var windOrHailPercentage = line.BP7LocationPropertyDeductibles_EXT?.BP7WindHailDeductible_EXTTerm?.DisplayValue
    if(windOrHailPercentage != "Not Applicable"){
      var optionalDeductible = line.BP7LocationPropertyDeductibles_EXT?.BP7OptionalDeductible_EXTTerm?.Value
      var bppLimit = classification?.BP7ClassificationBusinessPersonalProperty?.BP7BusnPrsnlPropLimitTerm?.Value
      _contentDeductibleFactor = getRateTableFactor(line, minimumRatingLevel, "bp7_windstorm_hail_deductible", {bppLimit, windOrHailPercentage, optionalDeductible})
      if(_contentDeductibleFactor == null)
        _contentDeductibleFactor = 1.0
    }
  }

  static function setPropertyBuildingAdjustmentFactor(line : BP7Line, minimumRatingLevel : RateBookStatus, building : BP7Building) : BigDecimal{
    setBuildingDeductibleFactor(line, minimumRatingLevel, building)
    setBCEGFactor(line, minimumRatingLevel, building)
    setWindExclusionFactor(line, minimumRatingLevel, building)
    return _buildingDeductibleFactor * _windExclusionFactor * _sprinklerFactor * _bcegFactor
  }

  static function setContentBuildingAdjustmentFactor(line : BP7Line, minimumRatingLevel : RateBookStatus, classification : BP7Classification) : BigDecimal{
    setContentDeductibleFactor(line, minimumRatingLevel, classification)
    setBCEGFactor(line, minimumRatingLevel, classification?.building)
    setWindExclusionFactor(line, minimumRatingLevel, classification?.building)
    return _buildingDeductibleFactor * _windExclusionFactor * _sprinklerFactor * _bcegFactor
  }

  private static function getRateTableFactor(line : BP7Line, minimumRatingLevel : RateBookStatus, rateTableName : String, params : Comparable[]) : BigDecimal{
    var filter = new RateBookQueryFilter(line.Branch.PeriodStart, line.Branch.PeriodEnd, line.PatternCode)
        {: Jurisdiction = line.BaseState,
            : MinimumRatingLevel = minimumRatingLevel}
    var factor = new RatingQueryFacade().getFactor(filter, rateTableName, params).Factor
    return factor as BigDecimal
  }
}