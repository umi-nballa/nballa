package gw.lob.ho
uses java.math.BigDecimal
uses gw.pl.persistence.core.Bundle
uses una.config.ConfigParamsUtil
uses java.lang.Double
uses java.lang.StringBuffer

enhancement DwellingCov_HOEEnhancement : entity.DwellingCov_HOE {
  function addScheduledItem(item: ScheduledItem_HOE){
    this.addToScheduledItems(item)
    this.ScheduledItemAutoNumberSeq.number(item, this.ScheduledItems, ScheduledItem_HOE.Type.TypeInfo.getProperty("ItemNumber"))
  }

  function removeScheduledItem(item: ScheduledItem_HOE) {
    this.removeFromScheduledItems(item)
    renumberScheduledItems()
  }

  function cloneScheduledItemAutoNumberSequence() {
    this.ScheduledItemAutoNumberSeq = this.ScheduledItemAutoNumberSeq.clone( this.Bundle )
  }

  function resetScheduledItemAutoNumberSequence() {
    this.ScheduledItemAutoNumberSeq.reset()
    renumberScheduledItems()
  }

  function bindScheduledItemAutoNumberSequence() {
    renumberScheduledItems()
    this.ScheduledItemAutoNumberSeq.bind( this.ScheduledItems, ScheduledItem_HOE.Type.TypeInfo.getProperty("ItemNumber"))
  }

  function initializeScheduledItemAutoNumberSequence(bundle : Bundle) {
    this.ScheduledItemAutoNumberSeq = new AutoNumberSequence(bundle)
  }

  public function renumberScheduledItems() {
    this.ScheduledItemAutoNumberSeq.renumber(this.ScheduledItems, ScheduledItem_HOE.Type.TypeInfo.getProperty("ItemNumber") )
  }

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

  static function validateScheduleType_Ext(dwelling:Dwelling_HOE): String{

    var resultBuffer = new StringBuffer()

    for(scheduleItem in dwelling.HODW_ScheduledProperty_HOE.ScheduledItems ) {
      var exposureValue = scheduleItem.ExposureValue
      var maxValidExposureValue = ConfigParamsUtil.getInt(TC_scheduleExposureMaxValue, dwelling.HOLine.BaseState,scheduleItem.ScheduleType.Code)
      var minValidExposureValue = ConfigParamsUtil.getInt(TC_scheduleExposureMinValue, dwelling.HOLine.BaseState,scheduleItem.ScheduleType.Code)

      if(exposureValue> maxValidExposureValue) {
        resultBuffer.append(displaykey.Web.Policy.HomeownersLine.Validation.ScheduleValue_Ext(new Double(maxValidExposureValue as double).asMoney(),scheduleItem.ScheduleType.DisplayName))
        resultBuffer.append("\n")
      }
      else if(exposureValue != null and exposureValue < minValidExposureValue){
        resultBuffer.append(displaykey.Web.Policy.HomeownersLine.Validation.ScheduleItemMin_Ext(new Double(maxValidExposureValue as double).asMoney(),scheduleItem.ScheduleType.DisplayName))
        resultBuffer.append("\n")
      }
    }
    var exposureMap = dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.partition( \ schItem -> schItem.ScheduleType )
    exposureMap.eachKey( \ scheduleType -> {
      var totalCalculateExpValue = exposureMap.get(scheduleType).where( \ item -> item.ExposureValue != null).sum( \ schItem -> schItem.ExposureValue)
      var maxValidTotalExposureValue = ConfigParamsUtil.getInt(TC_totalscheduleExposureMaxValue, dwelling.HOLine.BaseState,scheduleType.Code)
      if(totalCalculateExpValue> maxValidTotalExposureValue){
        resultBuffer.append(displaykey.Web.Policy.HomeownersLine.Validation.TotalSchvalue_Ext(scheduleType.DisplayName,new Double(maxValidTotalExposureValue as double).asMoney()))
      }
      })
    return  (resultBuffer.length() > 0) ? resultBuffer.toString() : null
  }

}

