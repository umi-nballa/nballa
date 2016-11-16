package una.productmodel.runtimedefaults

uses java.util.List
uses una.productmodel.runtimedefaults.CoverageTermsRuntimeDefaultController.CovTermDefaultContext
uses gw.api.domain.covterm.CovTerm
uses java.lang.Double
uses gw.api.domain.covterm.OptionCovTerm
uses gw.api.domain.covterm.DirectCovTerm
uses java.math.BigDecimal
uses una.config.ConfigParamsUtil
uses una.utils.MathUtil

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/18/16
 * Time: 12:13 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class CovTermRuntimeDefaultCalculator{
  protected var _context : CovTermDefaultContext as Context
  protected abstract property get ApplicableCovTermPatterns() : List<String>
  protected abstract property get Coverables() : List<Coverable>
  protected abstract function shouldSetDefault() : boolean
  protected abstract function shouldReturnDefault(covTerm : CovTerm) : boolean
  protected abstract function getDefault(covTerm : CovTerm) : Double

  construct(context : CovTermDefaultContext){
    this._context = context
  }

  protected final property get BaseState() : Jurisdiction{
    return Coverables.first().PolicyLine.BaseState
  }

  public function setRuntimeDefaults(){
    if(shouldSetDefault()){
      ApplicableCovTermPatterns?.each( \ patternCode -> {
        var covTermForPattern = Coverables*.CoveragesFromCoverable*.CovTerms.firstWhere( \ covTerm -> covTerm.PatternCode?.equalsIgnoreCase(patternCode))

        if(covTermForPattern != null){
          setRuntimeDefault(covTermForPattern)
        }
      })
    }
  }

  public final function getRuntimeDefault(covTerm : CovTerm) : Double{
    var result : Double

    if(shouldReturnDefault(covTerm)){
      var defaultValue = getDefault(covTerm)

      if(defaultValue > 1 or covTerm typeis OptionCovTerm){ //if it is a static dollar amount or option cov term, do not calculate
        result = defaultValue
      }else if(covTerm typeis DirectCovTerm){
        result = getRoundedDefault(getSourceLimitValue(covTerm), defaultValue, covTerm)
      }
    }

    return result
  }

  private function setRuntimeDefault(covTerm : CovTerm){
    var defaultValue = getRuntimeDefault(covTerm)

    if(defaultValue != null){
      if(covTerm typeis DirectCovTerm){
        covTerm.Value = defaultValue
      }else if(covTerm typeis OptionCovTerm){
        covTerm.setOptionValue(covTerm.AvailableOptions.firstWhere( \ option -> option.Value.doubleValue() == defaultValue.doubleValue()))
      }
    }
  }

  private function getRoundedDefault(sourceLimitValue : BigDecimal, factor : Double, covTerm : CovTerm) : BigDecimal{
    var result : BigDecimal

    if(sourceLimitValue != null and factor != null){
      var calculatedValue = factor * sourceLimitValue
      var roundingFactor = ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, covTerm.Clause.OwningCoverable.PolicyLine.BaseState, covTerm.PatternCode)

      if(roundingFactor != null){
        calculatedValue = MathUtil.roundTo(calculatedValue, roundingFactor, ROUND_NEAREST)
      }

      result = calculatedValue
    }
    return result
  }

  private function getSourceLimitValue(covTerm : DirectCovTerm) : BigDecimal{
    var covTerms = Coverables*.CoveragesFromCoverable*.CovTerms.whereTypeIs(DirectCovTerm)
    var sourceLimitCovTerm = covTerms.firstWhere( \ term -> term.PatternCode.equalsIgnoreCase(covTerm.DerivedDefaultPatternCodeSource))
    return sourceLimitCovTerm.Value
  }
}