package gw.accelerator.ruleeng

/**
 * This interface describes the extension methods on Rule_Ext entities that
 * allow them to be evaluated by the rules framework.
 *
 * @param <T> The target type for rule evaluation
 * @param <C> The type of the context parameter passed to rule evaluation
 */
interface IExecutableRule<T, C> {
  /**
   * Evaluates this rule for the given target object, with the given context,
   * and an instance of a rule condition.
   */
  @Param("target", "The object against which to evaluate the rule")
  @Param("context", "The context passed to rule evaluation")
  @Param("condition", "An instance of the condition")
  function evaluate(target : T,
                    context : C,
                    condition : IRuleCondition<T>)
}