package una.pageprocess

uses gw.api.productmodel.ClausePattern
uses gw.api.domain.covterm.CovTerm
uses una.config.ConfigParamsUtil
uses gw.api.domain.covterm.DirectCovTerm
uses una.utils.MathUtil

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/22/16
 * Time: 3:00 PM
 * To change this template use File | Settings | File Templates.
 */
class CovTermInputSet {
  private var _covTerm : CovTerm
  private var _openForEdit : boolean

  construct(covTerm : CovTerm, openForEdit : boolean){
    this._covTerm = covTerm
    this._openForEdit = openForEdit
  }

  public function onChange(){
    roundValue()
  }

  private function roundValue(){
    if(_covTerm typeis DirectCovTerm){
      var roundingFactor = ConfigParamsUtil.getInt(TC_RoundingFactor, null, _covTerm.PatternCode)
      var patternCode = _covTerm.PatternCode

      if(roundingFactor != null){
        _covTerm.Value = MathUtil.roundTo(_covTerm.Value.doubleValue(), roundingFactor)
      }
    }
  }
}