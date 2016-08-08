package una.rating.ho.ratinginfos

uses java.util.Date
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/20/16
 * Time: 3:21 PM
 * Rating info used in rate routines to calculate the base premium for TX HO
 */
class HOBasePremiumRatingInfo {

  var _territoryCode : String as TerritoryCode
  var _county : String as County
  var _dwellingLimit : int as DwellingLimit
  var _otherStructuresLimit : int as OtherStructuresLimit
  var _personalPropertyLimit : BigDecimal as PersonalPropertyLimit
  var _allOtherPerils : String as AllOtherPerils
  var _windOrHailPercentage : String as WindOrHailPercentage
  var _namedStormPercentage : String as NamedStormPercentage
  var _isTerritoryIncludedForNamedStormDeductibleFactor : boolean as IsTerritoryIncludedForNamedStormDeductibleFactor

  var _consecutiveYrsWithUniversal : int as ConsecutiveYrsWithUniversal
  var _creditScore : int as CreditScore
  var _priorLosses : int as PriorLosses

  var _replacementCostDwellingCoverage : String as ReplacementCostDwellingCoverage
  var _policyType : String as PolicyType

  construct(dwelling : Dwelling_HOE){
    _policyType = dwelling.HOPolicyType.Code
    var policyPeriod = dwelling?.PolicyPeriod
    _dwellingLimit = ((dwelling?.HODW_Dwelling_Cov_HOEExists)? dwelling?.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value : 0) as int
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
    _territoryCode = (dwelling?.HOLocation?.PolicyLocation?.TerritoryCodes.first().Code)
    _county = (dwelling?.HOLocation?.PolicyLocation?.County != null)? dwelling?.HOLocation?.PolicyLocation?.County : ""

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

    var originalEffectiveDate = policyPeriod?.Policy.OriginalEffectiveDate
    var editEffectiveDate = policyPeriod?.EditEffectiveDate
    _consecutiveYrsWithUniversal = getDiffYears(originalEffectiveDate, editEffectiveDate)

    //should update the credit score once the integration is done
    _creditScore = 722

    _priorLosses = 0
    if(policyPeriod?.Policy?.LossHistoryType == typekey.LossHistoryType.TC_ATT){
      _priorLosses = policyPeriod?.Policy?.NumPriorLosses
    } else if(policyPeriod?.Policy?.LossHistoryType == typekey.LossHistoryType.TC_MAN){
      _priorLosses = policyPeriod?.Policy?.PriorLosses.Count
    }
  }

  private function IsTerritoryIncludedForNamedStormDeductibleFactor() : boolean {
    var territoryCodes = new String[]{"1", "1A", "8", "9", "10", "11", "11A", "11B", "11H", "14A"}
    return territoryCodes.contains(_territoryCode)
  }

  private function getDiffYears(originalEffectiveDate: Date, editEffectiveDate : Date) : int{
    if(originalEffectiveDate == null || editEffectiveDate == null){
      return 0
    }
    var time = (editEffectiveDate.Time - originalEffectiveDate.Time)
    if(time <= 0)
      return 0
    else{
      var diffInDays =  (time/(1000*60*60*24))
      return (diffInDays/365) as int
    }
  }
}