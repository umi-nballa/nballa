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
  var _isPersonalPropertyIncreasedLimit : boolean as IsPersonalPropertyIncreasedLimit
  var _personalPropertyIncreasedLimit : BigDecimal as PersonalPropertyIncreasedLimit
  var _dwellingLimit : int as DwellingLimit

  construct(lineVersion: HomeownersLine_HOE){
    if(lineVersion.Dwelling?.HODW_Personal_Property_HOEExists){
      _personalPropertyLimit = lineVersion.Dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value
    }
  }

  construct(dwellingCov : DwellingCov_HOE){
    _dwellingLimit = ((dwellingCov.Dwelling.HODW_Dwelling_Cov_HOEExists)? dwellingCov.Dwelling.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value : 0) as int
    if(dwellingCov.Dwelling?.HODW_SpecificAddAmt_HOE_ExtExists){
      if(dwellingCov.Dwelling?.HODW_SpecificAddAmt_HOE_Ext?.HasHODW_AdditionalAmtInsurance_HOETerm){
        _specifiedAdditionalAmount = dwellingCov.Dwelling?.HODW_SpecificAddAmt_HOE_Ext?.HODW_AdditionalAmtInsurance_HOETerm?.DisplayValue
      }
    }
    if(dwellingCov.Dwelling?.HODW_Personal_Property_HOEExists){
      _personalPropertyLimit = dwellingCov.Dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value
      var ppLimit = _dwellingLimit * 0.5
      _isPersonalPropertyIncreasedLimit = (_personalPropertyLimit > ppLimit)
      if(_isPersonalPropertyIncreasedLimit){
        _personalPropertyIncreasedLimit = (_personalPropertyLimit - ppLimit)
      }
    }
  }
}