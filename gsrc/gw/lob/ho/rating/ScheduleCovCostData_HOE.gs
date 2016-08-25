package gw.lob.ho.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.DwellingCov_HOEVersionList
uses gw.api.effdate.EffDatedUtil
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache

@Export
class ScheduleCovCostData_HOE extends DwellingCovCostData_HOE<ScheduleCovCost_HOE> {
  
  var _covID : Key
  var _itemID : Key
  construct(effDate : Date, expDate : Date, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, itemID : Key) {
    super(effDate, expDate, c, rateCache, covID)
    _covID = covID
    _itemID = itemID
  }

  construct(cost : ScheduleCovCost_HOE, rateCache : PolicyPeriodFXRateCache){
    super(cost, rateCache)
  }

  override function setSpecificFieldsOnCost(line : HomeownersLine_HOE, cost : ScheduleCovCost_HOE) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("DwellingCov", _covID)
    cost.setFieldValue("ScheduledItem", _itemID)
  }

  override property get KeyValues() : List<Object> {
    return {_itemID, _covID}
  }

  override function getVersionedCosts(line : HomeownersLine_HOE) : List<EffDatedVersionList> {
    var covVL = EffDatedUtil.createVersionList(line.Branch, _covID) as DwellingCov_HOEVersionList
    return covVL.Costs.where(\ costVL -> isCostVersionListForItem(costVL)).toList()
  }
  
  private function isCostVersionListForItem(costVL : entity.windowed.DwellingCovCost_HOEVersionList) : boolean {
    var firstVersion = costVL.AllVersions.first()
    return firstVersion typeis ScheduleCovCost_HOE and firstVersion.ScheduledItem.FixedId == _itemID
  }
}
