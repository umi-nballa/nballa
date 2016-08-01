package gw.lob.ho
uses java.math.BigDecimal
uses gw.web.productmodel.LineWizardStepHelper_Ext
uses una.utils.MathUtil
uses una.config.ConfigParamsUtil

enhancement
    DwellingCov_HOEEnhancement : entity.DwellingCov_HOE {

  property get TotalCovLimit() : BigDecimal {
    var limit : BigDecimal
    switch(this.Dwelling.HOPolicyType){
      case HOPolicyType_HOE.TC_DP2:
          limit = dwellingCovLimitDP2()
          break
      case HOPolicyType_HOE.TC_HO3:
          limit = dwellingCovLimitHO3()
          break
      case HOPolicyType_HOE.TC_HO4:
      case HOPolicyType_HOE.TC_HO6:
          limit = dwellingCovLimitHO4_6()
          break
    }
    return limit
  }

  private function dwellingCovLimitDP2() : BigDecimal {
    var dwelling = this.Dwelling
    var percentageOfDwellingLimit : BigDecimal

    switch (this.PatternCode){
      case "DPDW_Dwelling_Cov_HOE":
          return dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value
      case "DPDW_Loss_Of_Use_HOE":
          percentageOfDwellingLimit = dwelling.DPDW_Loss_Of_Use_HOE.DPDW_LossOfUseDwelLimit_HOETerm.Value
          return calculateDollarFromPercentage(dwelling.DwellingLimitCovTerm.Value, percentageOfDwellingLimit)
      case "DPDW_OrdinanceCov_HOE":
          percentageOfDwellingLimit = dwelling.DPDW_OrdinanceCov_HOE.DPDW_OrdinanceLimit_HOETerm.Value
          return calculateDollarFromPercentage(dwelling.DwellingLimitCovTerm.Value, percentageOfDwellingLimit)
      case "DPDW_Other_Structures_HOE":
          percentageOfDwellingLimit = dwelling.DPDW_Other_Structures_HOE.DPDW_OtherStructuresLimit_HOETerm.Value
          return calculateDollarFromPercentage(dwelling.DwellingLimitcovTerm.Value, percentageOfDwellingLimit)
      case "DPDW_Personal_Property_HOE":
          percentageOfDwellingLimit = dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value
          return calculateDollarFromPercentage(dwelling.DwellingLimitCovTerm.Value, percentageOfDwellingLimit)
        default:
        return BigDecimal.ZERO
    }
  }


  private function dwellingCovLimitHO3() : BigDecimal {
    var limit : BigDecimal
    if(this.PatternCode == "HODW_Personal_Property_HOE"){
      var dwelling = this.Dwelling
      var percentageOfDwellingLimit = dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value
      limit = calculateDollarFromPercentage(dwelling.DwellingLimitCovTerm.Value, percentageOfDwellingLimit)
    } else {
      limit = dwellingCovLimitHO()
    }
    return limit
  }

  private function dwellingCovLimitHO4_6() : BigDecimal {
    var limit : BigDecimal
    switch(this.PatternCode){
      case "HODW_Personal_Property_HOE":
          limit = this.Dwelling.HODW_Personal_Property_HOE.HODW_PropertyHO4_6Limit_HOETerm.Value
          break
      case "HODW_Dwelling_Cov_HOE":
          limit = this.Dwelling.HODW_Dwelling_Cov_HOE.Limit_HO6_HOETerm.Value
          break
        default:
        limit = dwellingCovLimitHO()
    }
    return limit
  }

  private function dwellingCovLimitHO() : BigDecimal {
    var dwelling = this.Dwelling
    var percentageOfDwellingLimit : BigDecimal
    var percentageOfPropertyLimit : BigDecimal

    switch (this.PatternCode){
      case "HODW_Dwelling_Cov_HOE":
          return dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
      case "HODW_Loss_Of_Use_HOE":
          percentageOfDwellingLimit = dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value
          var lossOfUseDwelLimitValue = calculateDollarFromPercentage(dwelling.DwellingLimitCovTerm.Value, percentageOfDwellingLimit)
          percentageOfPropertyLimit = dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUsePropLimit_HOETerm.Value
          var lossOfUsePropLimitValue = calculateDollarFromPercentage(dwelling.PersonalPropertyLimitCovTerm.Value, percentageOfPropertyLimit)
          return lossOfUseDwelLimitValue + lossOfUsePropLimitValue
      case "HODW_OrdinanceCov_HOE":
          percentageOfDwellingLimit = dwelling.HODW_OrdinanceCov_HOE.HODW_OrdinanceLimit_HOETerm.Value
          return calculateDollarFromPercentage(dwelling.DwellingLimitCovTerm.Value, percentageOfDwellingLimit)
      case "HODW_Other_Structures_HOE":
          percentageOfDwellingLimit = dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value

          return calculateDollarFromPercentage(dwelling.DwellingLimitCovTerm.Value, percentageOfDwellingLimit)
        default:
        return BigDecimal.ZERO
    }
  }

  private function calculateDollarFromPercentage(dwellingLimit : BigDecimal, percentage : BigDecimal) : BigDecimal {
    var dollarValue = 0bd
    if(dwellingLimit != null and percentage != null){
      dollarValue = dwellingLimit * percentage / 100
    }
    return dollarValue
  }
  /*
  *  Author: Sen Pitchaimuthu
  *  Change Log: Added the new function getDefaultLimitvalue to get the default percentage of Other Structure,
  *  Personal Property and Loss of use coverages from Script Parameter
   */
  function getDefaultLimitValue_Ext(cov: DwellingCov_HOE) : BigDecimal {


    var policyType = this.Dwelling.HOPolicyType
    var state = this.Branch.BaseState
    var defaultValue : BigDecimal
    var limitA = roundDown_Ext(this.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value)

    var limitC = roundDown_Ext(this.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value)

    switch(typeof(cov)) {

      case HODW_Loss_Of_Use_HOE:
          if (((policyType == TC_HO4) or (policyType == TC_HO6))  and (limitC != null))
          {
            if (policyType == TC_HO4) {
              defaultValue = state == TC_NC ? limitC.multiply(0.2) : limitC.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)
            }
            else
            {
              defaultValue = state == TC_NC ? limitC.multiply(0.4) : limitC.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_HO6)
            }
          }

          if ((limitA != null) or (policyType == TC_HO3))
          {
            defaultValue = state == TC_NC ? limitA.multiply(0.2) : limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)
          }
          break

      case HODW_Personal_Property_HOE:
          if(limitA != null)
            defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovC_default)
          break
      case HODW_Other_Structures_HOE:
          if(limitA != null)
            defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovB_default)
          break
    }
    return defaultValue == null ? null : roundDown_Ext(defaultValue)
  }

  function getDPDefaultLimitValue_Ext(cov: DwellingCov_HOE) : BigDecimal {


    var policyType = this.Dwelling.HOPolicyType
    var state = this.Branch.BaseState
    var defaultValue : BigDecimal
    var limitA = roundDown_Ext(this.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value)

    var limitC = roundDown_Ext(this.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value)

    switch(typeof(cov)) {

      case DPDW_Loss_Of_Use_HOE:
          if (limitA != null)
            defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)
          break

      case DPDW_Personal_Property_HOE:
          if(limitA != null)
            defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovC_default)
          break
      case DPDW_Other_Structures_HOE:
          if(limitA != null)
            defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovB_default)
          break
    }
    return defaultValue == null ? null : roundDown_Ext(defaultValue)
  }

  /*
*  Author: Sen Pitchaimuthu
*  Change Log: Added the new function setDefaultLimitvalue to set the default value of Other Structure,
*  Personal Property and Loss of use coverages based on Dwelling Coverages
 */
  function setDwellingDefaultLimits_Ext() {

    var limitA = roundDown_Ext(this.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value)

    var limitC = roundDown_Ext(this.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value)

    var covB = this.Dwelling.DPDW_Other_Structures_HOE
    var covC = this.Dwelling.DPDW_Personal_Property_HOE
    var covD = this.Dwelling.DPDW_Loss_Of_Use_HOE

    // Dwelling Limit changed
    if (this typeis DPDW_Dwelling_Cov_HOE and limitA != null){

      this.DPDW_Dwelling_Limit_HOETerm.Value = limitA

      if(covB.HasDPDW_OtherStructuresLimit_HOETerm)
        covB.DPDW_OtherStructuresLimit_HOETerm.Value = MathUtil.roundTo(getDPDefaultLimitValue_Ext(covB), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, this.PolicyLine.BaseState, covB.DPDW_OtherStructuresLimit_HOETerm.PatternCode))

      if (covC.HasDPDW_PersonalPropertyLimit_HOETerm)
        covC.DPDW_PersonalPropertyLimit_HOETerm.Value = MathUtil.roundTo(getDPDefaultLimitValue_Ext(covC), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, this.PolicyLine.BaseState, covC.DPDW_PersonalPropertyLimit_HOETerm.PatternCode))
      if (this.Dwelling.DPDW_Loss_Of_Use_HOEExists)
        covD.DPDW_LossOfUseDwelLimit_HOETerm.Value = MathUtil.roundTo(getDPDefaultLimitValue_Ext(covD), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, this.PolicyLine.BaseState, covD.DPDW_LossOfUseDwelLimit_HOETerm.PatternCode))
    }
    else if(this typeis DPDW_Personal_Property_HOE) {
      if(covC.HasDPDW_PersonalPropertyLimit_HOETerm and limitC == null)
        covC.DPDW_PersonalPropertyLimit_HOETerm.Value = limitC

      if (this.Dwelling.DPDW_Loss_Of_Use_HOEExists)
        covD.DPDW_LossOfUseDwelLimit_HOETerm.Value = MathUtil.roundTo(getDPDefaultLimitValue_Ext(covD), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, this.PolicyLine.BaseState, covD.DPDW_LossOfUseDwelLimit_HOETerm.PatternCode))
    }
  }

  /*
*  Author: Sen Pitchaimuthu
*  Change Log: Added the new function setHomeownersDefaultLimitvalue to set the default value of Other Structure,
*  Personal Property and Loss of use coverages based on Dwelling Coverages
 */
  function setHomeownersDefaultLimits_Ext() {
    var limitA = roundDown_Ext(this.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value)

    var limitC = roundDown_Ext(this.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value)

    var covB = this.Dwelling.HODW_Other_Structures_HOE
    var covC = this.Dwelling.HODW_Personal_Property_HOE
    var covD = this.Dwelling.HODW_Loss_Of_Use_HOE

    // Dwelling Limit changed
    if (this typeis HODW_Dwelling_Cov_HOE and limitA != null){

      this.HODW_Dwelling_Limit_HOETerm.Value = limitA

      if(covB.HasHODW_OtherStructures_Limit_HOETerm)
        covB.HODW_OtherStructures_Limit_HOETerm.Value = MathUtil.roundTo(getDefaultLimitValue_Ext(covB), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, this.PolicyLine.BaseState, covB.HODW_OtherStructures_Limit_HOETerm.PatternCode))

      if (covC.HasHODW_PersonalPropertyLimit_HOETerm)
        covC.HODW_PersonalPropertyLimit_HOETerm.Value = MathUtil.roundTo(getDefaultLimitValue_Ext(covC), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, this.PolicyLine.BaseState, covC.HODW_PersonalPropertyLimit_HOETerm.PatternCode))

      if (this.Dwelling.HODW_Loss_Of_Use_HOEExists)
        covD.HODW_LossOfUseDwelLimit_HOETerm.Value = MathUtil.roundTo(getDefaultLimitValue_Ext(covD), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, this.PolicyLine.BaseState, covD.HODW_LossOfUseDwelLimit_HOETerm.PatternCode))

      if(covC.HasHODW_PersonalPropertyLimit_HOETerm  and covC.HODW_PersonalPropertyLimit_HOETerm.Value != null){//is initial load change
        LineWizardStepHelper_Ext.setSpecialLimitsPersonalPropertyDefaults(this.Dwelling)
      }
    }
    else if(this typeis HODW_Personal_Property_HOE) {
      covD.HODW_LossOfUseDwelLimit_HOETerm.Value = MathUtil.roundTo(getDefaultLimitValue_Ext(covD), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, this.PolicyLine.BaseState, covD.PatternCode))
    }
  }



  /*
*  Author: Sen Pitchaimuthu
*  Change Log: Added the new function roundown coverages based on the rounding logic
 */
  private static function roundDown_Ext(number: BigDecimal) : BigDecimal {
    return number?.setScale(0, java.math.RoundingMode.DOWN)
  }

  /*
     *  Author: Sen Pitchaimuthu
     *  Change Log: Added the new function setAllOtherPerilDefault to default the All other Peril value
     */

  static function setAllOtherPerilDefault(_dwelling: Dwelling_HOE)
  {

    if (_dwelling.HOPolicyType == TC_HO3 and _dwelling.Branch.BaseState != TC_AZ)
    {
      _dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.setValueFromString("1000")
    }
    else
    {
      _dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.setValueFromString("500")
    }
  }
  /*
    *  Author: Sen Pitchaimuthu
    *  Change Log: Added the new function setValutaionMethodDefault to default the Valuation Method
    */


  static function setValuationMethodDefault(_dwelling: Dwelling_HOE)
  {

    if (_dwelling.Branch.BaseState == TC_TX)
    {
      _dwelling.HODW_Dwelling_Cov_HOE.HODW_DwellingValuation_HOETerm.setValueFromString("Actual")
    }
    else
    {
      _dwelling.HODW_Dwelling_Cov_HOE.HODW_DwellingValuation_HOETerm.setValueFromString("Replacement")
    }
  }
}

