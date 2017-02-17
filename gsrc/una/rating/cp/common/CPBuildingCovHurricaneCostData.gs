package una.rating.cp.common

uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.cp.rating.CPBuildingCovCostData

@Export
class CPBuildingCovHurricaneCostData extends CPBuildingCovCostData<CPBuildingCovHurricaneCost>
{
  construct(effDate : DateTime, expDate : DateTime, covID : Key, stateArg : Jurisdiction) {
    super(effDate, expDate, covID, stateArg)
  }

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, stateArg : Jurisdiction) {
    super(effDate, expDate, c, rateCache, covID, stateArg)
  }

  construct(cost : CPBuildingCovHurricaneCost) {
    super(cost)
  }

  construct(cost : CPBuildingCovHurricaneCost, rateCache : PolicyPeriodFXRateCache) {
    super(cost, rateCache)
  }

  override function setSpecificFieldsOnCost(line : CommercialPropertyLine, cost : CPBuildingCovHurricaneCost) {
    super.setSpecificFieldsOnCost(line, cost)
  }

  override function toString() : String {
    return super.toString() + " Coverage : Hurricane"  // no need for i18n
  }
}
