package gw.lob.ho.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.HomeownersLine_HOEVersionList
uses gw.api.effdate.EffDatedUtil
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache

@Export
class HomeownersBaseCostData_HOE extends HOCostData_HOE<HomeownersBaseCost_HOE> {

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache) {
    super(effDate, expDate, c, rateCache)
  }
  
  override function setSpecificFieldsOnCost( line : HomeownersLine_HOE, cost : HomeownersBaseCost_HOE) {
    cost.setFieldValue("HomeownersLine", line.FixedId)
  }

  override property get KeyValues() : List<Object> {
    return {}
  }

  override function getVersionedCosts(line : HomeownersLine_HOE) : List<EffDatedVersionList> {
    var lineVL = EffDatedUtil.createVersionList(line.Branch, line.ID) as HomeownersLine_HOEVersionList
    return lineVL.HomeownersCosts.where(\cvl -> cvl.AllVersions.first() typeis HomeownersBaseCost_HOE)
  }

}
