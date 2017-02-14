package gw.rules.pa.policydrivers

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/** Rules Framework Rule Example: QualifiedGoodDriver_each  
 *
 *  Descr: The QualifiedGoodDriver rule is functionally equivalent to PALineDriversValidator's qualifiedGoodDriver() validate method 
 *         (shown below) except as noted in the Notes section below:
 *
 *          //  private function qualifiedGoodDriver() {
 *          //    if (typeAppliesTo(paLine.Branch.Job)) {
 *          //      var drivers = paLine.PolicyDrivers.where(\ p ->
 *          //            not p.Excluded and
 *          //            (p.AccountContactRole as Driver).GoodDriverDiscount != null and (p.AccountContactRole as Driver).GoodDriverDiscount
 *          //            and not p.hasGoodDriverDiscount)
 *          //      if (drivers.Count > 0) {
 *          //        var msg = drivers.map(\ d -> d.DisplayName).join(", ")
 *          //        Result.addWarning(paLine, "default", displaykey.Web.Policy.PA.Validation.PossibleMissDriverDiscount(msg)
 *                                      , DRIVERS_WIZARD_STEP)
 *          //      }}}
 * 
 *  Notes:
 * 
 *   1. Because this rule is implemented under the Rules Framework, applicable jobs are defined by the Job's indicated on the rule 
 *      (i.e. vs requiring harcoded 'typeAppliesTo(paLine.Branch.Job)' logic).
 * 
 *   2. Because this rule's RuleValidationApplyMethod = 'each', the RulesEngine automatically iterates through each Driver and raises
 *      an individual warning/error for each driver meeting the rule criteria.
 * 
 *      The alternative QualifiedGoodDriver_all rule implements the same criteria except that its input object is
 *      a PolicyDriver array.
 * 
 *   3. Use of the addWarning or addError and the validation context levels at which these each method is applied
 *      is determined dynamically by the RulesEngine's ValidationRuleExecution via the rule's valWarningLevel and valErrorLevel properties.
 *   
 * */
class QualifiedGoodDriver_each implements IRuleCondition<PolicyDriver> {
  override function evaluateRuleCriteria(driver : PolicyDriver): RuleEvaluationResult {
    if (not driver.Excluded
        and (driver.AccountContactRole as Driver).GoodDriverDiscount?.booleanValue()
        and not driver.hasGoodDriverDiscount) {
      return RuleEvaluationResult.execute(driver.DisplayName)
    }

    return RuleEvaluationResult.skip()
  }
}