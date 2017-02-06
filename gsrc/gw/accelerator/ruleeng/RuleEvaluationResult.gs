package gw.accelerator.ruleeng

/**
 * RuleEvaluationResult represents the outcome of evaluating the condition of
 * a rule. It indicates whether to execute the action, and also contains some
 * context that may be used in the action.
 */
class RuleEvaluationResult {
  /**
   * An instance that means "don't execute the action."
   */
  static final var SKIP = new RuleEvaluationResult(false)

  /**
   * An instance that means "execute the action" but provides no context.
   */
  static final var EXECUTE = new RuleEvaluationResult(true)

  /**
   * The outcome of evaluating the condition.
   */
  var _result : boolean as readonly Result

  /**
   * The first piece of context information. For validation rules, this
   * should be the bean that failed validation.
   */
  var _primaryValue : Object as readonly PrimaryValue

  /**
   * The second piece of context information. For underwriting rules, this
   * value is (optionally) the value that triggered the underwriting issue.
   */
  var _secondaryValue : Object as readonly SecondaryValue

  // Private constructors - use the factory methods instead

  private construct(result : boolean) {
    _result = result
  }

  private construct(result : boolean, primary : Object) {
    this(result)
    _primaryValue = primary
  }

  private construct(result : boolean, primary : Object, secondary : Object) {
    this(result, primary)
    _secondaryValue = secondary
  }

  @Returns("An instance that tells the engine not to execute the rule action")
  static function skip() : RuleEvaluationResult {
    return SKIP
  }

  @Returns("An instance that tells the engine to execute the rule action")
  static function execute() : RuleEvaluationResult {
    return EXECUTE
  }

  @Param("value", "A piece of context information to pass to the action")
  @Returns("An instance that tells the engine to execute the rule action")
  static function execute(value : Object) : RuleEvaluationResult {
    return new RuleEvaluationResult(true, value)
  }

  @Param("primaryValue", "A piece of context information to pass to the action")
  @Param("secondaryValue", "A piece of context information to pass to the action")
  @Returns("An instance that tells the engine to execute the rule action")
  static function execute(primaryValue : Object, secondaryValue : Object) : RuleEvaluationResult {
    return new RuleEvaluationResult(true, primaryValue, secondaryValue)
  }

  /**
   * Utility function that returns an {@link #execute()} instance (with a
   * comma-separated list of the display names of the matching entities) if
   * the set of matches is not empty, and {@link #skip()} if there are no
   * matches.
   */
  @Param("matches", "An array of beans to check for members")
  @Returns("An appropriate evaluation result based on whether the array is "
      + "empty or not")
  static function executeIfMatch(matches : KeyableBean[]) : RuleEvaluationResult {
    if (matches.HasElements) {
      return execute(matches.map(\ bean -> bean.DisplayName).join(", "))
    } else {
      return skip()
    }
  }
}
