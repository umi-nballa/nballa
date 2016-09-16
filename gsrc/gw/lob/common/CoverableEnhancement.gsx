package gw.lob.common

uses gw.api.productmodel.ClausePattern
uses gw.api.productmodel.ExclusionPattern
uses gw.api.productmodel.ConditionPattern
uses gw.api.productmodel.CoveragePattern
uses java.util.Map
uses gw.api.domain.covterm.CovTerm
uses java.math.BigDecimal
uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses java.util.HashMap

enhancement CoverableEnhancement : entity.Coverable {

  function isClauseSelectedOrAvailable( clausePattern : ClausePattern) : boolean {

    if (clausePattern typeis CoveragePattern) {
      return this.isCoverageSelectedOrAvailable(clausePattern)
    } else if (clausePattern typeis ConditionPattern) {
      return this.isConditionSelectedOrAvailable(clausePattern)
    } else if (clausePattern typeis ExclusionPattern) {
      return this.isExclusionSelectedOrAvailable(clausePattern)
    }

    return false
  }

  /*
    Returns a map containing the limit differences between this coverable's current
    version and its previous version.

    If no previous version exists, it returns the difference between what was defaulted vs. current value.
    If no defaulted value exists in this instance, it does not include the value
  */
  property get LimitDifferences() : Map<CovTerm, BigDecimal> {
    var  results = new HashMap<CovTerm, BigDecimal>()
    var limitCovTerms = this.CoveragesFromCoverable*.CovTerms.where( \ covTerm -> covTerm.ModelType == TC_LIMIT)

    limitCovTerms.each( \ limitCovTerm -> {
      var currentValue = getLimitValue(limitCovTerm)
      var basedOnTerm = (this.BasedOnUntyped as Coverable).CoveragesFromCoverable*.CovTerms.firstWhere( \ covTerm -> covTerm.PatternCode.equalsIgnoreCase(limitCovTerm.PatternCode))
      var valueDiff : BigDecimal

      if(basedOnTerm != null){
        var basedOnValue = getLimitValue(basedOnTerm)
        valueDiff = currentValue.subtract(basedOnValue)
      }else{
        var defaultValue = getLimitDefault(limitCovTerm)
        var thisLimit = limitCovTerm.PatternCode
        if(defaultValue != null){
          valueDiff = currentValue.subtract(defaultValue)
        }
      }

      if(valueDiff != null){
        results.put(limitCovTerm, valueDiff)
      }

    })

    return results
  }

  private function getLimitValue(covTerm : CovTerm) : BigDecimal{
    var result : BigDecimal

    if(covTerm typeis DirectCovTerm){
      result = covTerm.Value
    }else if(covTerm typeis OptionCovTerm){
      result = covTerm.OptionValue.Value
    }

    return result
  }

  private function getLimitDefault(covTerm : CovTerm) : BigDecimal{
    var result : BigDecimal

    if(covTerm typeis OptionCovTerm){
      result = covTerm.Pattern.getDefaultValue(this.PolicyLine.Branch.Offering)
    }else if(covTerm typeis DirectCovTerm){
      var calculatedDefault = covTerm.getDefaultLimit(this)

      if(covTerm.Pattern.getDefaultValue(this.PolicyLine.Branch.Offering) != null){
        result = covTerm.Pattern.getDefaultValue(this.PolicyLine.Branch.Offering)
      }else if(calculatedDefault != null){
        result = calculatedDefault
      }
    }

    return result
  }
}
