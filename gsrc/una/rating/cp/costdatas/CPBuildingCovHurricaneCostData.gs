package una.rating.cp.costdatas

uses gw.lob.cp.rating.CPBuildingCovCostData
uses gw.financials.PolicyPeriodFXRateCache
uses gw.api.effdate.EffDatedUtil
uses entity.windowed.CPBuildingCovVersionList
uses entity.windowed.CPBuildingCovHurricaneCostVersionList

@Export
class CPBuildingCovHurricaneCostData extends CPBuildingCovCostData<CPBuildingCovHurricaneCost>
{
  var _costType : CPCostType_Ext as CostType

  construct(effDate : DateTime, expDate : DateTime, covID : Key, stateArg : Jurisdiction) {
    super(effDate, expDate, covID, stateArg)
  }

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, stateArg : Jurisdiction) {
    super(effDate, expDate, c, rateCache, covID, stateArg)
  }

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache, covID : Key, stateArg : Jurisdiction, costType : CPCostType_Ext) {
    super(effDate, expDate, c, rateCache, covID, stateArg)
    _costType = costType
  }

  construct(cost : CPBuildingCovHurricaneCost) {
    super(cost)
  }

  construct(cost : CPBuildingCovHurricaneCost, rateCache : PolicyPeriodFXRateCache) {
    super(cost, rateCache)
  }

  override function setSpecificFieldsOnCost(line : CommercialPropertyLine, cost : CPBuildingCovHurricaneCost) {
    super.setSpecificFieldsOnCost(line, cost)
    if(_costType != null)
      cost.CostType = _costType
  }

  override function toString() : String {
    return super.toString() + " Coverage : Hurricane"  // no need for i18n
  }

  override property get KeyValues() : List<Object> {
    if(CostType != null)
      return {this.CoverageID, CostType}
    return {this.CoverageID}
  }

  override function getVersionedCosts(line : CommercialPropertyLine) : List<gw.pl.persistence.core.effdate.EffDatedVersionList> {
    var covVL = EffDatedUtil.createVersionList( line.Branch, CoverageID ) as CPBuildingCovVersionList
    return covVL.Costs.whereTypeIs(CPBuildingCovHurricaneCostVersionList)
        .where(\ costVL -> isCostVersionListForThisCostData(costVL))
  }

  private function isCostVersionListForThisCostData(costVL : CPBuildingCovHurricaneCostVersionList) : boolean {
    var v1 = costVL.AllVersions.first()
    if(v1.CostType != null){
      return (this.CoverageID == v1.Coverage.FixedId and
          this.CostType == v1.CostType)
    }
    return (this.CoverageID == v1.Coverage.FixedId)
  }
}
