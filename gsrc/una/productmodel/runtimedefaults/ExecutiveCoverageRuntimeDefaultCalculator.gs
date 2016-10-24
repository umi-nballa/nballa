package una.productmodel.runtimedefaults

uses una.productmodel.runtimedefaults.CoverageTermsRuntimeDefaultController.CovTermDefaultContext
uses java.lang.Double
uses gw.api.domain.covterm.CovTerm
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/18/16
 * Time: 12:56 PM
 * To change this template use File | Settings | File Templates.
 */
class ExecutiveCoverageRuntimeDefaultCalculator extends HOCovTermRuntimeDefaultCalculator{
  construct(context : CovTermDefaultContext){
     super(context)
  }

  override function shouldSetDefault(): boolean { //should set the executive coverage default if it was previously there and now removed or is true
    return ExecutiveCoverageDefaultEligible
  }

  override property get ApplicableCovTermPatterns(): List<String> {
    return ConfigParamsUtil.getList(TC_DefaultedExecutiveCoveragePatterns, BaseState)
  }

  override function shouldReturnDefault(covTerm: CovTerm): boolean {
    return ExecutiveCoverageDefaultEligible and super.shouldReturnDefault(covTerm)
  }

  override function getDefault(covTerm: CovTerm): Double {
    return ConfigParamsUtil.getDouble(ConfigParameterType_Ext.TC_EXECUTIVEENDORSEMENTDEFAULT, BaseState, covTerm.PatternCode)
  }

  property get ExecutiveCoverageDefaultEligible() : boolean{
    return Dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value
       and ConfigParamsUtil.getBoolean(ConfigParameterType_Ext.TC_SHOULDDEFAULTLIMITSEXECUTIVECOVERAGES, BaseState)
  }
}