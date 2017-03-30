package gw.lob.bp7.rating

uses gw.rating.CostDataWithOverrideSupport
uses gw.lob.common.util.DateRange
uses gw.financials.PolicyPeriodFXRateCache
uses java.math.BigDecimal

abstract class BP7CostData<R extends BP7Cost> extends CostDataWithOverrideSupport<R, BP7Line> {

  private var _coverageID : Key
  private var _coverableID : Key
  var _premiumNoCTR_Ext : BigDecimal as PremiumNoCTR_Ext
  var _actualCalculatedTermAmount_Ext : BigDecimal as ActualCalculatedTermAmount_Ext

  construct(coverage : Key,
            coverable : Key,
            sliceRange : DateRange) {
    super(sliceRange.start, sliceRange.end)
    _coverageID = coverage
    _coverableID = coverable
  }

  construct(effDate : DateTime, expDate : DateTime, asRatedCurrency : Currency, rateCache : PolicyPeriodFXRateCache) {
    super(effDate, expDate, asRatedCurrency, rateCache)
  }

  construct(cost : R, rateCache : PolicyPeriodFXRateCache) {
    super(cost, rateCache)
  }

  construct(c : R) {
    super(c)
    _coverageID = c.Coverage.FixedId
    _coverableID = c.Coverable.FixedId
    _actualCalculatedTermAmount_Ext = c.ActualCalculatedTermAmount_Ext
    _premiumNoCTR_Ext = c.PremiumNoCTR_Ext
  }
  
  override function setSpecificFieldsOnCost(line : BP7Line, cost : R) {
    cost.setFieldValue("Line", line.FixedId)
    cost.setFieldValue("PremiumNoCTR_Ext", _premiumNoCTR_Ext)
    cost.setFieldValue("ActualCalculatedTermAmount_Ext", _actualCalculatedTermAmount_Ext)
  }

  protected override property get KeyValues() : List<Object> {
    return {_coverableID, _coverageID}
  }

  protected property get CoverageID() : Key {
    return _coverageID
  }

  protected property get CoverableID() : Key {
    return _coverableID
  }
  
  override function toString() : String {
    return "Coverage: ${_coverageID} Covered Item: ${_coverableID}"
  }
}