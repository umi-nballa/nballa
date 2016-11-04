package una.productmodel.runtimedefaults

uses java.lang.Double
uses una.productmodel.runtimedefaults.CoverageTermsRuntimeDefaultController.CovTermDefaultContext
uses gw.api.domain.covterm.CovTerm
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/21/16
 * Time: 3:09 PM
 * To change this template use File | Settings | File Templates.
 */
class HOInitCovTermRuntimeDefaultCalculator extends HOCovTermRuntimeDefaultCalculator {
  private var _applicableCovTerms : List<String>

  construct(context : CovTermDefaultContext){
    super(context)
    this._applicableCovTerms = context.ApplicablePatternCodes
  }

  override function getDefault(covTerm: CovTerm): Double {
    var result : Double
    var specialLogicDefault = getSpecialLogicDefault(covTerm)

    if(specialLogicDefault != null){
      result = specialLogicDefault
    }else{
      result = ConfigParamsUtil.getDouble(TC_CovTermRuntimeDefault, BaseState, covTerm.PatternCode)
    }

    return result
  }

  override property get ApplicableCovTermPatterns(): List<String> {
    return _applicableCovTerms
  }

  private static function getSpecialLogicDefault(covTerm : CovTerm) : Double{
    var result : Double

    var line : entity.HomeownersLine_HOE

    if(covTerm.Clause.OwningCoverable typeis entity.HomeownersLine_HOE){
      line = covTerm.Clause.OwningCoverable
    }else{
      line = (covTerm.Clause.OwningCoverable as entity.Dwelling_HOE).HOLine
    }

    switch(covTerm.PatternCode){
      case "HOPL_LossAssCovLimit_HOE":
      case "HOLI_AnimalLiabLimit_HOE":
      case "HODW_OrdinanceLimit_HOE":
      case "DPDW_Additional_LivingExpLimit_HOE":
      case "HODW_FungiSectionILimit_HOE":
      case "HODW_FungiSectionII_HOE":
        result = covTerm.AvailableOptions.orderBy( \ option -> option.Value).first().Value
        break
      case "HODW_EQCovD_HOE_Ext":
        result = getEarthquakeCompCovDLimitDefault(line)
        break
      case "HODW_EQCovA_HOE":
        result = line.Dwelling.DwellingLimitCovTerm.Value
        break
      case "HOLI_UnitOwnersRentedOthers_Deductible_HOE_Ext":
        result = line.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value
        break
      case "HOPL_Deductible_HOE":
        result = getLossAssessmentDefaultDeductible(covTerm, line)
        break
      case "HODW_BuildAddInc_HOE":
          result = getBuildingAddAltLimitDefault(line)
          break
      default:
        break
    }

    return result
  }

  private static function getLossAssessmentDefaultDeductible(covTerm: CovTerm, line : entity.HomeownersLine_HOE) : Double{
    var result : Double

    if(line.Dwelling.HODW_LossAssessmentCov_HOE_Ext.HasHOPL_Deductible_HOETerm){
      result = ConfigParamsUtil.getDouble(TC_LossAssessmentDeductibleDefault, line.BaseState, line.Dwelling.HOPolicyType)

      if(line.BaseState == TC_FL){
        result = getLossAssessmentDefaultDeductibleFL(result, line)
      }
    }

    return result
  }

  private static function getLossAssessmentDefaultDeductibleFL(value: Double, line: entity.HomeownersLine_HOE) : Double{
    var result : Double

    if(line.Dwelling.HODW_LossAssessmentCov_HOE_Ext.HOPL_LossAssCovLimit_HOETerm.Value > 2000){
      if(value != null){
        result = value
      }else if(line.Dwelling.HOPolicyType == TC_HO6){
        result = line.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value
      }
    }

    return result
  }

  private static function getEarthquakeCompCovDLimitDefault(line: entity.HomeownersLine_HOE) : Double{
    var result : Double
    var maxAllowed : Double = 25000
    var factor : Double = 0.2

    var calculatedAmount = line.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value?.multiply(factor)

    if(calculatedAmount > maxAllowed){
      result = maxAllowed
    }else{
      result = calculatedAmount
    }

    return result
  }

  private static function getBuildingAddAltLimitDefault(line: entity.HomeownersLine_HOE) : Double{
    var result : Double
    var factor : Double = 0.1

    var calculatedAmount = line.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value?.multiply(factor)

    result = calculatedAmount

    return result
  }
}