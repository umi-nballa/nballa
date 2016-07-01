package gw.lob.ho.rating
uses gw.financials.PolicyPeriodFXRateCache
uses gw.rating.CostDataWithOverrideSupport

@Export
abstract class HOCostData_HOE<T extends HomeownersCost_HOE> extends CostDataWithOverrideSupport<T, HomeownersLine_HOE> {
  
  construct(effDate : DateTime, expDate : DateTime, asRatedCurrency : Currency, rateCache : PolicyPeriodFXRateCache) {
    super(effDate, expDate, asRatedCurrency, rateCache)
  }
  
  override function setSpecificFieldsOnCost( line : HomeownersLine_HOE, cost : T) {
    cost.setFieldValue("HomeownersLine", line.FixedId)
  }

  construct(cost : T, rateCache : PolicyPeriodFXRateCache) {
    super(cost, rateCache)
  }
}
