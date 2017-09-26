package gw.lob.ho.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.DwellingCov_HOEVersionList
uses gw.api.effdate.EffDatedUtil
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache

@Export
class DwellingCovCostData_HOE<T extends DwellingCovCost_HOE> extends HOCostData_HOE<T> {
  
  var _covID : Key
  var _costType : HOCostType_Ext

  construct(effDate : Date, expDate : Date, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key) {
    super(effDate, expDate, c, rateCache)
    assertKeyType(covID, DwellingCov_HOE)
    _covID = covID
  }

  construct(effDate : Date, expDate : Date, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, costType : HOCostType_Ext) {
    super(effDate, expDate, c, rateCache)
    assertKeyType(covID, DwellingCov_HOE)
    _covID = covID
    _costType = costType
  }

  construct(cost : T, rateCache : PolicyPeriodFXRateCache){
    super(cost, rateCache)
    _covID = cost.Coverage.FixedId
    _costType = cost.CostType
  }
  
  override function setSpecificFieldsOnCost(line : HomeownersLine_HOE, cost : T) {
    super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("DwellingCov", _covID)
    if(_costType != null)
      cost.CostType = _costType
  }

  override function getVersionedCosts(line : HomeownersLine_HOE) : List<EffDatedVersionList> {
    var covVL = EffDatedUtil.createVersionList(line.Branch, _covID) as DwellingCov_HOEVersionList
    var costs = covVL.Costs
    if(_costType != null){
      return costs.where( \ cost -> isMyCost(cost.AsOf(EffectiveDate)))
    }
    return costs
  }

  private function isMyCost(cost : DwellingCovCost_HOE) : boolean{
    return _costType == cost.CostType
  }

  override property get KeyValues() : List<Object> {
    if(_costType != null)
      return {_covID, _costType}
    return {_covID}  
  }
}
