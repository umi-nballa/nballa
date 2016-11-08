package una.rating.ho.group3.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * rating info for the dwelling level coverages for group 3 states
 */
class HOGroup3DwellingRatingInfo extends HOCommonDwellingRatingInfo{

  var _lossAssessmentLimit : int as LossAssessmentLimit
  var _territoryCodeForLossAssessmentCov : int as TerritoryCodeForLossAssessmentCov
  var _territoryCodeForSinkholeLossCov : int as TerritoryCodeForSinkholeLossCov
  var _county : String as County
  var _covALimit : BigDecimal as CovALimit
  var _ordinanceOrLawLimit : String as ordinanceOrLawLimit
  var _ppIncreasedLimit : BigDecimal as PPIncreasedLimit
  var _limitedScreenCovLimit : int as LimitedScreenCovLimit
  var _hurricanePercentage : String as HurricanePercentage
  var _limitedFungiWetOrDryRotOrBacteriaSectionILimit : int as LimitedFungiWetOrDryRotOrBacteriaSectionILimit

  construct(dwellingCov : DwellingCov_HOE){
    super(dwellingCov)
    _covALimit = ((dwellingCov.Dwelling.HODW_Dwelling_Cov_HOEExists)? dwellingCov.Dwelling.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value : 0)
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

    if(dwellingCov typeis HODW_LimitedScreenCov_HOE_Ext){
      _limitedScreenCovLimit = dwellingCov.HODW_LimitedScreenLimit_HOETerm?.Value.intValue()
      var dwelling = dwellingCov.Dwelling
      _hurricanePercentage = dwelling.HODW_SectionI_Ded_HOE?.HasHODW_Hurricane_Ded_HOETerm? dwelling.HODW_SectionI_Ded_HOE?.HODW_Hurricane_Ded_HOETerm.DisplayValue : ""
    }

    if(dwellingCov typeis HODW_FungiCov_HOE){
      _limitedFungiWetOrDryRotOrBacteriaSectionILimit = dwellingCov.HODW_FungiSectionILimit_HOETerm?.Value.intValue()
    }
  }
}