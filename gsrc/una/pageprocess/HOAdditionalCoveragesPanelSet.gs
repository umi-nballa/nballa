package una.pageprocess

uses gw.api.productmodel.CoveragePattern
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/25/16
 * Time: 8:41 AM
 * To change this template use File | Settings | File Templates.
 */
class HOAdditionalCoveragesPanelSet {
  private var _coverable : Coverable
  private var _coverageCategories : String[]

  construct(coverable : Coverable, coverageCategories : String[]){
    this._coverable = coverable
    this._coverageCategories = coverageCategories
  }

  public function onPick(patterns : java.util.List<CoveragePattern>){
    onPickLossAssessment(patterns.firstWhere( \ p -> p.CodeIdentifier == "HODW_LossAssessmentCov_HOE_Ext"))
  }

  private function onPickLossAssessment(coveragePattern : CoveragePattern){
    if(coveragePattern != null){
      (_coverable as Dwelling_HOE).HODW_LossAssessmentCov_HOE_Ext.setDefaults()
    }
  }
}