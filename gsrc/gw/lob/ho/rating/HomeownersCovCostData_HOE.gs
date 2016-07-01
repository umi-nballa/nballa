package gw.lob.ho.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.HomeownersLineCov_HOEVersionList
uses gw.api.effdate.EffDatedUtil
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache

@Export
class HomeownersCovCostData_HOE<T extends HomeownersCovCost_HOE> extends HOCostData_HOE<T> {
  
  var _covID : Key

  construct(effDate : Date, expDate : Date, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key) {
    super(effDate, expDate, c, rateCache)
    assertKeyType(covID, HomeownersLineCov_HOE)
    _covID = covID
  }

  construct(cost : T, rateCache : PolicyPeriodFXRateCache){
    super(cost, rateCache)
    _covID = cost.Coverage.FixedId
  }
  
  override function setSpecificFieldsOnCost(line : HomeownersLine_HOE, cost : T) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("HomeownersLineCov", _covID)
  }

  override function getVersionedCosts(line : HomeownersLine_HOE) : List<EffDatedVersionList> {
    var covVL = EffDatedUtil.createVersionList(line.Branch, _covID) as HomeownersLineCov_HOEVersionList
    return covVL.Costs
  }

  override property get KeyValues() : List<Object> {
    return {_covID}  
  }
}
