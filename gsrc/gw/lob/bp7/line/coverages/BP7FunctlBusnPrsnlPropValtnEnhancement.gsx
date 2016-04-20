package gw.lob.bp7.line.coverages

uses java.lang.Integer
uses java.math.BigDecimal

enhancement BP7FunctlBusnPrsnlPropValtnEnhancement : productmodel.BP7FunctlBusnPrsnlPropValtn {
  property get TotalLimit() : BigDecimal {
    var totalLimit = Integer.valueOf(0)
    this.ScheduledItems.each( \ item -> { totalLimit += item.getFieldValue(BP7ScheduledItem#NonNegativeInt2.PropertyInfo.toString()) as Integer })

    return totalLimit
  }
}
