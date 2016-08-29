package gw.lob.ho
uses java.math.BigDecimal
uses gw.web.productmodel.LineWizardStepHelper_Ext
uses una.utils.MathUtil
uses una.config.ConfigParamsUtil
uses java.util.HashMap

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
    var excCov = this.Dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value
    var ss = this.Dwelling.DwellingUsage

    switch(typeof(cov)) {

      case HODW_Loss_Of_Use_HOE:
          if(limitA != null and !(policyType == TC_HO4 || policyType == TC_HO6 || policyType == TC_HCONB_Ext)){
            if((policyType == TC_HO3) or (policyType== TC_HO3 and excCov == true) or
               (policyType== TC_HO3 and (ss == typekey.DwellingUsage_HOE.TC_SEC or ss == typekey.DwellingUsage_HOE.TC_SEAS)) or (policyType == TC_HOB_Ext)){
              defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)
            }
            else if(policyType == TC_HOA_Ext){
              defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_HOA_default)
            }
          }
         else if (((policyType == TC_HO4) or (policyType == TC_HO6) or (policyType == TC_HCONB_Ext))  and (limitC != null) and !(policyType == TC_HO3 || policyType == TC_HOA_Ext || policyType == TC_HOB_Ext))
          {
            if (policyType == TC_HO4 or policyType == TC_HCONB_Ext ) {
              defaultValue = limitC.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)
            }
            else
            {
              defaultValue = limitC.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_HO6)
            }
          }
          break

      case HODW_Personal_Property_HOE:
          if(limitA != null and !(policyType == TC_HO4 || policyType == TC_HO6 || policyType == TC_HCONB_Ext)){
            if(policyType == TC_HO3 and (ss == typekey.DwellingUsage_HOE.TC_SEC or ss == typekey.DwellingUsage_HOE.TC_SEAS)){
              if(state == TC_FL){
                defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovC_default)
              }
              if(state == TC_HI){
                defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovC_SS_default)
              }
            }
            else if (policyType == TC_HO3 and (state == TC_CA or state == TC_HI) and excCov == true){
              defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovC_Exc_default)
            }
            else if(policyType == TC_HO3 or policyType == TC_HOA_Ext or policyType == TC_HOB_Ext ){
              defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovC_default)
            }

          }

          break
      case HODW_Other_Structures_HOE:
          if(limitA != null and !(policyType == TC_HO4 || policyType == TC_HO6 || policyType == TC_HCONB_Ext))
            defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovB_default)
          break
    }

    return defaultValue == null ? null : roundDown_Ext(defaultValue)
  }
 /**
  * Amrita Dash
  * change log: Function to get the minimum value for Other Structure,
  * Personal Property and Loss of use coverages from Script Parameter
  */

  static function getHOMinValue_Ext(cov: DwellingCov_HOE,_dwelling:Dwelling_HOE): HashMap<BigDecimal, String>{
    var minValueMap = new HashMap<BigDecimal, String>()
    var policyType = _dwelling.HOPolicyType
    var state = _dwelling.Branch.BaseState
    var minValue : BigDecimal
    var limitA = roundDown_Ext(_dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value)
    var allStates = (state == TC_AZ or state == TC_CA or state == TC_FL or state == TC_HI or state == TC_NC or state == TC_NV or state == TC_SC or state == TC_TX)

    var limitC = roundDown_Ext(_dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value)
    var excCov = _dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value
    var ss = _dwelling.DwellingUsage

    switch(typeof(cov)) {
      case HODW_Other_Structures_HOE:
          if(limitA != null and !(policyType == TC_HO4 || policyType == TC_HO6 || policyType == TC_HCONB_Ext)){
            if(state == TC_NC){
              minValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovB_default)
              }
            else
              minValue = limitA.multiply(ScriptParameters.HODwellingCovFactorCovB_min)
              print("Value OS----:"+ minValue)
            }
          break
      case HODW_Personal_Property_HOE:
          if(limitA != null and !(policyType == TC_HO4 || policyType == TC_HO6 || policyType == TC_HCONB_Ext)){
            if(policyType == TC_HO3 and (ss == typekey.DwellingUsage_HOE.TC_SEC or ss == typekey.DwellingUsage_HOE.TC_SEAS) and (state == TC_FL or state == TC_HI)){

              minValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovC_SS_default)
            }
            else if (policyType == TC_HO3 and state == TC_HI and excCov == true){
              minValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovC_Exc_default)
            }
            else if(policyType == TC_HO3 or policyType == TC_HOA_Ext or policyType == TC_HOB_Ext ){
              minValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovC_default)
                print ("value----PP:" +minValue)
            }
          }
          break
      case HODW_Loss_Of_Use_HOE:
          if (((policyType == TC_HO4) or (policyType == TC_HO6) or (policyType == TC_HCONB_Ext))  and (limitC != null) and !(policyType == TC_HO3 || policyType == TC_HOA_Ext || policyType == TC_HOB_Ext))
          {
            if (policyType == TC_HO4 or policyType == TC_HCONB_Ext ) {
              minValue = limitC.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)
            }
            else
            {
              minValue = limitC.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_HO6)
            }
          }
          break

    }
    if(roundDown_Ext(minValue) != null) {
      minValueMap.put(roundDown_Ext(minValue), displaykey.Web.ProductModel.ValidationMessage.MinValue_Ext(minValue,cov))
      print("rounded value---:"+ roundDown_Ext(minValue))
    }
    return minValueMap
  }

  /**
   * Amrita Dash
   * change log: Function to get the minimum value for Fire Dwelling Other Structure,
   * Personal Property and Loss of use coverages from Script Parameter
   */

  static function getDPMinValue_Ext(cov: DwellingCov_HOE,_dwelling:Dwelling_HOE): HashMap<BigDecimal, String>{
    var minValueMap = new HashMap<BigDecimal,String>()
    var policyType = _dwelling.HOPolicyType
    var state = _dwelling.Branch.BaseState
    var minValue : BigDecimal
    var limitA = roundDown_Ext(_dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value)
    var occupancy = _dwelling.Occupancy

    switch(typeof(cov)) {
      case DPDW_Loss_Of_Use_HOE:
          if (limitA != null){
            if(policyType == TC_DP3_Ext and occupancy == typekey.DwellingOccupancyType_HOE.TC_TENANT){
              if(state == TC_CA){
                minValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_HOA_default)
              }
              if(state == TC_HI){
                minValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)
              }
            }
            else if((policyType == TC_DP3_Ext and state == TC_FL) or policyType == TC_TDP1_Ext or policyType == TC_TDP2_Ext or policyType == TC_TDP3_Ext){
              minValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)

            }
            else if (policyType == TC_LPP_Ext){
                minValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_HOA_default)
              }
          }

          break

      case DPDW_Personal_Property_HOE:
          if(limitA != null){
            if(policyType == TC_DP3_Ext and (occupancy == typekey.DwellingOccupancyType_HOE.TC_TENANT or occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER)){
              if(state == TC_CA){
                minValue = limitA.multiply(ScriptParameters.HODwellingCovFactorCovC_default)
              }else if(state == TC_HI){
                minValue = limitA.multiply(ScriptParameters.HODwellingCovValueFactorCovC_ZeroValue)
              }
            }
            if((policyType == TC_DP3_Ext and state == TC_FL) or policyType == TC_LPP_Ext or policyType == TC_TDP1_Ext or policyType == TC_TDP2_Ext or policyType == TC_TDP3_Ext){
              minValue = limitA.multiply(ScriptParameters.HODwellingCovValueFactorCovC_ZeroValue)
            }
          }
          break

      case DPDW_Other_Structures_HOE:
          if(limitA!= null) {
            if((policyType == TC_LPP_Ext or policyType == TC_TDP1_Ext or policyType == TC_TDP2_Ext or policyType == TC_TDP3_Ext) or
               (policyType == TC_DP3_Ext and (occupancy == typekey.DwellingOccupancyType_HOE.TC_TENANT or occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER) and (state ==TC_CA or state == TC_HI))){
              minValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovB_default)
            }
            else if (policyType == TC_DP3_Ext and state == TC_FL){

                minValue = limitA.multiply(ScriptParameters.HODwellingCovFactorCovB_min)
            }
          }
          break
       }
    if(roundDown_Ext(minValue)!= null){
    minValueMap.put(roundDown_Ext(minValue), displaykey.Web.ProductModel.ValidationMessage.MinValue_Ext(minValue,cov))
    }
    return minValueMap
  }

  /**
   * Amrita Dash
   * change log: Function to get the maximum value for HO Other Structure,
   * Personal Property and Loss of use coverages from Script Parameter
   */

  static function getHOMaxValue_Ext(cov: DwellingCov_HOE,_dwelling:Dwelling_HOE): HashMap<BigDecimal, String>{
    var maxValueMap =new HashMap<BigDecimal, String>()
    var policyType = _dwelling.HOPolicyType
    var state = _dwelling.Branch.BaseState
    var maxValue : BigDecimal
    var limitA = roundDown_Ext(_dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value)

    var limitC = roundDown_Ext(_dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value)
    var excCov = _dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value
    var ss = _dwelling.DwellingUsage

    switch(typeof(cov)) {
      case HODW_Other_Structures_HOE:
          if(limitA != null and !(policyType == TC_HO4 || policyType == TC_HO6 || policyType == TC_HCONB_Ext)){
            if(state == TC_NC || state == TC_TX){
              maxValue = limitA.multiply(ScriptParameters.HODwellingCovFactorStateCovB_max)
            }
            else
              maxValue = limitA.multiply(ScriptParameters.HODwellingCovFactorCovB_max)
          }
          break
      case HODW_Personal_Property_HOE:
          if(limitA != null and !(policyType == TC_HO4 || policyType == TC_HO6 || policyType == TC_HCONB_Ext)){
            if(policyType == TC_HO3 or policyType == TC_HOA_Ext or policyType == TC_HOB_Ext ){
              if(state == TC_TX){
              maxValue = limitA.multiply(ScriptParameters.HODwellingCovFactorStateCovC_max)
            }
            else
            maxValue = limitA.multiply(ScriptParameters.HODwellingCovFactorCovC_max)
              }
          }
          break
      case HODW_Loss_Of_Use_HOE:
          if (((policyType == TC_HO4) or (policyType == TC_HO6) or (policyType == TC_HCONB_Ext))  and (limitC != null) and !(policyType==TC_HO3 || policyType == TC_HOA_Ext || policyType == TC_HOB_Ext))
          {
            if (policyType == TC_HO4 or policyType == TC_HCONB_Ext ) {
              maxValue = limitC.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)
            }
            else if (policyType == TC_HO6)
            {
              if(state == TC_HI){
                maxValue = limitC
              } else
              maxValue = limitC.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_HO6)
            }
          }
          break

    }
    if(roundDown_Ext(maxValue)!= null){
    maxValueMap.put(roundDown_Ext(maxValue), displaykey.Web.ProductModel.ValidationMessage.MaxValue_Ext(maxValue,cov))
    }
    return maxValueMap
  }

  /**
   * Amrita Dash
   * change log: Function to get the maximum value for Fire Dwelling Other Structure,
   * Personal Property and Loss of use coverages from Script Parameter
   */

  static function getDPMaxValue_Ext(cov: DwellingCov_HOE,_dwelling:Dwelling_HOE): HashMap<BigDecimal, String>{
    var maxValueMap = new HashMap<BigDecimal, String>()
    var policyType = _dwelling.HOPolicyType
    var state = _dwelling.Branch.BaseState
    var maxValue : BigDecimal
    var limitA = roundDown_Ext(_dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value)
    var occupancy = _dwelling.Occupancy

    switch(typeof(cov)) {
      case DPDW_Loss_Of_Use_HOE:
          if (limitA != null){
            if(policyType == TC_DP3_Ext and occupancy == typekey.DwellingOccupancyType_HOE.TC_TENANT and (state == TC_CA or state == TC_HI )){
              maxValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_HO6)
            }
            else if((policyType == TC_DP3_Ext and state == TC_FL) or policyType == TC_TDP1_Ext or policyType == TC_TDP2_Ext or policyType == TC_TDP3_Ext){
              maxValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)
            }
            else if (policyType == TC_LPP_Ext){
                maxValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_HOA_default)
              }
          }

          break

      case DPDW_Personal_Property_HOE:
          if(limitA != null){
            if((policyType == TC_DP3_Ext and (occupancy == typekey.DwellingOccupancyType_HOE.TC_TENANT or occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER) and (state == TC_CA or state == TC_HI )) or
                policyType == TC_TDP1_Ext or policyType == TC_TDP2_Ext or policyType == TC_TDP3_Ext or policyType == TC_LPP_Ext or (policyType == TC_DP3_Ext and state == TC_FL)){
              maxValue =limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovC_default)
            }

          }
          break

      case DPDW_Other_Structures_HOE:
          if(limitA!= null) {
            if(policyType == TC_TDP1_Ext or policyType == TC_TDP2_Ext or policyType == TC_TDP3_Ext){
              maxValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovB_default)
            }
              else if((policyType == TC_DP3_Ext and state== TC_FL) or policyType == TC_LPP_Ext){
              maxValue = limitA.multiply(ScriptParameters.HODwellingCovFactorStateCovB_max)
            }
            else if (policyType == TC_DP3_Ext and (occupancy == typekey.DwellingOccupancyType_HOE.TC_TENANT or occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER)){
              if(state ==TC_CA){
              maxValue = limitA.multiply(ScriptParameters.HODwellingCovFactorStateCovB_max)
              }
                if(state == TC_HI){
              maxValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)
                  }
            }
          }
          break
    }
    if(roundDown_Ext(maxValue)!= null){
    maxValueMap.put(roundDown_Ext(maxValue), displaykey.Web.ProductModel.ValidationMessage.MaxValue_Ext(maxValue,cov))
    }
    return maxValueMap
  }


  function getDPDefaultLimitValue_Ext(cov: DwellingCov_HOE) : BigDecimal {


    var policyType = this.Dwelling.HOPolicyType
    var state = this.Branch.BaseState
    var defaultValue : BigDecimal
    var limitA = roundDown_Ext(this.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value)

    var limitC = roundDown_Ext(this.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value)
    var occupancy = this.Dwelling.Occupancy

    switch(typeof(cov)) {

      case DPDW_Loss_Of_Use_HOE:
          if (limitA != null){
            if(policyType == TC_DP3_Ext and occupancy == typekey.DwellingOccupancyType_HOE.TC_TENANT){
              if(state == TC_CA){
                defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_HOA_default)
              }
              if(state == TC_HI){
                defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)
              }
            }
            else if((policyType == TC_DP3_Ext and state == TC_FL) or policyType == TC_TDP1_Ext or policyType == TC_TDP2_Ext or policyType == TC_TDP3_Ext){
              defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_default)
            }
            else if (policyType == TC_LPP_Ext){
                defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovD_HOA_default)
              }
          }

          break

      case DPDW_Personal_Property_HOE:
          if(limitA != null){
            if(policyType == TC_DP3_Ext and (occupancy == typekey.DwellingOccupancyType_HOE.TC_TENANT or occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER)){
              if(state == TC_CA){
                defaultValue = limitA.multiply(ScriptParameters.HODwellingCovFactorCovC_default)
                }else if(state == TC_HI){
                defaultValue = limitA.multiply(ScriptParameters.HODwellingCovValueFactorCovC_ZeroValue)
              }
            }
            if((policyType == TC_DP3_Ext and state == TC_FL) or policyType == TC_LPP_Ext or policyType == TC_TDP1_Ext or policyType == TC_TDP2_Ext or policyType == TC_TDP3_Ext){
              defaultValue = limitA.multiply(ScriptParameters.HODwellingCovValueFactorCovC_ZeroValue)
            }
          }
          break

      case DPDW_Other_Structures_HOE:
          if(limitA!= null) {
            if (policyType == TC_DP3_Ext and (occupancy == typekey.DwellingOccupancyType_HOE.TC_TENANT or occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER)){
              if(state == TC_CA){
                defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovB_default)
              }
              if(state == TC_HI){
                defaultValue = limitA.multiply(ScriptParameters.HODwellingCovFactorCovB_min)
              }
            }
            else if(policyType == TC_DP3_Ext and state == TC_FL){
              defaultValue = null
            }
            else if(policyType == TC_DP3_Ext or policyType == TC_LPP_Ext or policyType == TC_TDP1_Ext or policyType == TC_TDP2_Ext or policyType == TC_TDP3_Ext){
            defaultValue = limitA.multiply(ScriptParameters.HODwellingCovDefaultFactorCovB_default)
             }

          }
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
    //var covE = this.Dwelling.DPDW_Additional_Living_Exp_HOE

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

      /*if (this.Dwelling.DPDW_Loss_Of_Use_HOEExists)
        covD.DPDW_LossOfUseDwelLimit_HOETerm.Value = MathUtil.roundTo(getDPDefaultLimitValue_Ext(covD), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, this.PolicyLine.BaseState, covD.DPDW_LossOfUseDwelLimit_HOETerm.PatternCode))
      */
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

      if (covD.HasHODW_LossOfUseDwelLimit_HOETerm)
        covD.HODW_LossOfUseDwelLimit_HOETerm.Value = MathUtil.roundTo(getDefaultLimitValue_Ext(covD), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, this.PolicyLine.BaseState, covD.HODW_LossOfUseDwelLimit_HOETerm.PatternCode))

      if(covC.HasHODW_PersonalPropertyLimit_HOETerm  and covC.HODW_PersonalPropertyLimit_HOETerm.Value != null){//is initial load change
        LineWizardStepHelper_Ext.setSpecialLimitsPersonalPropertyDefaults(this.Dwelling)
      }
    }
    else if(this typeis HODW_Personal_Property_HOE and limitC!= null) {
      covD.HODW_LossOfUseDwelLimit_HOETerm.Value = MathUtil.roundTo(getDefaultLimitValue_Ext(covD), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, this.PolicyLine.BaseState, covD.PatternCode))
    }}

  /**
    * Amrita Dash
    *   Change Log: Added the new function to validate the minimum and Maximum value of Other Structure,
    *  Personal Property and Loss of use coverages based on Dwelling Coverages
   */

  static function validateHomeownersMinMaxLimits_Ext(_dwelling:Dwelling_HOE):String{
    var limitC = roundDown_Ext(_dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value)

     var covB = _dwelling.HODW_Other_Structures_HOE
     var covC = _dwelling.HODW_Personal_Property_HOE
     var covD = _dwelling.HODW_Loss_Of_Use_HOE
     var minValueMapCovB = getHOMinValue_Ext(covB,_dwelling)
      var minValueCovB = minValueMapCovB.keySet()
      var maxValueMapCovB = getHOMaxValue_Ext(covB,_dwelling)
      var maxValueCovB = maxValueMapCovB.keySet()
      var minValueMapCovC = getHOMinValue_Ext(covC,_dwelling)
      var minValueCovC = minValueMapCovC.keySet()
      var maxValueMapCovC = getHOMaxValue_Ext(covC,_dwelling)
      var maxValueCovC = maxValueMapCovC.keySet()
      if(covB.HasHODW_OtherStructures_Limit_HOETerm and minValueMapCovB !=null and maxValueMapCovB != null){
               print("entered value for OS------:"+ covB.HODW_OtherStructures_Limit_HOETerm.Value)
              print("Min Value as per the Sheet---:"+ MathUtil.roundTo(minValueCovB.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, _dwelling.PolicyLine.BaseState, covB.HODW_OtherStructures_Limit_HOETerm.PatternCode)))
             if(covB.HODW_OtherStructures_Limit_HOETerm.Value < minValueCovB.first()){//MathUtil.roundTo(minValueCovB.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, _dwelling.PolicyLine.BaseState, covB.HODW_OtherStructures_Limit_HOETerm.PatternCode))){
              print("min value---:"+ minValueMapCovB.get(minValueCovB.first()))
               return minValueMapCovB.get(minValueCovB.first())
            }
            else if(covB.HODW_OtherStructures_Limit_HOETerm.Value > maxValueCovB.first())//MathUtil.roundTo(maxValueCovB.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, _dwelling.PolicyLine.BaseState, covB.HODW_OtherStructures_Limit_HOETerm.PatternCode)))
              {
                print("max value---:"+ maxValueMapCovB.get(maxValueCovB.first()))
              return maxValueMapCovB.get(maxValueCovB.first())
            }
      }
      if (covC.HasHODW_PersonalPropertyLimit_HOETerm and minValueMapCovC != null and maxValueMapCovC !=null){
          if(covC.HODW_PersonalPropertyLimit_HOETerm.Value < minValueCovC.first()){//MathUtil.roundTo(minValueCovC.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, _dwelling.PolicyLine.BaseState, covC.HODW_PersonalPropertyLimit_HOETerm.PatternCode))){
              return minValueMapCovC.get(minValueCovC.first())
          }
        else if (covC.HODW_PersonalPropertyLimit_HOETerm.Value > maxValueCovC.first()){//MathUtil.roundTo(maxValueCovC.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, _dwelling.PolicyLine.BaseState, covC.HODW_PersonalPropertyLimit_HOETerm.PatternCode))){
            return maxValueMapCovC.get(maxValueCovC.first())
          }
       }
    if(_dwelling.HODW_Personal_Property_HOEExists and limitC!= null){
      var minValueMapCovD = getHOMinValue_Ext(covD,_dwelling)
      var minValueCovD = minValueMapCovD.keySet()
      var maxValueMapCovD = getHOMaxValue_Ext(covD,_dwelling)
      var maxValueCovD = maxValueMapCovD.keySet()
      if (covD.HasHODW_LossOfUseDwelLimit_HOETerm and minValueMapCovD!=null and maxValueMapCovD!=null){
            if(covD.HODW_LossOfUseDwelLimit_HOETerm.Value < minValueCovD.first()){//MathUtil.roundTo(minValueCovD.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, _dwelling.PolicyLine.BaseState, covD.HODW_LossOfUseDwelLimit_HOETerm.PatternCode))){
              return minValueMapCovD.get(minValueCovD.first())
            }
            else if (covD.HODW_LossOfUseDwelLimit_HOETerm.Value > maxValueCovD.first()){//MathUtil.roundTo(maxValueCovD.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, _dwelling.PolicyLine.BaseState, covD.HODW_LossOfUseDwelLimit_HOETerm.PatternCode))){
              return maxValueMapCovD.get(maxValueCovD.first())
            }
      }
    }
    return null
  }

  /**
   * Amrita Dash
   *   Change Log: Added the new function to validate the minimum and Maximum value of DP Other Structure,
   *  Personal Property and Loss of use coverages based on Dwelling Coverages
   */

  static function validateDPMinMaxLimits_Ext(_dwelling:Dwelling_HOE):String{
    var covB = _dwelling.DPDW_Other_Structures_HOE
    var covC = _dwelling.DPDW_Personal_Property_HOE
    var covD = _dwelling.DPDW_Loss_Of_Use_HOE
      var minValueMapCovB = getDPMinValue_Ext(covB,_dwelling)
      var minValueCovB = minValueMapCovB.keySet()
      var minValueMapCovC = getDPMinValue_Ext(covC,_dwelling)
      var minValueCovC = minValueMapCovC.keySet()
      var minValueMapCovD = getDPMinValue_Ext(covD,_dwelling)
      var minValueCovD = minValueMapCovD.keySet()
      var maxValueMapCovB = getDPMaxValue_Ext(covB,_dwelling)
      var maxValueCovB = maxValueMapCovB.keySet()
      var maxValueMapCovC = getDPMaxValue_Ext(covC,_dwelling)
      var maxValueCovC = maxValueMapCovC.keySet()
      var maxValueMapCovD = getDPMaxValue_Ext(covD,_dwelling)
      var maxValueCovD = maxValueMapCovD.keySet()

      if(covB.HasDPDW_OtherStructuresLimit_HOETerm and minValueMapCovB!=null and maxValueMapCovB!=null){
          if(covB.DPDW_OtherStructuresLimit_HOETerm.Value < minValueCovB.first()){//MathUtil.roundTo(minValueCovB.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, _dwelling.PolicyLine.BaseState, covB.DPDW_OtherStructuresLimit_HOETerm.PatternCode))){
            return minValueMapCovB.get(minValueCovB.first())
          }
        else if(covB.DPDW_OtherStructuresLimit_HOETerm.Value > maxValueCovB.first()){//MathUtil.roundTo(maxValueCovB.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR,_dwelling.PolicyLine.BaseState, covB.DPDW_OtherStructuresLimit_HOETerm.PatternCode))){
            return maxValueMapCovB.get(maxValueCovB.first())
          }
      }
      if (covC.HasDPDW_PersonalPropertyLimit_HOETerm and minValueMapCovC!=null and maxValueMapCovC!=null){
          if(covC.DPDW_PersonalPropertyLimit_HOETerm.Value < minValueCovC.first()){//MathUtil.roundTo(minValueCovC.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, _dwelling.PolicyLine.BaseState, covC.DPDW_PersonalPropertyLimit_HOETerm.PatternCode))){
            return minValueMapCovC.get(minValueCovC.first())
          }
        else if(covC.DPDW_PersonalPropertyLimit_HOETerm.Value > maxValueCovC.first()){//MathUtil.roundTo(maxValueCovC.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, _dwelling.PolicyLine.BaseState, covC.DPDW_PersonalPropertyLimit_HOETerm.PatternCode))){
            return maxValueMapCovC.get(maxValueCovC.first())
          }
      }
      if (covD.HasDPDW_LossOfUseDwelLimit_HOETerm and minValueMapCovD!=null and maxValueMapCovD!= null){
          if(covD.DPDW_LossOfUseDwelLimit_HOETerm.Value < minValueCovD.first()){//MathUtil.roundTo(minValueCovD.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, _dwelling.PolicyLine.BaseState, covD.DPDW_LossOfUseDwelLimit_HOETerm.PatternCode))){
            return minValueMapCovD.get(minValueCovD.first())
          }
        else if(covD.DPDW_LossOfUseDwelLimit_HOETerm.Value > maxValueCovD.first()){//MathUtil.roundTo(maxValueCovD.first(), ConfigParamsUtil.getInt(TC_ROUNDINGFACTOR, _dwelling.PolicyLine.BaseState, covD.DPDW_LossOfUseDwelLimit_HOETerm.PatternCode))){
            return maxValueMapCovD.get(maxValueCovD.first())
            }
    }

    return null
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

  static function setSection1LimitDefault_Ext(_dwelling: Dwelling_HOE){

    if(_dwelling.Branch.BaseState == TC_CA or _dwelling.Branch.BaseState == TC_HI){
      _dwelling.HODW_FungiCov_HOE.HODW_FungiSectionILimit_HOETerm.setValueFromString("5000")
    }
    else{
      _dwelling.HODW_FungiCov_HOE.HODW_FungiSectionILimit_HOETerm.setValueFromString("10000")
    }

  }

  static function setSection1AggLimitDefault_Ext(_dwelling: Dwelling_HOE){

    if(_dwelling.Branch.BaseState == TC_CA or _dwelling.Branch.BaseState == TC_HI){
      _dwelling.HODW_FungiCov_HOE.HODW_FungiSectionII_HOETerm.setValueFromString("5000_Ext")
    }
    else{
      _dwelling.HODW_FungiCov_HOE.HODW_FungiSectionII_HOETerm.setValueFromString("10000")
    }

  }

  static function setVMFireDwellingDefault_Ext(_dwelling: Dwelling_HOE)
  {

    if (_dwelling.Branch.BaseState == TC_TX)
    {
      _dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm.setValueFromString("Actual")
    }
    else
    {
     _dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm.setValueFromString("Replacement")
    }
  }

  function setAddLivingLimitDefault_Ext(cov: DwellingCov_HOE){

    var limitA = roundDown_Ext(this.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value)
    var policyType = this.Dwelling.HOPolicyType
    var state = this.Branch.BaseState
    var defaultValue : BigDecimal
    var occupancy = this.Dwelling.Occupancy

    if (limitA != null and policyType == TC_DP3_Ext and occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER){
      if(state == TC_CA){
        this.Dwelling.DPDW_Additional_Living_Exp_HOE.DPDW_Additional_LivingExpLimit_HOETerm.setValueFromString("10")
      }
      else if(state == TC_HI){
        this.Dwelling.DPDW_Additional_Living_Exp_HOE.DPDW_Additional_LivingExpLimit_HOETerm.setValueFromString("20")
      }
    }
  }

  static function setSpecialLimitOptionCovTermDefault_Ext(_dwelling: Dwelling_HOE)
  {

    if (_dwelling.Branch.BaseState == TC_TX)
    {
      _dwelling.HODW_SpecialLimitsPP_HOE_Ext.HODW_JewelryWatchesFursLimit_HOETerm.setValueFromString("500")
      _dwelling.HODW_SpecialLimitsPP_HOE_Ext.HODW_MoneyLimit_HOETerm.setValueFromString("100")
    }
    else if(_dwelling.Branch.BaseState == TC_FL){
      _dwelling.HODW_SpecialLimitsPP_HOE_Ext.HODW_ElectronicApparatusLimit_HOETerm.setValueFromString("1000")
      _dwelling.HODW_SpecialLimitsPP_HOE_Ext.HODW_JewelryWatchesFursLimit_HOETerm.setValueFromString("1000")
    }
      else if(_dwelling.Branch.BaseState != TC_FL or _dwelling.Branch.BaseState != TC_TX )
    {
      _dwelling.HODW_SpecialLimitsPP_HOE_Ext.HODW_JewelryWatchesFursLimit_HOETerm.setValueFromString("1500")
      _dwelling.HODW_SpecialLimitsPP_HOE_Ext.HODW_MoneyLimit_HOETerm.setValueFromString("200")
      _dwelling.HODW_SpecialLimitsPP_HOE_Ext.HODW_ElectronicApparatusLimit_HOETerm.setValueFromString("1500")

    }
  }
  static function setBusinessProp_Ext(_dwelling:Dwelling_HOE){
    if(_dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value) {
      _dwelling.HODW_BusinessProperty_HOE_Ext.HODW_OnPremises_Limit_HOETerm.setValueFromString("10000")
    }
  }

}

