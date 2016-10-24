package gw.lob.ho
uses java.math.BigDecimal

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
}

