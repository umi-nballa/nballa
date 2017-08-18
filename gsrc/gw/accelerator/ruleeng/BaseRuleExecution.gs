package gw.accelerator.ruleeng

uses gw.api.system.logging.LoggerFactory
uses gw.util.ILogger

uses java.lang.Comparable

/**
 * The base implementation the execution logic for a rule invoked by the rules
 * engine framework. Specific subclasses implement different logic for different
 * types of rule execution.
 */
class BaseRuleExecution<T, C, RT extends Rule_Ext>
    implements Comparable<BaseRuleExecution<T, C, RT>>, IExecutableRule<T, C> {
  /** Class logger. */
  var _logger : ILogger as Logger

  /**
   * The Rule_Ext entity that describes how this rule should behave.
   */
  var _thisRule : RT as Rule

  /**
   * The Gosu class that implements the rule condition.
   */
  protected property get RuleClass() : String {
    return _thisRule.RuleClass
  }

  /**
   * Constructor.
   */
  @Param("rule", "The rule that this class enhances")
  construct(rule : RT) {
    _logger = LoggerFactory.getLogger(RulesEngine.LOG_CATEGORY,
        IntrinsicType.RelativeName + "." + rule.RuleClass)
    _thisRule = rule
  }

  construct(){

  }

  /**
   * Evaluates the rule condition and, if the condition indicates, executes the
   * rule action. This is the main entry point for evaluating the rule against a
   * single object.
   */
  @Param("target", "The object against which to evaluate the rule")
  @Param("context", "The context passed to rule evaluation")
  @Param("condition", "An instance of the condition")
  override function evaluate(target : T,
                             context : C,
                             condition : IRuleCondition<T>) {
    if (_logger.DebugEnabled) {
      _logger.debug("Evaluating " + this + " against " + target)
    }

    var result = condition.evaluateRuleCriteria(target)

    if (result.Result) {
      // Determine the action to execute
      if (condition typeis IRuleAction<T, C>) {
        // This will be the most common case for autoupdate rules
        condition.satisfied(target, context, result)
      } else if (this typeis IRuleAction<T, C>) {
        // This will be the normal case for underwriting and validation rules
        this.satisfied(target, context, result)
      } else {
        _logger.warn("No action found for rule ${this}; could be an old-style"
            + "autoupdate rule?")
      }
    }
  }

  /**
   * Compares this rule to another in order of priority.
   */
  @Param("o", "Another rule")
  @Returns("The result of comparing this rule to the other")
  override function compareTo(o : BaseRuleExecution<T, C, RT>) : int {
    var cmp = Rule.Priority - o.Rule.Priority
    if (cmp == 0) {
      return Rule.PublicID.compareTo(o.Rule.PublicID)
    }
    return cmp
  }

  override function toString(): String {
    return Rule.Subtype.DisplayName + " [" + Rule.RuleClass + "]"
  }
}