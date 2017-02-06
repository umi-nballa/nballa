package gw.accelerator.ruleeng

uses gw.policy.PolicyEvalContext
uses java.math.BigDecimal
uses gw.pl.currency.MonetaryAmount

/**
 * This type manages the execution of underwriting rules. Underwriting
 * rules are always evaluated against a root PolicyPeriod.
 */
class UnderwritingRuleExecution<T>
    extends BaseRuleExecution<T, PolicyEvalContext, UWRule_Ext>
    implements IRuleAction<T, PolicyEvalContext> {
  /**
   * Constructor.
   */
  construct(rule : UWRule_Ext) {
    super(rule)
  }

  /**
   * Adds an underwriting issue of the type configured in the UWRule_Ext. The
   * primary and secondary values (if applicable) from the evaluation result
   * are used as parameters for the issue.
   */
  override function satisfied(target : T,
                              context : PolicyEvalContext,
                              result : RuleEvaluationResult) {
    var msgSubject = \ -> Rule.UWIssueType.Name
    var msgBody = \ -> {
      return displaykey.Accelerator.RulesFramework.UWIssueRaised(
          result.PrimaryValue, Rule.RuleMessage, Rule.RuleClass)
    }
    var value = result.SecondaryValue
    if (value != null) {
      if (value typeis State) {
        context.addIssue(Rule.UWIssueType.Code, target as String,
            msgSubject, msgBody, value)
      } else if (value typeis MonetaryAmount) {
        context.addIssue(Rule.UWIssueType.Code, target as String,
            msgSubject, msgBody, value)
      } else {
        context.addIssue(Rule.UWIssueType.Code, target as String,
            msgSubject, msgBody, value as BigDecimal)
      }
    } else {
      context.addIssue(Rule.UWIssueType.Code, target as String,
          msgSubject, msgBody)
    }
  }
}
