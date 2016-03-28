package gw.lob.ho.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.DwellingCov_HOEVersionList
uses gw.api.effdate.EffDatedUtil
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache

@Export
class ScheduleByLocCovCostData_HOE extends DwellingCovCostData_HOE<ScheduleByLocCovCost_HOE> {
  
  var _covID : Key
  var _locID : Key
  construct(effDate : Date, expDate : Date, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, locID : Key) {
    super(effDate, expDate, c, rateCache, covID)
    _covID = covID
    _locID = locID
  }

  override function setSpecificFieldsOnCost(line : HomeownersLine_HOE, cost : ScheduleByLocCovCost_HOE) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("DwellingCov", _covID)
    cost.setFieldValue("SchedulePolicyLocation", _locID)
  }

  override property get KeyValues() : List<Object> {
    return {_locID, _covID}
  }

 override function getVersionedCosts(line : HomeownersLine_HOE) : List<EffDatedVersionList> {
    var covVL = EffDatedUtil.createVersionList(line.Branch, _covID) as DwellingCov_HOEVersionList
    return covVL.Costs.where(\ costVL -> isCostVersionListForLocation(costVL)).toList()
  }
  
  private function isCostVersionListForLocation(costVL : entity.windowed.DwellingCovCost_HOEVersionList) : boolean {
    var firstVersion = costVL.AllVersions.first()
    return firstVersion typeis ScheduleByLocCovCost_HOE and firstVersion.SchedulePolicyLocation.FixedId == _locID
  }
}
