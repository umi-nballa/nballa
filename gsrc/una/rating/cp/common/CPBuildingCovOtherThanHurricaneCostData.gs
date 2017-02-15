package una.rating.cp.common

uses gw.lob.cp.rating.CPBuildingCovCostData
uses java.util.Date
uses gw.financials.PolicyPeriodFXRateCache

@Export
class CPBuildingCovOtherThanHurricaneCostData extends CPBuildingCovCostData<CPBuildingCovOtherThanHurricaneCost>
{
  construct(effDate : DateTime, expDate : DateTime, covID : Key, stateArg : Jurisdiction) {
    super(effDate, expDate, covID, stateArg)
  }

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, stateArg : Jurisdiction) {
    super(effDate, expDate, c, rateCache, covID, stateArg)
  }

  construct(cost : CPBuildingCovOtherThanHurricaneCost) {
    super(cost)
  }

  construct(cost : CPBuildingCovOtherThanHurricaneCost, rateCache : PolicyPeriodFXRateCache) {
    super(cost, rateCache)
  }

  override function setSpecificFieldsOnCost(line : CommercialPropertyLine, cost : CPBuildingCovOtherThanHurricaneCost) {
    super.setSpecificFieldsOnCost(line, cost)
  }

  override function toString() : String {
    return super.toString() + " Coverage : Other Than Hurricane"  // no need for i18n
  }
}
