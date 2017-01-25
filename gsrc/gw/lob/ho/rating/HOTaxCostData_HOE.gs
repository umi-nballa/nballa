package gw.lob.ho.rating

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache

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

  override function getVersionedCosts(line : HomeownersLine_HOE) : List<EffDatedVersionList> {
    return line.VersionList.HomeownersCosts.where(\ costVL -> costVL.AllVersions.first() typeis HOTaxCost_HOE).toList()
  }

  protected override property get KeyValues() : List<Object> {
    return {}
  }

}
