package gw.lob.bp7.rating
uses gw.lob.common.schedules.ScheduleConfigSource
uses gw.lob.bp7.service.BP7ServiceLocator
uses java.lang.Integer
uses java.math.BigDecimal

enhancement BP7ClassificationRatingEnhancement : entity.BP7Classification {
  
  property get ExposureBasisCode() : String {
    return this.ExposureBasis.Code
  }
  
  property get FunctionalValuationTotalLimit() : Integer {
    if (not this.BP7FunctlBusnPrsnlPropValtnExists) return null
    
    var items = this.BP7FunctlBusnPrsnlPropValtn.ScheduledItems
    var locator = BP7ServiceLocator.get(ScheduleConfigSource)
    return items.sum(\ item -> locator.getScheduledItemValueProvider<Integer>("Limit", item).Value)
  }
  
  property get SumOfBPPAndFunctionalValuationLimits() : BigDecimal {
    var sum = 0bd
    sum += this.BPPLimit ?: 0
    sum += this.FunctionalValuationTotalLimit ?: 0
    return sum
  }
}
