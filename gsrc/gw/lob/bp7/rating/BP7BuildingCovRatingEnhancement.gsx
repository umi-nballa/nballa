package gw.lob.bp7.rating
uses java.math.BigDecimal

enhancement BP7BuildingCovRatingEnhancement : entity.BP7BuildingCov {
  
  property get Basis() : BigDecimal {
    switch(typeof this) {
      case BP7Structure :
        return this.BP7BuildingLimitTerm.Value
        
      default :
        throw "${typeof this} is not supported for rating on the building."
    }
  }    
}
