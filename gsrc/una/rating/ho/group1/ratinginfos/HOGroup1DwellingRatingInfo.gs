package una.rating.ho.group1.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/10/16
 * Time: 10:50 AM
 */
class HOGroup1DwellingRatingInfo {

  var _specifiedAdditionalAmount : String as SpecifiedAdditionalAmount
  var _totalBasePremium : BigDecimal as TotalBasePremium

  construct(dwellingCov : DwellingCov_HOE){

    if(dwellingCov.Dwelling?.HODW_SpecificAddAmt_HOE_ExtExists){
      if(dwellingCov.Dwelling?.HODW_SpecificAddAmt_HOE_Ext?.HasHODW_AdditionalAmtInsurance_HOETerm){
        _specifiedAdditionalAmount = dwellingCov.Dwelling?.HODW_SpecificAddAmt_HOE_Ext?.HODW_AdditionalAmtInsurance_HOETerm?.DisplayValue
      }
    }
  }
}