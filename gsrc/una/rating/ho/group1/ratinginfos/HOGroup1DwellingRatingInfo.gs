package una.rating.ho.group1.ratinginfos

uses java.math.BigDecimal
uses una.rating.ho.common.HOCommonDwellingRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/10/16
 * Time: 10:50 AM
 */
class HOGroup1DwellingRatingInfo extends HOCommonDwellingRatingInfo{

  var _isOrdinanceOrLawCoverage : boolean as IsOrdinanceOrLawCoverage = false
  var _businessPropertyIncreasedLimit : int as BusinessPropertyIncreasedLimit
  var _limitedFungiWetOrDryRotOrBacteriaSectionILimit : int as LimitedFungiWetOrDryRotOrBacteriaSectionILimit

  construct(dwellingCov : DwellingCov_HOE){
    super(dwellingCov)
    if(dwellingCov.Dwelling?.HODW_BusinessProperty_HOE_ExtExists){
      _businessPropertyIncreasedLimit = (dwellingCov.Dwelling?.HODW_BusinessProperty_HOE_Ext.HODW_OnPremises_Limit_HOETerm.Value.intValue() - 2500)
    }
    if(dwellingCov.Dwelling?.HODW_FungiCov_HOEExists){
      _limitedFungiWetOrDryRotOrBacteriaSectionILimit = dwellingCov.Dwelling?.HODW_FungiCov_HOE?.HODW_FungiSectionILimit_HOETerm?.Value.intValue()
    }
  }
}