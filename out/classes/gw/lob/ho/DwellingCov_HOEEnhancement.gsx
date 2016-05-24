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
      case "DPDW_Loss_Of_Use_HOE":
        percentageOfDwellingLimit = dwelling.DPDW_Loss_Of_Use_HOE.DPDW_LossOfUseDwelLimit_HOETerm.Value
        return calculateDollarFromPercentage(dwelling.DwellingLimit, percentageOfDwellingLimit)
      case "DPDW_OrdinanceCov_HOE":
        percentageOfDwellingLimit = dwelling.DPDW_OrdinanceCov_HOE.DPDW_OrdinanceLimit_HOETerm.Value
        return calculateDollarFromPercentage(dwelling.DwellingLimit, percentageOfDwellingLimit)
      case "DPDW_Other_Structures_HOE":
        percentageOfDwellingLimit = dwelling.DPDW_Other_Structures_HOE.DPDW_OtherStructuresLimit_HOETerm.Value
        return calculateDollarFromPercentage(dwelling.DwellingLimit, percentageOfDwellingLimit)
      case "DPDW_Personal_Property_HOE":
        percentageOfDwellingLimit = dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value
        return calculateDollarFromPercentage(dwelling.DwellingLimit, percentageOfDwellingLimit)
      default: 
        return BigDecimal.ZERO
    }
  }
  
  private function dwellingCovLimitHO3() : BigDecimal {
    var limit : BigDecimal
    if(this.PatternCode == "HODW_Personal_Property_HOE"){
      var dwelling = this.Dwelling
      var percentageOfDwellingLimit = dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value
      limit = calculateDollarFromPercentage(dwelling.DwellingLimit, percentageOfDwellingLimit)
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
        var lossOfUseDwelLimitValue = calculateDollarFromPercentage(dwelling.DwellingLimit, percentageOfDwellingLimit)
        percentageOfPropertyLimit = dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUsePropLimit_HOETerm.Value
        var lossOfUsePropLimitValue = calculateDollarFromPercentage(dwelling.PersonalPropertyLimit, percentageOfPropertyLimit)
        return lossOfUseDwelLimitValue + lossOfUsePropLimitValue
      case "HODW_OrdinanceCov_HOE":
        percentageOfDwellingLimit = dwelling.HODW_OrdinanceCov_HOE.HODW_OrdinanceLimit_HOETerm.Value
        return calculateDollarFromPercentage(dwelling.DwellingLimit, percentageOfDwellingLimit)
      case "HODW_Other_Structures_HOE":
        percentageOfDwellingLimit = dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value
        return calculateDollarFromPercentage(dwelling.DwellingLimit, percentageOfDwellingLimit)
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
}
