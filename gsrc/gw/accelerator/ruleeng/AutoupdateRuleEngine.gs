package gw.accelerator.ruleeng

uses java.lang.Iterable
uses gw.api.database.Query

/**
 * An implementation of the RulesEngine for executing autopudate rules.
 */
class AutoupdateRuleEngine<R extends KeyableBean>
    extends RulesEngine<R, Object, AutoupdateRule_Ext> {
  /**
   * Constructor.
   */
  @Param("rootObject", "The root of the object graph")
  @Param("entityGraphNodes",
      "The nodes in the graph to evaluate this rule against")
  @Param("graph", "The entity graph")
  protected construct(rootObject : R,
                      entityGraphNodes: Iterable<RuleEntityGraphNode>) {
    super(rootObject, entityGraphNodes, null)
  }

  /**
   * Constructs a query for AutoupdateRule_Ext entities.
   */
  @Returns("A Query for finding AutoupdateRule_Ext instances")
  override function newQuery(): Query<AutoupdateRule_Ext> {
    return Query.make(AutoupdateRule_Ext)
  }
}