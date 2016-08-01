package una.pageprocess

uses gw.api.productmodel.ClausePattern
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/20/16
 * Time: 7:41 AM
 * To change this template use File | Settings | File Templates.
 */
class HOCoverageInputSet {
  private var _coveragePattern : ClausePattern
  private var _coverable : Coverable
  private var _openForEdit : boolean

  construct(coveragePattern : ClausePattern, coverable : Coverable, openForEdit : boolean){
    this._coveragePattern = coveragePattern
    this._coverable = coverable
    this._openForEdit = openForEdit
  }

  function onToggle(selected : boolean){
    _coverable.setCoverageConditionOrExclusionExists(_coveragePattern, selected)
    onToggleAdditionalPerilCoverage(selected)
  }

  private function onToggleAdditionalPerilCoverage(selected : boolean){
    if(_coverable typeis Dwelling_HOE){
      var dwelling = _coverable as Dwelling_HOE  //TODO tlv - either delete todo or code depending on oustanding questions to BA.

      if(selected
          and _coveragePattern.CodeIdentifier?.equalsIgnoreCase("HODW_AdditionalPerilCov_HOE_Ext")
          and dwelling.HOPolicyType == TC_HOA_Ext){
        _coverable.setCoverageExists("HODW_WaterBackUpSumpOverflow_HOE_Ext", selected)
      }
    }
  }
}