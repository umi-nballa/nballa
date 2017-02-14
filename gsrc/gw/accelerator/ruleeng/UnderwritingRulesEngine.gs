package gw.accelerator.ruleeng

uses gw.api.database.Query
uses gw.api.database.Restriction
uses gw.policy.PolicyEvalContext

uses java.lang.Iterable

/**
 * This class manages execution of underwriting issue rules.
 */
class UnderwritingRulesEngine
    extends RulesEngine<PolicyPeriod, PolicyEvalContext, UWRule_Ext> {
  /**
   * Constructor.
   */
  @Param("rootObject", "The policy period at the root of the object graph")
  @Param("entityGraphNodes",
      "The nodes in the graph to evaluate this rule against")
  @Param("ruleValContext", "The policy evaluation context")
  @Param("graph", "The entity graph")
  protected construct(rootObject : PolicyPeriod,
            entityGraphNodes : Iterable<RuleEntityGraphNode>,
            ruleValContext : PolicyEvalContext) {
    super(rootObject, entityGraphNodes, ruleValContext)
  }

  @Returns("A query for finding underwriting issue rules")
  override function newQuery(): Query <UWRule_Ext> {
    return Query.make(UWRule_Ext)
  }

  override function restrictQuery(query : Restriction<UWRule_Ext>) {
    query.join(UWRule_Ext#UWIssueType)
        .compare(UWIssueType#CheckingSet, Equals, Context.CheckingSet)
  }
}
