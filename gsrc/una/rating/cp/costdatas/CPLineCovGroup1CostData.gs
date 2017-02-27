package una.rating.cp.costdatas

uses gw.financials.PolicyPeriodFXRateCache

@Export
class CPLineCovGroup1CostData extends CPLineCovCostData<CPLineCovGrp1Cost>
{

  construct(effDate : DateTime, expDate : DateTime, covID : Key, stateArg : Jurisdiction) {
    super(effDate, expDate, covID, stateArg)
  }

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, stateArg : Jurisdiction) {
    super(effDate, expDate, c, rateCache, covID, stateArg)
  }

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, stateArg : Jurisdiction, costType : CPCostType_Ext) {
    super(effDate, expDate, c, rateCache, covID, stateArg)
  }

  construct(cost : CPLineCovGrp1Cost) {
    super(cost)
  }

  construct(cost : CPLineCovGrp1Cost, rateCache : PolicyPeriodFXRateCache) {
    super(cost, rateCache)
  }

  override function setSpecificFieldsOnCost(line : CommercialPropertyLine, cost : CPLineCovGrp1Cost) {
    super.setSpecificFieldsOnCost(line, cost)
  }

  override function toString() : String {
    return super.toString() + " Coverage : Group I"  // no need for i18n
  }
}
