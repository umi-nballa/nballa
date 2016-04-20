package gw.lob.ho

uses gw.pl.persistence.core.Bundle
uses java.math.BigDecimal

enhancement HomeownersLineCovEnhancement_HOE : entity.HomeownersLineCov_HOE {
  
  function addCoveredLocation(location: CoveredLocation_HOE){
    this.addToCoveredLocations(location)
    this.CoveredLocationAutoNumberSeq.number(location, this.CoveredLocations, CoveredLocation_HOE.Type.TypeInfo.getProperty("LocationNumber"))
  }
  
  function removeCoveredLocation(location: CoveredLocation_HOE) {
    this.removeFromCoveredLocations(location)
    renumberCoveredLocations()
  }
  
  function cloneCoveredLocationAutoNumberSequence() {
    this.CoveredLocationAutoNumberSeq = this.CoveredLocationAutoNumberSeq.clone( this.Bundle )
  }
  
  function resetCoveredLocationAutoNumberSequence() {
    this.CoveredLocationAutoNumberSeq.reset()
    renumberCoveredLocations()
  }
  
  function bindCoveredLocationAutoNumberSequence() {
    renumberCoveredLocations()
    this.CoveredLocationAutoNumberSeq.bind( this.CoveredLocations, CoveredLocation_HOE.Type.TypeInfo.getProperty("LocationNumber"))
  }
  
  function initializeCoveredLocationAutoNumberSequence(bundle : Bundle) {  
    this.CoveredLocationAutoNumberSeq = new AutoNumberSequence(bundle)
  }
  
  private function renumberCoveredLocations() {
    this.CoveredLocationAutoNumberSeq.renumber(this.CoveredLocations, CoveredLocation_HOE.Type.TypeInfo.getProperty("LocationNumber") )
  }
  
  property get CoverageLimit() : BigDecimal {
   var limit : BigDecimal 
    switch(this.HOLine.HOPolicyType){
      case HOPolicyType_HOE.TC_DP2:
        limit = hOLineCovLimitDP2()
        break
      case HOPolicyType_HOE.TC_HO3:
      case HOPolicyType_HOE.TC_HO4:
      case HOPolicyType_HOE.TC_HO6:
        limit = hOLineCovLimitHO()
        break
    }
    return limit
  }

  private function hOLineCovLimitDP2() : BigDecimal {
    var hoLine = this.HOLine

    switch (this.PatternCode){
      case "DPLI_Personal_Liability_HOE":
        return hoLine.DPLI_Personal_Liability_HOE.DPLI_LiabilityLimit_HOETerm.Value
      case "DPLI_Med_Pay_HOE":
        return hoLine.DPLI_Med_Pay_HOE.DPLI_MedPay_Limit_HOETerm.Value
      default:
        return BigDecimal.ZERO
    }
  }

  private function hOLineCovLimitHO() : BigDecimal {
    var hoLine = this.HOLine

    switch (this.PatternCode){
      case "HOLI_Personal_Liability_HOE":
        return hoLine.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value
      case "HOLI_Med_Pay_HOE":
        return hoLine.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm.Value
      default:
        return BigDecimal.ZERO
    }
  }
}
