package una.productmodel.runtimedefaults

uses gw.api.domain.covterm.CovTerm
uses java.lang.Double

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/19/16
 * Time: 10:43 AM
 * To change this template use File | Settings | File Templates.
 */
class CoverageTermsRuntimeDefaultController {
  public static class CovTermDefaultContext{
    private var _defaultContext : DEFAULT_CONTEXT as DefaultContextEnum
    private var _coverable : Coverable as Coverable
    private var _triggerCovTerm : CovTerm as TriggerCovTerm
    private var _applicablePatternCodes : List<String> as ApplicablePatternCodes

    construct(defaultContext : DEFAULT_CONTEXT, coverable : Coverable){
      _defaultContext = defaultContext
      _coverable = coverable
    }

    construct(defaultContext : DEFAULT_CONTEXT, coverable : Coverable, triggerCovTerm : CovTerm){
      _defaultContext = defaultContext
      _coverable = coverable
      _triggerCovTerm = triggerCovTerm
    }

    construct(defaultContext : DEFAULT_CONTEXT, coverable : Coverable, applicablePatternCodes : List<String>){
      _defaultContext = defaultContext
      _coverable = coverable
      _applicablePatternCodes = applicablePatternCodes
    }
  }

  public enum DEFAULT_CONTEXT {
    EXECUTIVE_COVERAGE("Homeowners", 1), SECTION_I("Homeowners", 2), HO_RUNTIME("Homeowners", 3)

    private construct(product : String, priority : int){
      _product = product
      _priority = priority
    }

    private final var _product : String as Product
    private final var _priority : int as Priority
  }

  public static function setDefaults(covTermDefaultContext : CovTermDefaultContext){
    getRuntimeDefaultCalculator(covTermDefaultContext).setRuntimeDefaults()
  }

  /*
    returns a prioritized runtime default for the given covTerm
  */
  public static function getRuntimeDefault(covTerm: CovTerm) : Double{
    var result : Double
    var coverable = covTerm.Clause.OwningCoverable
    var i = 0
    var sortedContextsForProduct = DEFAULT_CONTEXT.AllValues.where( \ context -> context.Product.equalsIgnoreCase(coverable.PolicyLine.Branch.Policy.ProductCode))
                                                            .orderBy( \ context -> context.Priority)

    do{
      result = getRuntimeDefaultCalculator(new CovTermDefaultContext(sortedContextsForProduct[i], coverable, {covTerm.PatternCode})).getRuntimeDefault(covTerm)
      i++
    }while(result == null and i < sortedContextsForProduct.Count)

    return result
  }

  /*
    returns a runtime default for the given covTerm and defaultContext
  */
  public static function getRuntimeDefault(covTerm : CovTerm, defaultContext : DEFAULT_CONTEXT) : Double{
    return getRuntimeDefaultCalculator(new CovTermDefaultContext(defaultContext, covTerm.Clause.OwningCoverable)).getRuntimeDefault(covTerm)
  }

  private static function getRuntimeDefaultCalculator(context : CovTermDefaultContext) : CovTermRuntimeDefaultCalculator{
    var result : CovTermRuntimeDefaultCalculator

    switch(context.DefaultContextEnum){
      case EXECUTIVE_COVERAGE:
        result = new ExecutiveCoverageRuntimeDefaultCalculator(context)
        break
      case SECTION_I:
        result = new SectionICovTermRuntimeDefaultCalculator(context)
        break
      case HO_RUNTIME:
        result = new HOInitCovTermRuntimeDefaultCalculator(context)
        break
      default:
        break
    }

    return result
  }
}