package una.enhancements.productmodel

uses una.utils.MathUtil
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/19/16
 * Time: 2:46 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNADirectCovTermEnhancement_Ext: gw.api.domain.covterm.DirectCovTerm {

  property get DerivedDefaultPatternCodeSource() : String{
    var result : String

    switch(typeof this.Clause.OwningCoverable.PolicyLine){
      case Homeownersline_HOE:
        result = getDerivedDefaultPatternCodeForHO()
        break
      default:
        break
    }

    return result
  }

  public function round(roundingMode : MathUtil.ROUNDING_MODE){
    var baseState = this.Clause.OwningCoverable.PolicyLine.BaseState
    var roundingFactor = ConfigParamsUtil.getInt(ConfigParameterType_Ext.TC_ROUNDINGFACTOR, baseState, this.PatternCode)

    if(this.Value != null and roundingFactor != null and roundingFactor > 0){
      this.Value = MathUtil.roundTo(this.Value.doubleValue(), roundingFactor, roundingMode)
    }
  }

  private function getDerivedDefaultPatternCodeForHO() : String{
    var result : String
    var hoLine = this.Clause.PolicyLine as HomeownersLine_HOE

    //more specific to include ho policy type.  if none found, goes more generic with just pattern code
    result = ConfigParamsUtil.getString(TC_DerivedLimitPatternPair, this.Clause.PolicyLine.BaseState, hoLine.Dwelling.HOPolicyType.Code + this.PatternCode)

    if(result == null){
      result = ConfigParamsUtil.getString(TC_DerivedLimitPatternPair, hoLine.BaseState, this.PatternCode)
    }

    return result
  }
}
