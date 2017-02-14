package gw.accelerator.ruleeng

/**
 * This class provides (near) backwards "compatibility" with the previous
 * version of the accelerator. If not upgrading from a previous version, you
 * can remove this class entirely.
 * <p>
 * Fields from the Rule_Ext entity that were previously available, like
 * ruleMessage, are no longer exposed on the base rule.
 * </p>
 *
 * @param <T> The type of object this rule operates on
 * @param <V> For underwriting rules, the type of value being examined
 */
abstract class BaseRule<T, V> implements IRuleCondition<T> {
  protected var _valResult : String as valResult
  protected var _valValue : V as valValue

  override function evaluateRuleCriteria(inObject : T) : RuleEvaluationResult {
    try {
      evalRuleCriteria(inObject)
      if (_valResult.length != 0) {
        return RuleEvaluationResult.execute(_valResult, _valValue)
      }

      // An empty valResult means don't execute the rule action.
      return RuleEvaluationResult.skip()

    } finally {
      _valValue = null
      _valResult = null
    }
  }

  /**
   * This method was declared by the previous implementation of the accelerator.
   */
  abstract function evalRuleCriteria(inObject : Object)
}