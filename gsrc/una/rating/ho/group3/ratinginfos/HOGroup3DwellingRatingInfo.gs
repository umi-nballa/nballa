package una.rating.ho.group3.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * rating info for the dwelling level coverages for group 3 states
 */
class HOGroup3DwellingRatingInfo extends HOCommonDwellingRatingInfo{

  var _businessPropertyIncreasedLimit : int as BusinessPropertyIncreasedLimit
  var _lossAssessmentLimit : int as LossAssessmentLimit
  var _territoryCodeForLossAssessmentCov : int as TerritoryCodeForLossAssessmentCov
  var _territoryCodeForSinkholeLossCov : int as TerritoryCodeForSinkholeLossCov
  var _county : String as County
  var _covALimit : BigDecimal as CovALimit
  var _ordinanceOrLawLimit : String as ordinanceOrLawLimit
  var _ppIncreasedLimit : BigDecimal as PPIncreasedLimit
  var _keyFactor : BigDecimal as KeyFactor

  construct(dwellingCov : DwellingCov_HOE){
    super(dwellingCov)
    _covALimit = ((dwellingCov.Dwelling.HODW_Dwelling_Cov_HOEExists)? dwellingCov.Dwelling.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value : 0)
    if(dwellingCov typeis HODW_BusinessProperty_HOE_Ext){
      _businessPropertyIncreasedLimit = (dwellingCov.HODW_OnPremises_Limit_HOETerm.Value.intValue())
    }

    if(dwellingCov typeis HODW_LossAssessmentCov_HOE_Ext){
      _lossAssessmentLimit = dwellingCov.HOPL_LossAssCovLimit_HOETerm.Value.intValue()
      _territoryCodeForLossAssessmentCov = dwellingCov.Dwelling.HOLocation.PolicyLocation?.TerritoryCodes.single().Code.toInt()
    }

    if(dwellingCov typeis HODW_SinkholeLoss_HOE_Ext){
      _county = (dwellingCov.Dwelling?.HOLocation?.PolicyLocation?.County != null)? dwellingCov.Dwelling?.HOLocation?.PolicyLocation?.County : ""
      _territoryCodeForSinkholeLossCov = dwellingCov.Dwelling.HOLocation.PolicyLocation?.TerritoryCodes.single().Code.toInt()
    }

    if(dwellingCov typeis HODW_OrdinanceCov_HOE){
      _ordinanceOrLawLimit = dwellingCov.HODW_OrdinanceLimit_HOETerm.DisplayValue
    }
  }
}