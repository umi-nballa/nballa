package gw.lob.ho.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.DwellingCov_HOEVersionList
uses gw.api.effdate.EffDatedUtil
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache

@Export
class DwellingCovCostData_HOE<T extends DwellingCovCost_HOE> extends HOCostData_HOE<T> {
  
  var _covID : Key

  construct(effDate : Date, expDate : Date, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key) {
    super(effDate, expDate, c, rateCache)
    assertKeyType(covID, DwellingCov_HOE)
    _covID = covID
  }

  construct(cost : T, rateCache : PolicyPeriodFXRateCache){
    super(cost, rateCache)
    _covID = cost.Coverage.FixedId
  }
  
  override function setSpecificFieldsOnCost(line : HomeownersLine_HOE, cost : T) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("DwellingCov", _covID)
  }

  override function getVersionedCosts(line : HomeownersLine_HOE) : List<EffDatedVersionList> {
    var covVL = EffDatedUtil.createVersionList(line.Branch, _covID) as DwellingCov_HOEVersionList
    return covVL.Costs
  }

  override property get KeyValues() : List<Object> {
    return {_covID}  
  }
}
