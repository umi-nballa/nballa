package gw.lob.bp7.rating
uses java.math.BigDecimal

enhancement BP7LineCovRatingEnhancement : entity.BP7LineCov {
  
  property get EachOccurenceLimit() : BigDecimal {
    switch(typeof this) {
      case BP7BusinessLiability :
        return this.BP7EachOccLimitTerm.Value
        
      default :
        throw "Each Occurence Limit is not supported for rating on ${typeof this}."
    }
  }
  
  property get ProdsCompldOpsAggregateLimit() : BigDecimal {
    switch(typeof this) {
      case BP7BusinessLiability :
        return this.BP7ProdCompldOpsAggregateLimitTerm.Value
        
      default :
        throw "Products Completed Ops Aggregate Limit is not supported for rating on ${typeof this}."
    }
  }
  
  property get GeneralAggregateLimit() : BigDecimal {
    switch(typeof this) {
      case BP7BusinessLiability :
        return this.BP7AggregateLimitTerm.Value
        
      default :
        throw "General Aggregate Limit is not supported for rating on ${typeof this}."
    }
  }
}
