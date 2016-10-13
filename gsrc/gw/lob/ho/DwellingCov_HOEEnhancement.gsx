package gw.lob.ho
uses java.math.BigDecimal
uses gw.web.productmodel.LineWizardStepHelper_Ext
uses una.utils.MathUtil
uses una.config.ConfigParamsUtil
uses java.util.HashMap

enhancement DwellingCov_HOEEnhancement : entity.DwellingCov_HOE {

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
      case "DPDW_FairRentalValue_Ext":
          percentageOfDwellingLimit = dwelling.DPDW_FairRentalValue_Ext.DPDW_FairRentalValue_ExtTerm.Value
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
          limit = this.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value
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

  static function setAnimalLiabDefault_Ext(dwelling:Dwelling_HOE){
    var availableValues = dwelling.HOLine.HOLI_AnimalLiabilityCov_HOE_Ext.HOLI_AnimalLiabLimit_HOETerm.AvailableOptions.sort()
    dwelling.HOLine.HOLI_AnimalLiabilityCov_HOE_Ext.HOLI_AnimalLiabLimit_HOETerm.setOptionValue(availableValues.first())
  }
   /**
    * Amrita D Validated Individual and Total Values for Schedule Items as per the HO product Model Sheet
    */

  static function validateScheduleType_Ext(dwelling:Dwelling_HOE):String{
    var expValue1:int = 2500
    var expValue2:int = 5000
    var expValue3:int = 10000
    var expValue4:int = 25000
    var TotalExpValue: int = 50000
    var TotalExpValue1: int = 100000
    var  Item1=  calculateTotalExpValue(dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ScheduleType == typekey.ScheduleType_HOE.TC_COLLECTIBLES_EXT ))
    var  Item2=  calculateTotalExpValue(dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ScheduleType == typekey.ScheduleType_HOE.TC_GOLFEQUIPNOGOLFCARTS_EXT ))
    var  Item3=  calculateTotalExpValue(dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ScheduleType == typekey.ScheduleType_HOE.TC_GUNSSCHEDULED ))
    var  Item4=  calculateTotalExpValue(dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ScheduleType == typekey.ScheduleType_HOE.TC_POSTAGESTAMPS ))
    var  Item5=  calculateTotalExpValue(dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ScheduleType == typekey.ScheduleType_HOE.TC_RARECURRENTCOINS ))
    var  Item6=  calculateTotalExpValue(dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ScheduleType == typekey.ScheduleType_HOE.TC_SILVERWAREEXCLUDEPENPENSILS_EXT ))
    var  Item7=  calculateTotalExpValue(dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ScheduleType == typekey.ScheduleType_HOE.TC_FURSGARMENTSSCHEDULED_EXT ))
    var  Item8=  calculateTotalExpValue(dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ScheduleType == typekey.ScheduleType_HOE.TC_FINEARTS ))
    var  Item9=  calculateTotalExpValue(dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ScheduleType == typekey.ScheduleType_HOE.TC_MUSICALINSTRUMETSPERSONAL_EXT ))
    var  Item10=  calculateTotalExpValue(dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ScheduleType == typekey.ScheduleType_HOE.TC_JEWELRY ))
    var  Item11=  calculateTotalExpValue(dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ScheduleType == typekey.ScheduleType_HOE.TC_CAMERASPM_EXT ))
    var  Item12=  calculateTotalExpValue(dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ScheduleType == typekey.ScheduleType_HOE.TC_CAMERAPEPERSONAL_EXT ))

   for(schType in dwelling.HODW_ScheduledProperty_HOE.ScheduledItems) {

   if(dwelling.Branch.BaseState == TC_CA or dwelling.Branch.BaseState == TC_FL or dwelling.Branch.BaseState == TC_HI or dwelling.Branch.BaseState == TC_SC){
     if((schType.ScheduleType == typekey.ScheduleType_HOE.TC_COLLECTIBLES_EXT and schType.ExposureValue > expValue1)or
        (schType.ScheduleType == typekey.ScheduleType_HOE.TC_GOLFEQUIPNOGOLFCARTS_EXT and schType.ExposureValue > expValue1) or
        (schType.ScheduleType == typekey.ScheduleType_HOE.TC_GUNSSCHEDULED and schType.ExposureValue > expValue1)or
        (schType.ScheduleType == typekey.ScheduleType_HOE.TC_POSTAGESTAMPS and schType.ExposureValue > expValue1) or
        (schType.ScheduleType == typekey.ScheduleType_HOE.TC_RARECURRENTCOINS and schType.ExposureValue > expValue1)or
        (schType.ScheduleType == typekey.ScheduleType_HOE.TC_SILVERWAREEXCLUDEPENPENSILS_EXT and schType.ExposureValue > expValue1)){
        return displaykey.Web.Policy.HomeownersLine.Validation.ScheduleValue_Ext(expValue1,schType.ScheduleType.DisplayName)
     }
     else if (schType.ScheduleType == typekey.ScheduleType_HOE.TC_FURSGARMENTSSCHEDULED_EXT and schType.ExposureValue > expValue2){
        return displaykey.Web.Policy.HomeownersLine.Validation.ScheduleValue_Ext(expValue2,schType.ScheduleType.DisplayName)
     }
     else if ((schType.ScheduleType == typekey.ScheduleType_HOE.TC_FINEARTS and schType.ExposureValue > expValue3) or
              (schType.ScheduleType == typekey.ScheduleType_HOE.TC_MUSICALINSTRUMETSPERSONAL_EXT and schType.ExposureValue > expValue3) ){
         return displaykey.Web.Policy.HomeownersLine.Validation.ScheduleValue_Ext(expValue3,schType.ScheduleType.DisplayName)
       }
       else if (schType.ScheduleType == typekey.ScheduleType_HOE.TC_JEWELRY and schType.ExposureValue > expValue4){
           return displaykey.Web.Policy.HomeownersLine.Validation.ScheduleValue_Ext(expValue4,schType.ScheduleType.DisplayName)
         }
     }
     else if((dwelling.Branch.BaseState == TC_FL or dwelling.Branch.BaseState == TC_HI) and (schType.ScheduleType == typekey.ScheduleType_HOE.TC_CAMERASPM_EXT and schType.ExposureValue > expValue2)){
       return displaykey.Web.Policy.HomeownersLine.Validation.ScheduleValue_Ext(expValue2,schType.ScheduleType.DisplayName)
     }
   else if((dwelling.Branch.BaseState == TC_CA or dwelling.Branch.BaseState == TC_SC) and (schType.ScheduleType == typekey.ScheduleType_HOE.TC_CAMERAPEPERSONAL_EXT and schType.ExposureValue > expValue2)){
       return displaykey.Web.Policy.HomeownersLine.Validation.ScheduleValue_Ext(expValue2,schType.ScheduleType.DisplayName)
     }
    }
    if(Item10 > TotalExpValue1 and (dwelling.Branch.BaseState == TC_CA or dwelling.Branch.BaseState == TC_FL or dwelling.Branch.BaseState == TC_HI or dwelling.Branch.BaseState == TC_SC)){
      return displaykey.Web.Policy.HomeownersLine.Validation.TotalSchvalue_Ext
    }
    else if((Item1> TotalExpValue or Item2> TotalExpValue or Item3> TotalExpValue or Item4> TotalExpValue or Item5> TotalExpValue or
        Item6> TotalExpValue or Item7> TotalExpValue or Item8> TotalExpValue or Item9> TotalExpValue) and
        (dwelling.Branch.BaseState == TC_CA or dwelling.Branch.BaseState == TC_FL or dwelling.Branch.BaseState == TC_HI or dwelling.Branch.BaseState == TC_SC)){
      return displaykey.Web.Policy.HomeownersLine.Validation.TotalSchValue1_Ext
    }
    else if( Item11> TotalExpValue and (dwelling.Branch.BaseState == TC_FL or dwelling.Branch.BaseState == TC_HI)){
        return displaykey.Web.Policy.HomeownersLine.Validation.TotalSchValue1_Ext
       }
    else if(Item12> TotalExpValue and (dwelling.Branch.BaseState == TC_CA or dwelling.Branch.BaseState == TC_SC)) {
      return displaykey.Web.Policy.HomeownersLine.Validation.TotalSchValue1_Ext
    }
    return null
    }

  static function calculateTotalExpValue(scheduleItem : ScheduledItem_HOE[]):int {
      var sum : int  = 0
      for(sc in scheduleItem ) {
       sum =  sc.ExposureValue + sum
     }
   return sum
  }

  /*
*  Author: uim-svallabhapurapu
*  Unit Owners Rented cov default value (De445)
*  HO Line of business
*/
  public static function defaultValueUnitOwnersRentedDeductible(dwelling:Dwelling_HOE){
      if(dwelling.HODW_SectionI_Ded_HOEExists and dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null) {
            //dwelling.HOLine.HOLI_UnitOwnersRentedtoOthers_HOE_Ext.HOLI_UnitOwnersRentedOthers_Deductible_HOE_ExtTerm.Value = dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value
    }
  }

  /*
*  Author: uim-svallabhapurapu
*  Limited earthquake cov Limit default value(De159)
*  HO Line of business
*/
  public static function defaultValueLmtedEarthquakeCovALimit(dwelling:Dwelling_HOE){

    if(dwelling.HODW_Dwelling_Cov_HOEExists and dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm!=null) {
          dwelling.HODW_Limited_Earthquake_CA_HOE.HODW_EQDwellingLimit_HOE_ExtTerm.Value =  dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
    }

  }


}

