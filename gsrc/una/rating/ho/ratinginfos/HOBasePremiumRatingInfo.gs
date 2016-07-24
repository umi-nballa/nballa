package una.rating.ho.ratinginfos

uses java.util.Date
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
  var _allOtherPerils : String as AllOtherPerils
  var _windOrHailPercentage : String as WindOrHailPercentage
  var _namedStormPercentage : String as NamedStormPercentage
  var _isTerritoryIncludedForNamedStormDeductibleFactor : boolean as IsTerritoryIncludedForNamedStormDeductibleFactor

  var _consecutiveYrsWithUniversal : int as ConsecutiveYrsWithUniversal
  var _creditScore : int as CreditScore
  var _priorLosses : int as PriorLosses

  construct(dwellingCov : DwellingCov_HOE){
    var policyPeriod = dwellingCov.Dwelling?.PolicyPeriod
    _dwellingLimit = ((dwellingCov.Dwelling.HODW_Dwelling_Cov_HOEExists)? dwellingCov.Dwelling.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value : 0) as int
    _otherStructuresLimit = ((dwellingCov.Dwelling.HODW_Other_Structures_HOEExists)? dwellingCov.Dwelling.HODW_Other_Structures_HOE?.HODW_OtherStructures_Limit_HOETerm?.Value : 0) as int
    _territoryCode = (dwellingCov.Dwelling?.HOLocation?.PolicyLocation?.TerritoryCodes.first().Code)
    _county = (dwellingCov.Dwelling?.HOLocation?.PolicyLocation?.County != null)? dwellingCov.Dwelling?.HOLocation?.PolicyLocation?.County : ""

    if(dwellingCov.Dwelling?.HODW_SectionI_Ded_HOEExists){
      _allOtherPerils = dwellingCov.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm?.DisplayValue
      if(dwellingCov.Dwelling.HODW_SectionI_Ded_HOE.HasHODW_WindHail_Ded_HOETerm){
        _windOrHailPercentage = dwellingCov.Dwelling.HODW_SectionI_Ded_HOE?.HODW_WindHail_Ded_HOETerm?.DisplayValue
      }
      if(dwellingCov.Dwelling.HODW_SectionI_Ded_HOE.HasHODW_NamedStrom_Ded_HOE_ExtTerm){
        _namedStormPercentage = dwellingCov.Dwelling.HODW_SectionI_Ded_HOE?.HODW_NamedStrom_Ded_HOE_ExtTerm?.DisplayValue
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

  private function IsTerritoryIncludedForNamedStormDeductibleFactor() : boolean{
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