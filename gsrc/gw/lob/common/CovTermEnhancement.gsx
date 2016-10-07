package gw.lob.common

uses java.math.BigDecimal
uses una.config.ConfigParamsUtil
uses java.lang.Double
uses gw.api.domain.covterm.DirectCovTerm
uses java.lang.IllegalStateException
uses gw.api.domain.covterm.OptionCovTerm
uses una.utils.MathUtil.ROUNDING_MODE
uses una.utils.MathUtil

enhancement CovTermEnhancement: gw.api.domain.covterm.CovTerm {

  function syncOptionTermToTheOnlyOption() {
    if (this.Pattern typeis gw.api.productmodel.OptionCovTermPattern) {
      var availableOptions = this.Pattern.getAvailableValues(this)
      if (availableOptions.Count == 1)
        this.setValueFromString(availableOptions.first().OptionCode)
    }
  }

  function hasNoAvailableOptionsOrNotApplicableOptionOnly() : boolean {
    var pattern = this.Pattern
    if (pattern typeis gw.api.productmodel.OptionCovTermPattern) {
      var availableOptions = pattern.getAvailableValues(this)
      if (availableOptions.Empty or
          (pattern.Required and availableOptions.Count == 1 and availableOptions.first().OptionCode == "NotApplicable") ) {
        return true
      }
    }

    return false
  }

  /*
    returns null if no restriction is placed on this coverage term
    via business rules outside of product model
  */
  public function getMaxAllowedLimitValue(coverable : Coverable) : BigDecimal{
    var result : BigDecimal

    switch(typeof coverable.PolicyLine){
      case HomeownersLine_HOE:
          if(isDwellingOrPersonalPropertyLimit(coverable.PolicyLine.Dwelling)){
            result = ConfigParamsUtil.getRange(TC_DwellingLimitAcceptableRange, coverable.PolicyLine.BaseState, coverable.PolicyLine.HOPolicyType).UpperBound
          }else if(isDerivedSpecialLimits(coverable.PolicyLine.Dwelling)){
            result = getSpecialLimitsMax(coverable.PolicyLine.Dwelling)
          }else if(isLimitCalculated(coverable.PolicyLine.Dwelling)){
            result = getAllowedLimitValueHO(coverable.PolicyLine.Dwelling, TC_LimitMaxFactor)
          }
          break
        default:
        break
    }

    return result
  }

  /*
    returns null if no restriction is placed on this coverage term
    via business rules outside of product model
  */
  public function getMinAllowedLimitValue(coverable : Coverable) : BigDecimal{
    var result : BigDecimal

    switch(typeof coverable.PolicyLine){
      case HomeownersLine_HOE:
          if(isDwellingOrPersonalPropertyLimit(coverable.PolicyLine.Dwelling)){
            result = ConfigParamsUtil.getRange(TC_DwellingLimitAcceptableRange, coverable.PolicyLine.BaseState, coverable.PolicyLine.HOPolicyType).LowerBound
          }else if(isLimitCalculated(coverable.PolicyLine.Dwelling)){
            result = getAllowedLimitValueHO(coverable.PolicyLine.Dwelling, TC_LimitMinFactor)
          }else if(isDerivedSpecialLimits(coverable.PolicyLine.Dwelling)){
            result = ConfigParamsUtil.getDouble(TC_SpecialLimitsDirectMinimumDefault, coverable.PolicyLine.BaseState, this.PatternCode)
          }
          break
        default:
        break
    }

    return result
  }

  private function getAllowedLimitValueHO(dwelling: Dwelling_HOE, configParameterType: ConfigParameterType_Ext) : BigDecimal{
    var result : BigDecimal

    var sourceLimitValue = getSourceLimitValue(dwelling)
    var factor = determineFactor(dwelling, configParameterType)

    if(factor > 1){
      result = factor
    }else{
      result = getRoundedDefault(sourceLimitValue, factor, dwelling, ROUND_NEAREST)
    }

    return result
  }

  /*
    Sets the limit default for this DirectCovTerm
    CovTerms do not contain a reference to a coverage or coverable.
    Placing the default function here allows code to individually set defaults
  */
  public function setDefaultLimit(coverable : Coverable){
    if(shouldDefaultLimit(coverable)){
      var defaultValue = getDefaultLimit(coverable)

      if(defaultValue != null){
        if(this typeis DirectCovTerm){
          this.Value = defaultValue
        }else if(this typeis OptionCovTerm){
          this.setOptionValue(this.AvailableOptions.firstWhere( \ option -> option.Value.doubleValue() == defaultValue.doubleValue()))
        }
      }
    }
  }

  public function getDefaultLimit(coverable : Coverable) : BigDecimal{
    if(!coverable.CoveragesFromCoverable*.CovTerms.hasMatch( \ covTerm -> covTerm.PatternCode.equalsIgnoreCase(this.PatternCode))){
      throw new IllegalStateException("Coverage term with pattern code ${this.PatternCode} is not assignable to a coverage belonging to coverable type of ${coverable.IntrinsicType}")
    }

    var result : BigDecimal

    switch(typeof coverable.PolicyLine){
      case HomeownersLine_HOE:
          result = getDefaultLimitHO(coverable.PolicyLine)
          break
        default:
        break
    }

    return result
  }

  private function shouldDefaultLimit(coverable : Coverable) : boolean{
    var result : boolean

    switch(typeof coverable.PolicyLine){
      case HomeownersLine_HOE:
          result = shouldDefaultLimitHO(coverable.PolicyLine)
          break
        default:
        break
    }

    return result
  }

  private function shouldDefaultLimitHO(hoLine : HomeownersLine_HOE) : boolean{
    return isLimitCalculated(hoLine.Dwelling)
       or (isDerivedSpecialLimits(hoLine.Dwelling) and (this as DirectCovTerm).Value == null)
       or this.PatternCode == "HOPL_LossAssCovLimit_HOE" and (this as OptionCovTerm).Value == null
  }

  private function getDefaultLimitHO(hoLine : HomeownersLine_HOE) : BigDecimal{
    var result : BigDecimal
    var dwelling = hoLine.Dwelling

    var defaultSectionIValueBasedOnLimit = getDefaultSectionIValueBasedOnLimit(dwelling)
    var specialLimitsDefault = getSpecialLimitDefault(dwelling)

    if(defaultSectionIValueBasedOnLimit != null){
      result = defaultSectionIValueBasedOnLimit
    }else if(specialLimitsDefault != null){
      result = specialLimitsDefault
    }else if(this.PatternCode == "HOPL_LossAssCovLimit_HOE"){
      result = this.AvailableOptions.orderBy( \ option -> option.Value).first().Value
    }

    return result
  }

  public function getDefaultSectionIValueBasedOnLimit(dwelling : Dwelling_HOE) : BigDecimal{
    var result : BigDecimal

    if(isLimitCalculated(dwelling)){
      var sourceLimitValue = getSourceLimitValue(dwelling)
      var factor = determineFactor(dwelling, TC_LimitDefaultFactor)

      if(factor > 1 or this typeis OptionCovTerm){ //sometimes, "factor' can be a hard-set dollar amount or, for option cov terms, a percentage selection
        result = factor
      }else{
        result = getRoundedDefault(sourceLimitValue, factor, dwelling, ROUND_NEAREST)
      }
    }

    return result
  }

  public function getSpecialLimitDefault(dwelling : Dwelling_HOE) : BigDecimal{
    var result : BigDecimal

    if(isDerivedSpecialLimits(dwelling)){
      result = ConfigParamsUtil.getDouble(TC_SPECIALLIMITSDIRECTMINIMUMDEFAULT, dwelling.PolicyLine.BaseState, this.PatternCode)
    }

    return result
  }

  private function getSourceLimitValue(dwelling : Dwelling_HOE) : BigDecimal{
    var sourceLimitPatternCode = ConfigParamsUtil.getString(TC_DerivedLimitPatternPair, dwelling.HOLine.BaseState, dwelling.HOPolicyType.Code + this.PatternCode)
    //more specific to include ho policy type.  if none found, goes more generic with just pattern code
    if(sourceLimitPatternCode == null){
      sourceLimitPatternCode = ConfigParamsUtil.getString(TC_DerivedLimitPatternPair, dwelling.HOLine.BaseState, this.PatternCode)
    }

    return (dwelling.Coverages.CovTerms.firstWhere( \ term -> term.PatternCode?.equalsIgnoreCase(sourceLimitPatternCode)) as DirectCovTerm).Value
  }

  private function getRoundedDefault(sourceLimitValue : BigDecimal, factor : Double, dwelling : Dwelling_HOE, roundingMode : ROUNDING_MODE) : BigDecimal{
    var result : BigDecimal
    if(sourceLimitValue != null and factor != null){
      var calculatedValue = factor * sourceLimitValue
      var roundingFactor = ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, dwelling.HOLine.BaseState, this.PatternCode)

      if(roundingFactor != null){
        calculatedValue = MathUtil.roundTo(calculatedValue, roundingFactor, roundingMode)
      }

      result = calculatedValue
    }

    return result
  }

  private function determineFactor(dwelling : Dwelling_HOE, configParameterType : ConfigParameterType_Ext) : Double{
    var result: Double

    var executiveCoverageFactor = ConfigParamsUtil.getDouble(configParameterType, dwelling.HOLine.BaseState, dwelling.HOPolicyType.Code
        + this.PatternCode
        + dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.PatternCode
        + dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value)
    var usageFactor = ConfigParamsUtil.getDouble(configParameterType, dwelling.HOLine.BaseState, dwelling.HOPolicyType.Code + this.PatternCode + dwelling.DwellingUsage.Code)
    var occupancyFactor = ConfigParamsUtil.getDouble(configParameterType, dwelling.HOLine.BaseState, dwelling.HOPolicyType.Code + this.PatternCode + dwelling.Occupancy.Code)
    var residenceTypeFactor = ConfigParamsUtil.getDouble(configParameterType, dwelling.HOLine.BaseState, dwelling.HOPolicyType.Code + this.PatternCode + dwelling.ResidenceType.Code)
    var genericFactor = ConfigParamsUtil.getDouble(configParameterType, dwelling.HOLine.BaseState, dwelling.HOPolicyType.Code + this.PatternCode)

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

  private function isExecutiveCoverageException(dwelling : Dwelling_HOE) : boolean{
    return dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value
        and this.PatternCode.equalsIgnoreCase(dwelling.HODW_SpecialLimitsPP_HOE_Ext.HODW_SecurityLimits_HOETerm.PatternCode)
  }

  private function getSpecialLimitsMax(dwelling : Dwelling_HOE) : BigDecimal{
    if(isExecutiveCoverageException(dwelling)){
      return 5000
    }else{
      return ConfigParamsUtil.getDouble(TC_SpecialLimitsDirectMaximum, dwelling.PolicyLine.BaseState, this.PatternCode)
    }
  }

  private function isLimitCalculated(dwelling: Dwelling_HOE) : boolean{
    return ConfigParamsUtil?.getList(TC_DerivedLimitsPatternCodes, dwelling.HOLine.BaseState)?.hasMatch( \ element -> element?.equalsIgnoreCase(this.PatternCode))
        or this == dwelling.HODW_PermittedIncOcp_HOE_Ext.HODW_Limit_HOETerm
  }

  private function isDerivedSpecialLimits(dwelling : Dwelling_HOE) : boolean{
    return ConfigParamsUtil.getList(ConfigParameterType_Ext.TC_DERIVEDSPECIALLIMITSCOVTERMPATTERNS, dwelling.PolicyLine.BaseState).contains(this.PatternCode)
  }

  private function isDwellingOrPersonalPropertyLimit(dwelling: Dwelling_HOE) : boolean{
    return this.PatternCode.equalsIgnoreCase(dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.PatternCode)
        or (this.PatternCode.equalsIgnoreCase(dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.PatternCode)
       and HOPolicyType_HOE.TF_PERSONALPROPERTYVALIDATEDTYPES.TypeKeys.contains(dwelling.HOPolicyType))
  }

  //uim-svallabhapurapu Defect fix 159 : make non editable for Earthquake coverage - A
  property get IsCovTermEditable() : boolean{
     if((this.Pattern typeis gw.api.productmodel.DirectCovTermPattern) and this.PatternCode == "HODW_EQDwellingLimit_HOE_Ext"){
          return false

     }
    return true
  }

}
