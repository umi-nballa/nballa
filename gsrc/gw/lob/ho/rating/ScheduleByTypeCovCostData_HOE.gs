package gw.lob.ho.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.DwellingCov_HOEVersionList
uses gw.api.effdate.EffDatedUtil
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache

@Export
class ScheduleByTypeCovCostData_HOE extends DwellingCovCostData_HOE<ScheduleByTypeCovCost_HOE> {

  var _covID : Key
  var _thetype : typekey.ScheduleType_HOE
  construct(effDate : Date, expDate : Date, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, thetype : typekey.ScheduleType_HOE) {
    super(effDate, expDate, c, rateCache, covID)
    _covID = covID
    _thetype = thetype
  }

  override function setSpecificFieldsOnCost(line : HomeownersLine_HOE, cost : ScheduleByTypeCovCost_HOE) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("DwellingCov", _covID)
    cost.setFieldValue("ScheduleType", _thetype)
  }

  override property get KeyValues() : List<Object> {
    return {_thetype, _covID}
  }

  override function getVersionedCosts(line : HomeownersLine_HOE) : List<EffDatedVersionList> {
    var covVL = EffDatedUtil.createVersionList(line.Branch, _covID) as DwellingCov_HOEVersionList
    return covVL.Costs.where(\ costVL -> isCostVersionListForType(costVL)).toList()
  }

  private function isCostVersionListForType(costVL : entity.windowed.DwellingCovCost_HOEVersionList) : boolean {
    var firstVersion = costVL.AllVersions.first()
    return firstVersion typeis ScheduleByTypeCovCost_HOE and firstVersion.ScheduleType == _thetype
  }
}

