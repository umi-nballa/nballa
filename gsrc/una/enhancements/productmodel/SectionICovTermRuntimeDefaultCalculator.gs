package una.enhancements.productmodel

uses gw.api.domain.covterm.CovTerm
uses java.lang.Double
uses una.config.ConfigParamsUtil
uses una.productmodel.CoveragesUtil
uses una.enhancements.productmodel.CoverageTermsRuntimeDefaultController.CovTermDefaultContext

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/18/16
 * Time: 7:23 PM
 * To change this template use File | Settings | File Templates.
 */
class SectionICovTermRuntimeDefaultCalculator extends HOCovTermRuntimeDefaultCalculator {
  private var _triggerCovTerm : CovTerm
  private var _shortCircuitApplicableCovTermPatternCodes : List<String>

  construct(context : CovTermDefaultContext){
    super(context)
    this._triggerCovTerm = context.TriggerCovTerm
    this._shortCircuitApplicableCovTermPatternCodes = context.ApplicablePatternCodes
  }

  override property get ApplicableCovTermPatterns(): List<String> {
    var results : List<String>

    if(_shortCircuitApplicableCovTermPatternCodes.HasElements){
      results = _shortCircuitApplicableCovTermPatternCodes
    }else if(_triggerCovTerm != null){
       results = CoveragesUtil.DEPENDENT_LIMIT_PATTERNS_TO_DERIVING_LIMIT_PATTERNS.get(_triggerCovTerm.PatternCode)

      if(_triggerCovTerm.PatternCode == "HODW_PersonalPropertyLimit_HOE" and Dwelling.HOPolicyType == TC_HO3){//exclude from re-defaulting when personal property changes
        results.removeWhere( \ pattern -> pattern.equalsIgnoreCase("HODW_LossOfUseDwelLimit_HOE"))
      }
    }

    return results
  }

  override function shouldSetDefault(): boolean {
    return true
  }

  override function getDefault(covTerm : CovTerm): Double {
    var result: Double

    var executiveCoverageFactor = ConfigParamsUtil.getDouble(TC_LimitDefaultFactor, BaseState, Dwelling.HOPolicyType.Code
        + covTerm.PatternCode
        + Dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.PatternCode
        + Dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value)
    var usageFactor = ConfigParamsUtil.getDouble(TC_LimitDefaultFactor, BaseState, Dwelling.HOPolicyType.Code + covTerm.PatternCode + Dwelling.DwellingUsage.Code)
    var occupancyFactor = ConfigParamsUtil.getDouble(TC_LimitDefaultFactor, BaseState, Dwelling.HOPolicyType.Code + covTerm.PatternCode + Dwelling.Occupancy.Code)
    var residenceTypeFactor = ConfigParamsUtil.getDouble(TC_LimitDefaultFactor, BaseState, Dwelling.HOPolicyType.Code + covTerm.PatternCode + Dwelling.ResidenceType.Code)
    var genericFactor = ConfigParamsUtil.getDouble(TC_LimitDefaultFactor, BaseState, Dwelling.HOPolicyType.Code + covTerm.PatternCode)

    if(executiveCoverageFactor != null){
      result = executiveCoverageFactor
    }else if(usageFactor != null){
      result = usageFactor
    }else if(occupancyFactor != null){
      result = occupancyFactor
    }else if(residenceTypeFactor != null){
      result = residenceTypeFactor
    }else{
      result = genericFactor
    }

    return result
  }
}