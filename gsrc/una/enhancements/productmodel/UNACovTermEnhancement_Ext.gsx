package una.enhancements.productmodel

uses java.math.BigDecimal
uses gw.api.domain.covterm.OptionCovTerm
uses gw.api.domain.covterm.DirectCovTerm
uses una.config.ConfigParamsUtil
uses una.productmodel.runtimedefaults.CoverageTermsRuntimeDefaultController
uses una.productmodel.runtimedefaults.CoverageTermsRuntimeDefaultController.CovTermDefaultContext

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/20/16
 * Time: 7:22 PM
 * To change this template use File |  | File Templates.
 */
enhancement UNACovTermEnhancement_Ext : gw.api.domain.covterm.CovTerm {
  /*
    returns the default for this coverage term that is calculated at runtime, not from the product model
    if none is returned, it should be inferred that no calculated default exists
  */
  public property get RuntimeDefault() : BigDecimal{
    return CoverageTermsRuntimeDefaultController.getRuntimeDefault(this)
  }

  /*
    returns a limit difference from what was previously persisted or,
    in the case of Submissions, what was originally defaulted
  */
  public property get LimitDifference() : BigDecimal{
    var result : BigDecimal
    var patternDefault = this.Pattern.getDefaultValue(null)

    if(BigDecimalValue != null){//after this check, we can safely assume a "Value" of BigDecimal
      if(BasedOnBigDecimalValue != null){
        result = BigDecimalValue.subtract(BasedOnBigDecimalValue)
      }else if(RuntimeDefault != null){
        result = BigDecimalValue.subtract(RuntimeDefault)
      }else if(patternDefault != null){
        if(this typeis OptionCovTerm){
          result = BigDecimalValue.subtract(this.Pattern.getCovTermOpt(patternDefault).Value)
        }else if(this typeis DirectCovTerm){
          result = BigDecimalValue.subtract(new BigDecimal(patternDefault))
        }
      }
    }

    return result
  }

  /*
    action performed on initialization of this coverage term.
    invoked by the product model
  */
  public function onInit(){
    CoverageTermsRuntimeDefaultController.setDefaults(new CovTermDefaultContext(HO_RUNTIME, this.Clause.OwningCoverable, {this.PatternCode}))
  }

  public property get IsEditable() : boolean{
    var result = true
    var coverable = this.Clause.OwningCoverable
    var uneditableCovTerms = ConfigParamsUtil.getList(TC_UneditableCoverageTerms, coverable.PolicyLine.BaseState)
    var configResult = ConfigParamsUtil.getBoolean(ConfigParameterType_Ext.TC_ISCOVERAGETERMEDITABLE, coverable.PolicyLine.BaseState, this.PatternCode)
    var disableEditForCPOrdinanceOrLaw = this typeis OptionCovTerm
                                     and this.Clause.OwningCoverable typeis CPBuilding
                                     and this.PatternCode == "code11"

    if(this.Clause.OwningCoverable typeis CPBuilding)
      {
        if((this.Clause.OwningCoverable.PolicyLine as CommercialPropertyLine).CPCoverageC == typekey.CPCoverageBC_Ext.TC_CODE11)
          disableEditForCPOrdinanceOrLaw = true
      }

    if(uneditableCovTerms.contains(this.PatternCode) or configResult != null){
      if({"CPOrdinanceorLawCovBLimit_EXT", "CPOrdinanceorLawCovCLimit_EXT", "CPOrdinanceorLawCovBCLimit_EXT"}.contains(this.PatternCode) && !disableEditForCPOrdinanceOrLaw){
        result = false
      }
    }else if(coverable typeis Dwelling_HOE){
      var min = this.getMinAllowedLimitValue(coverable)
      var max = this.getMaxAllowedLimitValue(coverable)

      result = (min == null and max == null) or min != max
    }

    return result
  }

  /*
    returns the "BigDecimal" value of this coverage term.
  */
  protected property get BigDecimalValue() : BigDecimal{
    var result : BigDecimal

    if(this typeis OptionCovTerm){
      result = this.Value
    }else if(this typeis DirectCovTerm){
      result = this.Value
    }

    return result
  }

  private property get BasedOnBigDecimalValue() : String{
    var basedOnCoverable = this.Clause.OwningCoverable.BasedOnUntyped
    return (basedOnCoverable as Coverable).CoveragesFromCoverable
                                          .CovTerms
                                          .firstWhere( \ covTerm ->
                                                         covTerm.PatternCode == this.PatternCode).BigDecimalValue
  }
}
