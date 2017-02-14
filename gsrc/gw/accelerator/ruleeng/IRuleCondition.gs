package gw.accelerator.ruleeng

/**
 * This simple interface represents the "condition" piece of a rule. Its
 * single method returns a result object that indicates whether to execute
 * the rule's action and, if so, what data to use (for example, to produce a
 * validation error or warning or underwriting issue).
 *
 * @param <T> The type of object against which the rule is evaluated
 */
interface IRuleCondition<T> {
  /**
   * Evaluates the rule criteria to determine whether to execute the rule
   * action.
   */
  @Param("inObject", "The object at the root of the rule evaluation")
  @Returns("A RuleEvaluationResult indicating whether to execute the rule action")
  function evaluateRuleCriteria(inObject : T) : RuleEvaluationResult
}