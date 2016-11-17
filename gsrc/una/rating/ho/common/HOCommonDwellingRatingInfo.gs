package una.rating.ho.common

uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/22/16
 * Time: 2:17 PM
 */
class HOCommonDwellingRatingInfo {

  var _specifiedAdditionalAmount : String as SpecifiedAdditionalAmount
  var _personalPropertyLimit : BigDecimal as PersonalPropertyLimit
  var _personalPropertyIncreasedLimit : BigDecimal as PersonalPropertyIncreasedLimit
  var _dwellingLimit : int as DwellingLimit
  var _otherStructuresLimit : int as OtherStructuresLimit
  var _totalBasePremium : BigDecimal as TotalBasePremium
  var _policyType : HOPolicyType_HOE as PolicyType
  var _territoryCode : String as TerritoryCode
  var _businessPropertyIncreasedLimit : int as BusinessPropertyIncreasedLimit
  var _otherStructuresIncreasedLimit: BigDecimal as OtherStructuresIncreasedLimit
  var _isPersonalLiabilityLimitIncreased : boolean as IsPersonalLiabilityLimitIncreased

  construct(lineVersion: HomeownersLine_HOE){
    if(lineVersion.Dwelling?.HODW_Personal_Property_HOEExists){
      _personalPropertyLimit = lineVersion.Dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value
    }
  }

  construct(dwellingCov : DwellingCov_HOE){
    _dwellingLimit = ((dwellingCov.Dwelling.HODW_Dwelling_Cov_HOEExists)? dwellingCov.Dwelling.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value : 0) as int
    _policyType = dwellingCov.Dwelling?.HOLine.HOPolicyType
    if(dwellingCov.Dwelling?.HODW_SpecificAddAmt_HOE_ExtExists){
      if(dwellingCov.Dwelling?.HODW_SpecificAddAmt_HOE_Ext?.HasHODW_AdditionalAmtInsurance_HOETerm){
        _specifiedAdditionalAmount = dwellingCov.Dwelling?.HODW_SpecificAddAmt_HOE_Ext?.HODW_AdditionalAmtInsurance_HOETerm?.DisplayValue
      }
    }
    if(dwellingCov.Dwelling.HODW_Personal_Property_HOEExists){
      _personalPropertyIncreasedLimit = dwellingCov.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.LimitDifference
    }
    if(dwellingCov.Dwelling.HODW_Other_Structures_HOEExists){
      _otherStructuresIncreasedLimit = dwellingCov.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm?.LimitDifference
    }

    if (dwellingCov typeis HODW_BusinessProperty_HOE_Ext){
      _businessPropertyIncreasedLimit = (dwellingCov.HODW_OnPremises_Limit_HOETerm.LimitDifference.intValue())
    }
    if(dwellingCov.Dwelling.HOLine?.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.LimitDifference > 0)
      _isPersonalLiabilityLimitIncreased = true

    _otherStructuresLimit = ((dwellingCov.Dwelling.HODW_Other_Structures_HOEExists)? dwellingCov.Dwelling.HODW_Other_Structures_HOE?.HODW_OtherStructures_Limit_HOETerm?.Value : 0) as int
    _territoryCode = dwellingCov.Dwelling.HOLocation.PolicyLocation?.TerritoryCodes.single().Code
  }
}