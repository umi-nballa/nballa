package una.rating.ho.common

uses entity.windowed.HomeownersLineCost_EXTVersionList
uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.ho.rating.HOCostData_HOE
uses gw.pl.persistence.core.effdate.EffDatedVersionList

uses java.util.Date

@Export
class HomeownersLineCostData_HOE<T extends HomeownersLineCost_EXT> extends HOCostData_HOE<T> {
  var _costType_Ext: HOCostType_Ext as CostType_Ext
  construct(effDate: Date, expDate: Date, c: Currency, rateCache: PolicyPeriodFXRateCache, costType: HOCostType_Ext) {
    super(effDate, expDate, c, rateCache)
    _costType_Ext = costType
  }

  construct(c: T, rateCache: PolicyPeriodFXRateCache) {
    super(c, rateCache)
    _costType_Ext = c.HOCostType
  }

  override function setSpecificFieldsOnCost(line: HomeownersLine_HOE, cost: T) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.HOCostType = _costType_Ext
  }

  override function getVersionedCosts(line: HomeownersLine_HOE): List<EffDatedVersionList> {
    var hoCostsVLs = line.VersionList.HomeownersCosts
    return hoCostsVLs.whereTypeIs(HomeownersLineCost_EXTVersionList).where(\cost -> isMyCost(cost.AsOf(EffectiveDate)))
  }

  private function isMyCost(cost: HomeownersLineCost_EXT): boolean {
    return CostType_Ext == cost.HOCostType
  }

  override property get KeyValues(): List<Object> {
    return {CostType_Ext}
  }
}
