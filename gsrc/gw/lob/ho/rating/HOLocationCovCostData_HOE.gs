package gw.lob.ho.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.HomeownersLineCov_HOEVersionList
uses gw.api.effdate.EffDatedUtil
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache

@Export
class HOLocationCovCostData_HOE extends HomeownersCovCostData_HOE<HOLocationCovCost_HOE> {

  var _covID : Key
  var _locID : Key

  construct(effDate : Date, expDate : Date, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, locID : Key) {
    super(effDate, expDate, c, rateCache, covID)
    assertKeyType(covID, HomeownersLineCov_HOE)
    _covID = covID
    _locID = locID
  }
  
  override function setSpecificFieldsOnCost(line : HomeownersLine_HOE, cost : HOLocationCovCost_HOE) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("HomeownersLineCov", _covID)
    cost.setFieldValue("CoveredPolicyLocation", _locID)
  }

  override property get KeyValues() : List<Object> {
    return {_locID, _covID}
  }

  override function getVersionedCosts(line : HomeownersLine_HOE) : List<EffDatedVersionList> {
    var covVL = EffDatedUtil.createVersionList(line.Branch, _covID) as HomeownersLineCov_HOEVersionList
    return covVL.Costs.where(\ costVL -> isCostVersionListForLocation(costVL)).toList()
  }
  
  private function isCostVersionListForLocation(costVL : entity.windowed.HomeownersCovCost_HOEVersionList) : boolean {
    var firstVersion = costVL.AllVersions.first()
    return firstVersion typeis HOLocationCovCost_HOE and firstVersion.CoveredPolicyLocation.FixedId == _locID
  }
}
