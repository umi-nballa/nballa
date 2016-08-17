package una.rating.ho.ratinginfos

uses java.math.BigDecimal
uses una.rating.ho.common.HOCommonBasePremiumRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/20/16
 * Time: 3:21 PM
 * Rating info used in rate routines to calculate the base premium for TX HO
 */
class HOBasePremiumRatingInfo extends HOCommonBasePremiumRatingInfo{

  var _county : String as County
  var _otherStructuresLimit : int as OtherStructuresLimit
  var _personalPropertyLimit : BigDecimal as PersonalPropertyLimit
  var _allOtherPerils : String as AllOtherPerils
  var _windOrHailPercentage : String as WindOrHailPercentage
  var _namedStormPercentage : String as NamedStormPercentage
  var _isTerritoryIncludedForNamedStormDeductibleFactor : boolean as IsTerritoryIncludedForNamedStormDeductibleFactor

  var _replacementCostDwellingCoverage : String as ReplacementCostDwellingCoverage
  var _windOrHailExclusion : boolean as WindOrHailExclusion

  construct(dwelling : Dwelling_HOE){
    super(dwelling)
    var policyPeriod = dwelling?.PolicyPeriod
    _otherStructuresLimit = ((dwelling?.HODW_Other_Structures_HOEExists)? dwelling?.HODW_Other_Structures_HOE?.HODW_OtherStructures_Limit_HOETerm?.Value : 0) as int
    if(dwelling?.HODW_Personal_Property_HOEExists){
      _personalPropertyLimit = dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value
    }
    if(dwelling.HODW_Dwelling_Cov_HOEExists){
      if(dwelling.HODW_Dwelling_Cov_HOE?.HODW_DwellingValuation_HOETerm.DisplayValue == "Replacement Cost"){
        _replacementCostDwellingCoverage = "RCLS"
      } else if(dwelling.HODW_Dwelling_Cov_HOE?.HODW_DwellingValuation_HOETerm.DisplayValue == "Replacement Cost with Roof Surfacing"){
        _replacementCostDwellingCoverage = "RCSR"
      }
    }
    _county = (dwelling?.HOLocation?.PolicyLocation?.County != null)? dwelling?.HOLocation?.PolicyLocation?.County : ""
    _windOrHailExclusion = dwelling.HOLine?.HODW_WindHurricaneHailExc_HOE_ExtExists

    if(dwelling?.HODW_SectionI_Ded_HOEExists){
      _allOtherPerils = dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm?.DisplayValue
      if(dwelling?.HODW_SectionI_Ded_HOE.HasHODW_WindHail_Ded_HOETerm){
        _windOrHailPercentage = dwelling.HODW_SectionI_Ded_HOE?.HODW_WindHail_Ded_HOETerm?.DisplayValue
      }
      if(dwelling?.HODW_SectionI_Ded_HOE.HasHODW_NamedStrom_Ded_HOE_ExtTerm){
        _namedStormPercentage = dwelling.HODW_SectionI_Ded_HOE?.HODW_NamedStrom_Ded_HOE_ExtTerm?.DisplayValue
        _isTerritoryIncludedForNamedStormDeductibleFactor = IsTerritoryIncludedForNamedStormDeductibleFactor()
      }
    }
  }

  private function IsTerritoryIncludedForNamedStormDeductibleFactor() : boolean {
    var territoryCodes = new String[]{"1", "1A", "8", "9", "10", "11", "11A", "11B", "11H", "14A"}
    return territoryCodes.contains(this.TerritoryCode)
  }
}