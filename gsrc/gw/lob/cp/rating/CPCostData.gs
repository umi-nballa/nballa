package gw.lob.cp.rating
uses gw.rating.CostDataWithOverrideSupport
uses gw.financials.PolicyPeriodFXRateCache
uses java.math.BigDecimal

@Export
abstract class CPCostData<T extends CPCost> extends CostDataWithOverrideSupport<T, CommercialPropertyLine> {

  var _premiumNoCTR_Ext : BigDecimal as PremiumNoCTR_Ext

  construct(effDate : DateTime, expDate : DateTime) {
    super(effDate, expDate)
  }

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache) {
    super(effDate, expDate, c, rateCache)
  }

  construct(cost : T) {
    super(cost)
  }

  construct(cost : T, rateCache : PolicyPeriodFXRateCache) {
    super(cost, rateCache)
    _premiumNoCTR_Ext = cost.PremiumNoCTR_Ext
  }

  override function setSpecificFieldsOnCost(line : CommercialPropertyLine, cost : T) {
    cost.setFieldValue("CommercialPropertyLine", line.FixedId)
    cost.setFieldValue("PremiumNoCTR_Ext", _premiumNoCTR_Ext)
  }
}
