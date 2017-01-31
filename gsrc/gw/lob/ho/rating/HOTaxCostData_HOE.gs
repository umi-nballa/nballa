package gw.lob.ho.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache
uses entity.windowed.HOTaxCost_HOEVersionList

@Export
class HOTaxCostData_HOE extends HOCostData_HOE<HOTaxCost_HOE>  {

  construct(effDate : Date, expDate : Date, c : Currency, rateCache : PolicyPeriodFXRateCache) {
    super(effDate, expDate, c, rateCache)
    RateAmountType = "TaxSurcharge"
    ChargePattern = "Taxes"
  }

  construct(effDate : Date, expDate : Date, c : Currency, rateCache : PolicyPeriodFXRateCache, chargePatternType : ChargePattern) {
    super(effDate, expDate, c, rateCache)
    RateAmountType = "TaxSurcharge"
    ChargePattern = chargePatternType
  }

  construct(cost : HOTaxCost_HOE, rateCache : PolicyPeriodFXRateCache){
    super(cost, rateCache)
  }

  override function getVersionedCosts(line : HomeownersLine_HOE) : List<EffDatedVersionList> {
    var homeownersCosts = line.VersionList.HomeownersCosts.whereTypeIs(HOTaxCost_HOEVersionList)
    return homeownersCosts.where( \ vl -> versionListMatches(vl)).toList()
    //return line.VersionList.HomeownersCosts.where(\ costVL -> costVL.AllVersions.first() typeis HOTaxCost_HOE).toList()
  }

  private function versionListMatches(costVL : HOTaxCost_HOEVersionList) : boolean {
    var first = costVL.AllVersions.first()
    return first typeis HOTaxCost_HOE and first.ChargePattern == ChargePattern
  }

  protected override property get KeyValues() : List<Object> {
    return {ChargePattern}
  }

}
