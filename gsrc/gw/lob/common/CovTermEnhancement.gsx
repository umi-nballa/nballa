package gw.lob.common

uses java.math.BigDecimal
uses una.config.ConfigParamsUtil
uses java.lang.Double
uses gw.api.domain.covterm.DirectCovTerm
uses una.utils.MathUtil.ROUNDING_MODE
uses una.utils.MathUtil
uses una.config.Range

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
          result = getDwellingLimitRange(coverable.PolicyLine).UpperBound
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
          result =  getDwellingLimitRange(coverable.PolicyLine).LowerBound
        }else if(isLimitCalculated(coverable.PolicyLine.Dwelling)){
          result = getAllowedLimitValueHO(coverable.PolicyLine.Dwelling, TC_LimitMinFactor)
        }else if(isDerivedSpecialLimits(coverable.PolicyLine.Dwelling)){
          result = ConfigParamsUtil.getDouble(TC_CovTermRuntimeDefault, coverable.PolicyLine.BaseState, this.PatternCode)
        }
        break
      default:
        break
    }

    return (result == null) ? 0bd : result
  }

  private function getDwellingLimitRange(hoLine : HomeownersLine_HOE) : Range{
    var result : Range

    var condoUnitRange = ConfigParamsUtil.getRange(TC_DwellingLimitAcceptableRange, hoLine.BaseState, hoLine.HOPolicyType.Code + hoLine.Dwelling.ResidenceType.Code)
    var secondaryRange = ConfigParamsUtil.getRange(TC_DwellingLimitAcceptableRange, hoLine.BaseState, hoLine.HOPolicyType.Code + hoLine.Dwelling.IsSecondary)

    if(condoUnitRange != null){
      result = condoUnitRange
    }else if(secondaryRange != null){
      result = secondaryRange
    }else{
      result = ConfigParamsUtil.getRange(TC_DwellingLimitAcceptableRange, hoLine.BaseState, hoLine.HOPolicyType)
    }

    return result
  }

  private function getAllowedLimitValueHO(dwelling: Dwelling_HOE, configParameterType: ConfigParameterType_Ext) : BigDecimal{
    var result : BigDecimal

    var sourceLimitValue = getSourceLimitValue(dwelling)
    var factor = determineFactor(dwelling, configParameterType)

    if(factor > 1){
      result = factor
    }else if(factor >= 0){
      var calculatedDefault = getRoundedDefault(sourceLimitValue, factor, dwelling, ROUND_NEAREST)

      //apply unique exception for HI HO6
      if(dwelling.HOLine.BaseState == TC_HI
         and dwelling.HOPolicyType == TC_HO6
         and this.PatternCode == "HODW_LossOfUseDwelLimit_HOE"
         and configParameterType == TC_LIMITMINFACTOR
         and calculatedDefault > 25000){
        result = 25000
      }else{
        result = calculatedDefault
      }
    }

    //added special handling for requirement updates for HO Product Model spreadsheet
    if(dwelling.HOLine.BaseState == TC_CA
       and this.PatternCode == "HODW_LossOfUseDwelLimit_HOE"
       and dwelling.HOPolicyType == TC_HO6
       and configParameterType == TC_LimitMaxFactor
       and result != null){
       result = result + 35000
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
        or this.PatternCode == dwelling.HODW_PermittedIncOcp_HOE_Ext.HODW_Limit_HOETerm.PatternCode
        or this.PatternCode == dwelling.HODW_WindstormHailBroadSpecial_HOE_Ext.HODW_WHBroadSpecialLimit_HOETerm.PatternCode
        or this.PatternCode == "HODW_CompEarthquakeCovC_Ext"
  }

  private function isDerivedSpecialLimits(dwelling : Dwelling_HOE) : boolean{
    return ConfigParamsUtil.getList(ConfigParameterType_Ext.TC_DERIVEDSPECIALLIMITSCOVTERMPATTERNS, dwelling.PolicyLine.BaseState).contains(this.PatternCode)
  }

  private function isDwellingOrPersonalPropertyLimit(dwelling: Dwelling_HOE) : boolean{
    return this.PatternCode.equalsIgnoreCase(dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.PatternCode)
        or this.PatternCode.equalsIgnoreCase(dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.PatternCode)
        or (this.PatternCode.equalsIgnoreCase(dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.PatternCode)
       and HOPolicyType_HOE.TF_PERSONALPROPERTYVALIDATEDTYPES.TypeKeys.contains(dwelling.HOPolicyType))
  }
}
