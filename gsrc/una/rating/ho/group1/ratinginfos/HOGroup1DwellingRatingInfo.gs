package una.rating.ho.group1.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/10/16
 * Time: 10:50 AM
 */
class HOGroup1DwellingRatingInfo extends HOCommonDwellingRatingInfo {
  var _isOrdinanceOrLawCoverage: boolean as IsOrdinanceOrLawCoverage = false
  var _businessPropertyIncreasedLimit: int as BusinessPropertyIncreasedLimit
  var _limitedFungiWetOrDryRotOrBacteriaSectionILimit: int as LimitedFungiWetOrDryRotOrBacteriaSectionILimit
  var _isLimitedFungiWetOrDryRotOrBacteriaSectionICovInBasePremium: boolean as IsLimitedFungiWetOrDryRotOrBacteriaSectionICovInBasePremium = false
  var _doesSpecialPersonalPropertyCoverageExist: boolean as SpecialPersonalPropertyCoverage = false
  var _lossAssessmentPolicyForm: String as LossAssessmentPolicyForm
  var _lossAssessmentLimit: int as LossAssessmentLimit

  construct(dwellingCov: DwellingCov_HOE) {
    super(dwellingCov)
    var baseState = dwellingCov.Dwelling?.PolicyLine.BaseState
    if (dwellingCov typeis HODW_BusinessProperty_HOE_Ext){
      var businessPropertyIncreasedBaseLimit = ConfigParamsUtil.getInt(TC_BUSINESSPROPERTYINCREASEDBASELIMIT, null, null)
      _businessPropertyIncreasedLimit = (dwellingCov.HODW_OnPremises_Limit_HOETerm.Value.intValue() - businessPropertyIncreasedBaseLimit)
    }
    if (dwellingCov typeis HODW_FungiCov_HOE){
      _limitedFungiWetOrDryRotOrBacteriaSectionILimit = dwellingCov.HODW_FungiSectionILimit_HOETerm?.Value.intValue()
      var limitedFungiWetOrDryRotOrBacteriaSectionIBaseLimit = ConfigParamsUtil.getInt(TC_LIMITEDFUNGIWETORDRYROTORBACTERIASECTIONIBASELIMIT, dwellingCov.Dwelling.CoverableState, null)
      if (baseState == typekey.Jurisdiction.TC_CA || (baseState == typekey.Jurisdiction.TC_NV and _limitedFungiWetOrDryRotOrBacteriaSectionILimit == limitedFungiWetOrDryRotOrBacteriaSectionIBaseLimit))
        _isLimitedFungiWetOrDryRotOrBacteriaSectionICovInBasePremium = true
    }
    if (dwellingCov typeis HODW_SpecialPersonalProperty_HOE_Ext and baseState == Jurisdiction.TC_CA){
      _doesSpecialPersonalPropertyCoverageExist = true
    }
    if (dwellingCov typeis HODW_LossAssessmentCov_HOE_Ext){
      _lossAssessmentPolicyForm = this.PolicyType.Code
      if (baseState == Jurisdiction.TC_CA and PolicyType == HOPolicyType_HOE.TC_HO3){
        if (dwellingCov.Dwelling?.HODW_Dwelling_Cov_HOEExists){
          if (dwellingCov.Dwelling?.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value)
            _lossAssessmentPolicyForm += "_ExecCov"
        }
      }
      _lossAssessmentLimit = dwellingCov.HOPL_LossAssCovLimit_HOETerm.Value.intValue()
    }
  }
}