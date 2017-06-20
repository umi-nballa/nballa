package una.rating.ho.common

uses java.math.BigDecimal
uses una.rating.util.HOConstructionTypeMapper
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/22/16
 * Time: 2:17 PM
 */
class HOCommonDwellingRatingInfo {

  var _specifiedAdditionalAmount : String as SpecifiedAdditionalAmount
  var _personalPropertyLimit : BigDecimal as PersonalPropertyLimit
  var _personalPropertyIncreasedLimit : BigDecimal as PersonalPropertyIncreasedLimit = 0.0
  var _dwellingLimit : int as DwellingLimit
  var _otherStructuresLimit : int as OtherStructuresLimit
  var _totalBasePremium : BigDecimal as TotalBasePremium = 0.0
  var _policyType : HOPolicyType_HOE as PolicyType
  var _territoryCode : String as TerritoryCode
  var _businessPropertyIncreasedLimit : int as BusinessPropertyIncreasedLimit
  var _otherStructuresIncreasedLimit: BigDecimal as OtherStructuresIncreasedLimit
  var _isPersonalLiabilityLimitIncreased : boolean as IsPersonalLiabilityLimitIncreased
  var _bcegGrade: typekey.BCEGGrade_Ext as BCEGGrade
  var _protectionClassCode : typekey.ProtectionClassCode_Ext as ProtectionClassCode
  var _constructionType : typekey.RateTableConstructionType_Ext as ConstructionType
  var _unitOwnersCovASpecialBaseLimit: int as UnitOwnersCovASpecialBaseLimit



  construct(dwelling : Dwelling_HOE ){
    _dwellingLimit = ((dwelling.HODW_Dwelling_Cov_HOEExists)? dwelling.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value : 0) as int
    _personalPropertyLimit = (dwelling.HODW_Personal_Property_HOEExists)? dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value : 0
    _policyType = dwelling?.HOLine.HOPolicyType
    if(dwelling?.HODW_Personal_Property_HOEExists){
      _personalPropertyLimit = dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value
    }
    if(dwelling?.HODW_SpecificAddAmt_HOE_ExtExists){
      if(dwelling?.HODW_SpecificAddAmt_HOE_Ext?.HasHODW_AdditionalAmtInsurance_HOETerm){
        _specifiedAdditionalAmount = dwelling?.HODW_SpecificAddAmt_HOE_Ext?.HODW_AdditionalAmtInsurance_HOETerm?.DisplayValue
      }
    }
    if(dwelling.HODW_Personal_Property_HOEExists and PolicyType != HOPolicyType_HOE.TC_HO6){
      _personalPropertyIncreasedLimit = dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.LimitDifference
      } else if (dwelling.HODW_Personal_Property_HOEExists and PersonalPropertyLimit > 30000){
      _personalPropertyIncreasedLimit = (PersonalPropertyLimit - 30000)
      }

    if(dwelling.HODW_Other_Structures_HOEExists){
      _otherStructuresIncreasedLimit = dwelling?.HODW_Other_Structures_HOE?.HODW_OtherStructures_Limit_HOETerm?.LimitDifference
    }

    _businessPropertyIncreasedLimit = (dwelling?.HODW_BusinessProperty_HOE_Ext?.HODW_OnPremises_Limit_HOETerm?.LimitDifference?.intValue())
    if(dwelling.HOLine?.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.LimitDifference > 0)
      _isPersonalLiabilityLimitIncreased = true

    _otherStructuresLimit = ((dwelling?.HODW_Other_Structures_HOEExists)? dwelling?.HODW_Other_Structures_HOE?.HODW_OtherStructures_Limit_HOETerm?.Value : 0) as int

    _territoryCode = (dwelling.HOLocation?.OverrideTerritoryCode_Ext)? dwelling.HOLocation?.TerritoryCodeOverridden_Ext : dwelling.HOLocation?.TerritoryCodeTunaReturned_Ext

    _bcegGrade = dwelling?.BCEGOrOverride
    _protectionClassCode = dwelling?.ProtectionClassCodeOrOverride
    _constructionType = HOConstructionTypeMapper.setConstructionType(dwelling, dwelling.HOLine.BaseState)
    _unitOwnersCovASpecialBaseLimit = ConfigParamsUtil.getInt(TC_UnitOwnersCovASpecialBaseLimit, dwelling.HOLine.BaseState, dwelling.HOPolicyType)
  }
}