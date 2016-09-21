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
  var _isLimitedFungiWetOrDryRotOrBacteriaSectionICovInBasePremium : boolean as IsLimitedFungiWetOrDryRotOrBacteriaSectionICovInBasePremium = false
  var _doesSpecialPersonalPropertyCoverageExist : boolean as SpecialPersonalPropertyCoverage = false
  var _lossAssessmentPolicyForm : String as LossAssessmentPolicyForm
  var _lossAssessmentLimit : int as LossAssessmentLimit

  construct(dwellingCov : DwellingCov_HOE){
    super(dwellingCov)
    var baseState = dwellingCov.Dwelling?.PolicyLine.BaseState
    if(dwellingCov.Dwelling?.HODW_BusinessProperty_HOE_ExtExists){
      _businessPropertyIncreasedLimit = (dwellingCov.Dwelling?.HODW_BusinessProperty_HOE_Ext.HODW_OnPremises_Limit_HOETerm.Value.intValue() - 2500)
    }
    if(dwellingCov.Dwelling?.HODW_FungiCov_HOEExists){
      _limitedFungiWetOrDryRotOrBacteriaSectionILimit = dwellingCov.Dwelling?.HODW_FungiCov_HOE?.HODW_FungiSectionILimit_HOETerm?.Value.intValue()
      if(baseState == typekey.Jurisdiction.TC_CA || (baseState == typekey.Jurisdiction.TC_NV and _limitedFungiWetOrDryRotOrBacteriaSectionILimit == 10000))
        _isLimitedFungiWetOrDryRotOrBacteriaSectionICovInBasePremium = true
    }
    if(dwellingCov.Dwelling?.HODW_SpecialPersonalProperty_HOE_ExtExists and baseState == Jurisdiction.TC_CA){
      _doesSpecialPersonalPropertyCoverageExist = true
    }
    if(dwellingCov.Dwelling?.HODW_LossAssessmentCov_HOE_ExtExists){
      _lossAssessmentPolicyForm = this.PolicyType.Code
      if(baseState == Jurisdiction.TC_CA and PolicyType == HOPolicyType_HOE.TC_HO3){
        if(dwellingCov.Dwelling?.HODW_Dwelling_Cov_HOEExists){
          if(dwellingCov.Dwelling?.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value)
            _lossAssessmentPolicyForm += "_ExecCov"
        }
      }
      _lossAssessmentLimit = dwellingCov.Dwelling?.HODW_LossAssessmentCov_HOE_Ext.HOPL_LossAssCovLimit_HOETerm.Value.intValue()
    }
  }
}