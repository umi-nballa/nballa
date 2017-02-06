package gw.accelerator.ruleeng

/**
 * This type handles the execution of an autoupdate rule.
 */
class AutoupdateRuleExecution<T>
    extends BaseRuleExecution<T, Object, AutoupdateRule_Ext> {
  /**
   * Required interface implementation constructor.
   */
  @Param("rule", "The autoupdate rule that this class enhances")
  construct(rule : AutoupdateRule_Ext) {
    super(rule)
  }
}