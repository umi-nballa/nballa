package una.pageprocess

uses gw.api.productmodel.ClausePattern
uses gw.api.domain.covterm.CovTerm
uses una.config.ConfigParamsUtil
uses una.utils.MathUtil
uses gw.api.domain.covterm.DirectCovTerm
uses java.math.BigDecimal

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
    isCovTermAllowedValue(_covTerm)
  }

  private function roundValue(){
    if(_covTerm typeis DirectCovTerm){
      var roundingFactor = ConfigParamsUtil.getInt(TC_RoundingFactor, null, _covTerm.PatternCode)

      if(roundingFactor != null and _covTerm.Value != null){
        _covTerm.Value = MathUtil.roundTo(_covTerm.Value.doubleValue(), roundingFactor, ROUND_NEAREST)
      }
    }
  }

  static function isCovTermAllowedValue(covTerm : CovTerm){
    if(covTerm typeis DirectCovTerm){
      var minimumAllowed = covTerm.getMinAllowedLimitValue(covTerm.Clause.OwningCoverable)
      var allowedIncrement = minimumAllowed
      var allowedIncrements : List<BigDecimal> = {allowedIncrement}
      if(covTerm.PatternCode=="BP7LimitatDescribedPremises_EXT" || covTerm.PatternCode=="BP7LimitDescribedPremises_EXT" || covTerm.PatternCode=="BP7Limit38" || covTerm.PatternCode=="Limit" ||
          covTerm.PatternCode=="Limit_EXT"){
        if((covTerm.Value).remainder(1000)!=0){
          throw new gw.api.util.DisplayableException(displaykey.una.productmodel.validation.AllowedLimitValidationMessage(covTerm.Clause.Pattern.DisplayName,covTerm.DisplayName))
        }
      }
    }
  }
}