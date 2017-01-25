package gw.lob.bp7.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.BP7TaxCost_ExtVersionList
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache
uses gw.rating.CostDataWithOverrideSupport

class BP7TaxCostData_Ext extends CostDataWithOverrideSupport<BP7TaxCost_Ext, BP7Line> {

  var _chargePattern : ChargePattern
  var _state : Jurisdiction

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache, taxState : Jurisdiction, chargePattern : ChargePattern) {
    super(effDate, expDate, c, rateCache)
    RateAmountType = "TaxSurcharge"
    _chargePattern = chargePattern
    _state = taxState
  }

  construct(c : BP7TaxCost_Ext){
    super(c)
  }

  override function setSpecificFieldsOnCost(line : BP7Line, cost : BP7TaxCost_Ext) {
    //super.setSpecificFieldsOnCost(line, cost)
    cost.setFieldValue("Line", line.FixedId)
    cost.ChargePattern = _chargePattern
    cost.stateTax      = _state
  }

  override function getVersionedCosts(line : BP7Line) : List<EffDatedVersionList> {
    var bp7TaxCosts = line.VersionList.BP7Costs.whereTypeIs(BP7TaxCost_ExtVersionList)
    return bp7TaxCosts.where( \ vl -> versionListMatches(vl)).toList()
  }

  private function versionListMatches(costVL : BP7TaxCost_ExtVersionList) : boolean {
    var first = costVL.AllVersions.first()
    return first typeis BP7TaxCost_Ext and first.stateTax == _state and first.ChargePattern == _chargePattern
  }
  override property get KeyValues(): List<Object> {
    return {_state, _chargePattern}
  }
}