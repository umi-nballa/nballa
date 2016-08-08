package gw.lob.ho.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.HomeownersLine_HOEVersionList
uses gw.api.effdate.EffDatedUtil
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache

@Export
class HomeownersBaseCostData_HOE extends HOCostData_HOE<HomeownersBaseCost_HOE> {

  var _costType : HOCostType_Ext as CostType

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache, costType : HOCostType_Ext) {
    super(effDate, expDate, c, rateCache)
    _costType = costType
  }

  construct(cost : HomeownersBaseCost_HOE, rateCache : PolicyPeriodFXRateCache){
    super(cost, rateCache)
    _costType = cost.HOCostType
  }
  
  override function setSpecificFieldsOnCost( line : HomeownersLine_HOE, cost : HomeownersBaseCost_HOE) {
    cost.setFieldValue("HomeownersLine", line.FixedId)
    cost.HOCostType = _costType
  }

  override property get KeyValues() : List<Object> {
    return {CostType}
  }

  override function getVersionedCosts(line : HomeownersLine_HOE) : List<EffDatedVersionList> {
    var lineVL = EffDatedUtil.createVersionList(line.Branch, line.ID) as HomeownersLine_HOEVersionList
    var hoBaseCosts = lineVL.HomeownersCosts.where(\cvl -> cvl.AllVersions.first() typeis HomeownersBaseCost_HOE)
    return hoBaseCosts.where( \ cost -> isMyCost(cost.AsOf(EffectiveDate) as HomeownersBaseCost_HOE))
  }

  private function isMyCost(cost : HomeownersBaseCost_HOE) : boolean{
    return CostType == cost.HOCostType
  }

}
