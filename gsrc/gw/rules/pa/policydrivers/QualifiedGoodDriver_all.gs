package gw.rules.pa.policydrivers

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/** Rules Framework Rule Example: QualifiedGoodDriver_all  
 *
 *  Descr: QualifiedGoodDriver_all is equivalent to QualifiedGoodDriver_each, except that its
 *         input object is an array of PolicyDrivers vs. an individual PolicyDriver.  As such, 
 *         this rule is responsible to iterate through all PolicyDrivers and return a String
 *         containing a comma-delimited list of drivers meeting this rule's criteria to the
 *         FrameworkRule.
 *         
 *         Please refer to QualifiedGoodDriver_each for further details.
**/
class QualifiedGoodDriver_all implements IRuleCondition<PolicyDriver[]> {
  override function evaluateRuleCriteria(drivers : PolicyDriver[]): RuleEvaluationResult {
    var matches = drivers.where(\ driver ->
        not driver.Excluded
          and (driver.AccountContactRole as Driver).GoodDriverDiscount?.booleanValue()
          and not driver.hasGoodDriverDiscount)

    return RuleEvaluationResult.executeIfMatch(matches)
  }
}