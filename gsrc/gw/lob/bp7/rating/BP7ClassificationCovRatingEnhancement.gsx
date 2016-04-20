package gw.lob.bp7.rating
uses java.math.BigDecimal

enhancement BP7ClassificationCovRatingEnhancement : entity.BP7ClassificationCov {
  property get Basis() : BigDecimal {
    switch(typeof this) {
      case BP7ClassificationBusinessPersonalProperty :
        return this.BP7BusnPrsnlPropLimitTerm.Value
        
      default :
        throw "${typeof this} is not supported for rating on the classification."
    }
  }    
  
}
