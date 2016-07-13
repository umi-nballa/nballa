package gw.web.productmodel

uses gw.api.web.job.JobWizardHelper
uses gw.api.util.LocationUtil
uses java.lang.Throwable
uses una.config.ConfigParamsUtil
uses gw.api.domain.covterm.DirectCovTerm
//uses una.utils.MathUtil

/**
 * Created with IntelliJ IDEA.
 * User: adash
 * Date: 5/12/16
 * Time: 5:28 AM
 * To change this template use File | Settings | File Templates.
 */
class LineWizardStepHelper_Ext {

  static function coveragesOnEnterHO(_coverables : Coverable[], wizard : JobWizardHelper) {

    try {
      ProductModelSyncIssuesHandler.syncCoverages(_coverables, wizard)
      ProductModelSyncIssuesHandler.syncConditions(_coverables, wizard)
      ProductModelSyncIssuesHandler.syncExclusions(_coverables, wizard)
    } catch(err : Throwable) {
      LocationUtil.addRequestScopedErrorMessage("Error entering the Coverages screen: ${err}")
    }

    setDefaults(_coverables)
  }


  public static function setSpecialLimitsPersonalPropertyDefaults(dwelling : Dwelling_HOE){
    var baseState = dwelling.PolicyLine.BaseState
    var derivedSpecialLimitsCovTermPatterns = ConfigParamsUtil.getList(ConfigParameterType_Ext.TC_DERIVEDSPECIALLIMITSCOVTERMPATTERNS, baseState)
    var covTerms = dwelling.HODW_SpecialLimitsPP_HOE_Ext.CovTerms?.whereTypeIs(DirectCovTerm)?.where( \ covTerm -> derivedSpecialLimitsCovTermPatterns?.contains(covTerm.PatternCode))

    covTerms?.each( \ covTerm -> {
      var shouldDefaultLimit = dwelling.HODW_SpecialLimitsPP_HOE_Ext.hasCovTerm(covTerm.Pattern) and covTerm.Value == null
      var defaultSpecialLimitsAmount = ConfigParamsUtil.getDouble(TC_SPECIALLIMITSDIRECTMINIMUMDEFAULT, baseState, covTerm.PatternCode)

      if(shouldDefaultLimit){
          covTerm.Value = defaultSpecialLimitsAmount
      }
    })
  }

  private static function setDefaults(coverables : Coverable[]){
    var dwelling = coverables?.toList().whereTypeIs(Dwelling_HOE).atMostOne()
    var hoLine = coverables?.toList().whereTypeIs(HomeownersLine_HOE).atMostOne()

    if(dwelling != null){
      setFireDwellingValuationMethodDefault(dwelling)
      setAnimalLiabilityLimitDefault(dwelling)
      una.pageprocess.CovTermPOCHOEInputSet.onCovTermOptionChange(dwelling.HODW_BusinessProperty_HOE_Ext.HODW_OnPremises_Limit_HOETerm, dwelling)
      setSpecialLimitsPersonalPropertyDefaults(dwelling)
    }
  }

  private static function setFireDwellingValuationMethodDefault(dwelling : Dwelling_HOE){
    var actualValueDefaultPolicyTypes : List<HOPolicyType_HOE> = {TC_TDP1_Ext, TC_TDP2_Ext}
    var shouldDefaultValuationMethod = dwelling.DPDW_Dwelling_Cov_HOEExists
        and dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOETerm.Value == null

    if(shouldDefaultValuationMethod){
      if(actualValueDefaultPolicyTypes.contains(dwelling.HOPolicyType)){
        dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOETerm.Value = TC_HOACTUAL_HOE
      }else{
        dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOETerm.Value = TC_HOREPLACEMENT_HOE
      }
    }
  }

  private static function setAnimalLiabilityLimitDefault(dwelling : Dwelling_HOE){
    var limitCoverageTerm = dwelling.HODW_AnimalLiability_HOE_Ext.HODW_AnimalLiability_Limit_HOETerm
    var shouldDefaultLimit = dwelling.HODW_AnimalLiability_HOE_ExtExists
        and limitCoverageTerm.Value == null

    if(shouldDefaultLimit){
      limitCoverageTerm.setOptionValue(limitCoverageTerm.AvailableOptions.orderBy( \ elt -> elt.Value).first())
    }
  }
}