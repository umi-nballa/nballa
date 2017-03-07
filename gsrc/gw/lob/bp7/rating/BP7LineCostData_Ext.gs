package gw.lob.bp7.rating

uses entity.windowed.BP7LineCost_ExtVersionList
uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses gw.lob.common.util.DateRange
uses gw.financials.PolicyPeriodFXRateCache

@Export
class BP7LineCostData_Ext extends BP7CostData<BP7LineCost_Ext> {

  var _costType : BP7CostType_Ext as CostType

  construct( sliceRange : DateRange, c: Currency, rateCache: PolicyPeriodFXRateCache, costType: BP7CostType_Ext) {
    super(sliceRange.start, sliceRange.end, c, rateCache)
    _costType = costType
  }
  construct(lineCov : Coverage, sliceRange : DateRange) {
    super(lineCov.FixedId, lineCov.OwningCoverable.FixedId, sliceRange )
    assertKeyType(CoverableID, BP7BusinessOwnersLine)
    assertKeyType(CoverageID, BP7LineCov)
  }

  construct(cost : BP7LineCost_Ext, rateCache: PolicyPeriodFXRateCache) {
    super(cost, rateCache)
  }

  override function setSpecificFieldsOnCost(line : BP7Line, cost : BP7LineCost_Ext) {
    super.setSpecificFieldsOnCost(line, cost)
    if(_costType != null)
      cost.BP7CostType = _costType
  }

  override function getVersionedCosts(line : BP7Line) : List<EffDatedVersionList> {
    var bp7CostsVLs = line.VersionList.BP7Costs
    return bp7CostsVLs.whereTypeIs(BP7LineCost_ExtVersionList).where(\cost -> isMyCost(cost.AsOf(EffectiveDate)))
  }

  private function isMyCost(cost: BP7LineCost_Ext): boolean {
    return _costType == cost.BP7CostType
  }

  override property get KeyValues(): List<Object> {
    return {_costType}
  }
}