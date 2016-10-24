package una.enhancements.productmodel

uses gw.api.domain.covterm.CovTerm
uses una.enhancements.productmodel.CoverageTermsRuntimeDefaultController.CovTermDefaultContext

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/18/16
 * Time: 2:48 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class HOCovTermRuntimeDefaultCalculator extends CovTermRuntimeDefaultCalculator{
  private var _dwelling : Dwelling_HOE as Dwelling

  construct(context : CovTermDefaultContext){
    super(context)
    var coverable = context.Coverable
    _dwelling = (coverable typeis Dwelling_HOE) ? coverable : (coverable as HomeownersLine_HOE).Dwelling
  }

  override final property get Coverables() : List<Coverable>{
    return {Dwelling, Dwelling.HOLine}
  }

  override function shouldSetDefault(): boolean {
    return true
  }

  override function shouldReturnDefault(covTerm: CovTerm): boolean {
    return ApplicableCovTermPatterns?.contains(covTerm.PatternCode)
  }
}