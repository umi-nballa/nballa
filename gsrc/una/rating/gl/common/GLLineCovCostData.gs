package una.rating.gl.common

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses java.util.Date
uses gw.api.effdate.EffDatedUtil
uses entity.windowed.GeneralLiabilityCovVersionList
uses entity.windowed.GLCovCostVersionList
uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.gl.rating.GLCostData

@Export
class GLLineCovCostData extends GLCostData<GLLineCovCost> {

  var _covID : Key
  //var _basisScalable : boolean
  var _costType : GLCostType_Ext

  construct(effDate : DateTime, expDate : DateTime, __state : Jurisdiction, covID : Key,
            _subline : GLCostSubline, _splitType : GLCostSplitType, costType : GLCostType_Ext) {
    super(effDate, expDate, __state, _subline, _splitType)
    assertKeyType(covID, GeneralLiabilityCov)
    init(covID, costType)
  }

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache, __state : Jurisdiction,
            covID : Key, _subline : GLCostSubline, _splitType : GLCostSplitType, costType : GLCostType_Ext) {
    super(effDate, expDate, c, rateCache, __state, _subline, _splitType)
    assertKeyType(covID, GeneralLiabilityCov)
    init(covID, costType)
  }

  construct(cost : GLLineCovCost) {
    super(cost)
    init(cost.GeneralLiabilityCov.FixedId, cost.GLCostType)
  }

  construct(cost : GLLineCovCost, rateCache : PolicyPeriodFXRateCache) {
    super(cost, rateCache)
    init(cost.GeneralLiabilityCov.FixedId, cost.GLCostType)
  }

  private function init(covID : Key, costType : GLCostType_Ext) {
    _covID = covID
    _costType = costType
  }

  override function setSpecificFieldsOnCost(line : GeneralLiabilityLine, costEntity: GLLineCovCost ) : void {
    super.setSpecificFieldsOnCost(line, costEntity)
    costEntity.setFieldValue("GeneralLiabilityCov", _covID)
    costEntity.setFieldValue("GLCostType", _costType)
  }

  override function getVersionedCosts(line : GeneralLiabilityLine) : List<EffDatedVersionList> {
    var covVL = EffDatedUtil.createVersionList( line.Branch, _covID ) as GeneralLiabilityCovVersionList
    return covVL.Costs.where(\ costVL -> isCostVersionListForLineCovCost( costVL ))
  }

  private function isCostVersionListForLineCovCost(costVL : GLCovCostVersionList) : boolean {
    var v1 = costVL.AllVersions.first()
    if(v1 typeis GLLineCovCost){
      if(v1.GLCostType != null){
        return (this._covID == v1.GeneralLiabilityCov.FixedId and
                this._costType == v1.GLCostType)
      }
      return (this._covID == v1.Coverage.FixedId)
    }
    return v1 typeis GLLineCovCost
  }

  override function toString() : String {
    return "Cov: ${_covID} "
        + "StartDate: ${EffectiveDate} EndDate: ${ExpirationDate}"
  }

  override property get GLKeyValues() : List<Object> {
    if(_costType != null)
      return {_covID, _costType}
    return {_covID}
  }
  
  /*override property get MergeAsBasisScalable() : boolean {
    return _basisScalable  
  }*/
}
