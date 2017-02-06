package gw.accelerator.ruleeng

/**
 * This interface provides a method to execute when a rule condition is
 * satisfied.
 *
 * @param <T> The target of the rule evaluation
 * @param <C> The type of the context parameter
 */
interface IRuleAction<T, C> {
  /**
   * The method invoked when the rule condition is satisfied.
   */
  @Param("target", "The object against which to evaluate the rule")
  @Param("context", "The context passed to rule evaluation")
  @Param("result", "The result of evaluating the condition")
  function satisfied(target : T, context : C, result : RuleEvaluationResult)
}
