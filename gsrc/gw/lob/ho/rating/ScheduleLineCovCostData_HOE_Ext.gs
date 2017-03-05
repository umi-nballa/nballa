package gw.lob.ho.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.HomeownersLineCov_HOEVersionList
uses entity.windowed.HomeownersCovCost_HOEVersionList
uses gw.api.effdate.EffDatedUtil
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache

@Export
class ScheduleLineCovCostData_HOE_Ext extends HomeownersCovCostData_HOE<ScheduleLineCovCost_HOE_Ext> {
  
  var _covID : Key
  var _scheduleItemID : Key
  var _coveredLocationItem : Key
  construct(effDate : Date, expDate : Date, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, scheduleItemID : Key, coveredLocationItem : Key) {
    super(effDate, expDate, c, rateCache, covID)
    _covID = covID
    _scheduleItemID = scheduleItemID
    _coveredLocationItem = coveredLocationItem
  }

  construct(cost : ScheduleLineCovCost_HOE_Ext, rateCache : PolicyPeriodFXRateCache){
    super(cost, rateCache)
  }

  override function setSpecificFieldsOnCost(line : HomeownersLine_HOE, cost : ScheduleLineCovCost_HOE_Ext) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("HomeownersLineCov", _covID)
    cost.setFieldValue("LineScheduledItem", _scheduleItemID)
    cost.setFieldValue("CoveredLocationItem", _coveredLocationItem)
  }

  override property get KeyValues() : List<Object> {
    return {_scheduleItemID, _coveredLocationItem, _covID}
  }

  override function getVersionedCosts(line : HomeownersLine_HOE) : List<EffDatedVersionList> {
    var covVL = EffDatedUtil.createVersionList(line.Branch, _covID) as HomeownersLineCov_HOEVersionList
    return covVL.Costs.where(\ costVL -> isCostVersionListForItem(costVL)).toList()
  }
  
  private function isCostVersionListForItem(costVL : HomeownersCovCost_HOEVersionList) : boolean {
    var firstVersion = costVL.AllVersions.first()
    return firstVersion typeis ScheduleLineCovCost_HOE_Ext and firstVersion.LineScheduledItem?.FixedId == _scheduleItemID
           and firstVersion.CoveredLocationItem?.FixedId == _coveredLocationItem
  }
}
