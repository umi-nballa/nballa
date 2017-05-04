package gw.accelerator.ruleeng

uses gw.api.system.logging.LoggerFactory
uses gw.policy.PolicyEvalContext
uses gw.transaction.Transaction
uses gw.validation.PCValidationContext
uses gw.validation.ValidationUtil

uses java.lang.Exception
uses java.lang.IllegalStateException
uses java.util.ArrayList
uses java.util.List

/**
 * RulesEngineInterface provides a public API for invoking the rules engine.
 * <p>
 * It provides entry points for the three types of rules the framework
 * supports:
 * <ul>
 *   <li>Validation - the validate() methods</li>
 *   <li>Underwriting Issue - the evaluatePolicy() methods</li>
 *   <li>Autoupdate - the autoUpdate() method</li>
 * </ul>
 */
class RulesEngineInterface {
  /**
   * This is the package that contains rule condition implementation classes,
    * as defined in script parameters.
   */
  public static final var RULE_PACKAGE_BASE : String =
      ScriptParameters.RulePackage

  /**
   * Class logger.
   */
  private static final var LOGGER =
      LoggerFactory.getLogger(RulesEngine.LOG_CATEGORY, "RulesEngineInterface")

  /**
   * A set of entity graph nodes describing which types in the tree to
   * execute rules against.
   */
  private var _entityGraphNodes: List<RuleEntityGraphNode>

  // Private constructors for static access
  private construct() {
  }

  /**
   * Invokes underwriting issue rules for a policy.
   */
  @Param("policyEvalContext", "The evaluation context for a policy")
  @Param("policyLine", "The name of the policy line type")
  static function evaluatePolicy(policyEvalContext : PolicyEvalContext,
                                 policyLine : String) {
    var policyLineNode = RuleEntityGraph.Instance.findNamedNode("PolicyPeriod")
        .findDescendant(policyLine)
    evaluatePolicy(policyLineNode, policyEvalContext)
  }

  /**
   * Calls the rules engine iterator twice for processing UW issue-type rules
   * and twice for processing autoupdate-type rules. The first call for each
   * processes the policyperiod node without descendants. The second call for
   * each processes the given policyline node and all of its descendants.
   */
  @Param("policyLineNode", "The entity graph node for the policy line")
  @Param("policyEvalContext", "The evaluation context for a policy")
  static function evaluatePolicy(policyLineNode: RuleEntityGraphNode,
                                 policyEvalContext : PolicyEvalContext) {

    var policyPeriodNode =
        RuleEntityGraph.Instance.findNamedNode("PolicyPeriod")

    try {
      var engine = new RulesEngineInterface()

      // 1st of 2 calls for processing uwissue-type rules.
      // this call handles all policyperiod-level rules w/o descendants
      engine.rulesEngineIterator(typekey.Rule_Ext.TC_UWRULE_EXT,
          policyEvalContext.Period,
          policyPeriodNode,
          policyEvalContext,
          false,
          false)
      // 2nd of 2 calls for processing uwissue-type rules.
      // this call handles all policyline-level rules and all descendants
      engine.rulesEngineIterator(typekey.Rule_Ext.TC_UWRULE_EXT,
          policyEvalContext.Period,
          policyLineNode,
          policyEvalContext,
          true,
          false)
      // 1st of 2 calls for processing autoupudate-type rules.
      // this call handles all policyperiod-level rules w/o descendants
      engine.rulesEngineIterator(typekey.Rule_Ext.TC_AUTOUPDATERULE_EXT,
          policyEvalContext.Period,
          policyPeriodNode,
          policyEvalContext,
          false,
          false)
      // 2nd of 2 calls for processing autoupudate-type rules.
      // this call handles all policyline-level rules and all descendants
      engine.rulesEngineIterator(typekey.Rule_Ext.TC_AUTOUPDATERULE_EXT,
          policyEvalContext.Period,
          policyLineNode,
          policyEvalContext,
          true,
          false)

    } catch (e : Exception) {
      e.printStackTrace()
      LOGGER.error(e)
      throw e
    }
  }

  /**
   * Validation: PCValidationContext is provided as input for this signature.
   */
  @Param("rootObject", "The root of the object graph to validate")
  @Param("entityGraphNode", "The property to validate")
  @Param("pcValContext", "The validation context")
  @Param("processGraphDescendants",
      "Whether to apply validation to descendants of the specified node")
  @Param("runWithNewBundle", "If true, rule execution will run in a new bundle")
  static function validate(rootObject : KeyableBean,
                           entityGraphNode : RuleEntityGraphNode,
                           pcValContext : PCValidationContext,
                           processGraphDescendants : boolean,
                           runWithNewBundle : boolean) {
    try {
      new RulesEngineInterface().rulesEngineIterator(
          typekey.Rule_Ext.TC_VALIDATIONRULE_EXT,
          rootObject,
          entityGraphNode,
          pcValContext,
          processGraphDescendants,
          runWithNewBundle)

    } catch(e : Exception) {
      LOGGER.error(e)
      throw e
    }
  }

  /**
   * This is the contextless validate signature, which is used for Account
   * Validation Rules, etc.
   *
   * Note: Neither this method nor any outer method may use try/catch
   * exception handling, as raiseExceptionIfProblemsFound otherwise throws to
   * the catch ... and this results in the logger message being displayed to
   * the user.
   */
  @Param("rootObject", "The root of the object graph to validate")
  @Param("entityGraphNode", "The property to validate")
  @Param("processGraphDescendants",
      "Whether to apply validation to descendants of the specified node")
  @Param("runWithNewBundle", "If true, rule execution will run in a new bundle")
  static function validate(rootObject : KeyableBean,
                           entityGraphNode : RuleEntityGraphNode,
                           processGraphDescendants : boolean,
                           runWithNewBundle : boolean) {

    var context = ValidationUtil.createContext(ValidationLevel.TC_DEFAULT)

    validate(rootObject, entityGraphNode, context,
        processGraphDescendants, runWithNewBundle)

    context.raiseExceptionIfProblemsFound()
  }

  @Param("rootObject", "The root of the object graph to validate")
  @Param("context", "The validation context")
  @Param("descendantType", "The name of the property to validate")
  @Param("ancestorType", "The name of an ancestor type to use to qualify "
      + "the descendantType. This is useful because the same property may "
      + "appear in multiple branches of the entity graph.")
  static function validate(rootObject : KeyableBean,
                           context : PCValidationContext,
                           descendantType : String,
                           ancestorType : String) {
    var ancestorNode = RuleEntityGraph.Instance.findNamedNode(ancestorType)
    var descendantNode = ancestorNode.findDescendant(descendantType)
    validate(rootObject, descendantNode, context, true, false)
  }

  @Param("rootObject", "The root of the object graph to validate")
  @Param("context", "The validation context")
  @Param("entityGraphNodeName", "The name of the property to validate")
  static function validate(rootObject : KeyableBean,
                           context : PCValidationContext,
                           entityGraphNodeName : String) {
    validate(rootObject,
        RuleEntityGraph.Instance.findNamedNode(entityGraphNodeName),
        context, false, true)
  }

  @Param("rootObject", "The root of the object graph to validate")
  @Param("entityGraphNodeName", "The name of the property to validate")
  @Param("processGraphDescendants",
      "Whether to apply validation to descendants of the specified node")
  @Param("runWithNewBundle", "If true, rule execution will run in a new bundle")
  static function validate(rootObject : KeyableBean,
      entityGraphNodeName : String,
      processGraphDescendants : boolean,
      runWithNewBundle : boolean) {
    validate(rootObject,
        RuleEntityGraph.Instance.findNamedNode(entityGraphNodeName),
        processGraphDescendants,
        runWithNewBundle)
  }

  /**
   * This method executes autoupdate rules for an entity.
   */
  @Param("rootObject", "The root of the object graph to validate")
  @Param("entityGraphNode", "The property to apply rules to")
  @Param("processGraphDescendants",
      "Whether to apply validation to descendants of the specified node")
  @Param("runWithNewBundle", "If true, rule execution will run in a new bundle")
  static function autoUpdate(rootObject : KeyableBean,
                             entityGraphNode : RuleEntityGraphNode,
                             processGraphDescendants : boolean,
                             runWithNewBundle : boolean) {
    try {
      var engine = new RulesEngineInterface()
      engine.rulesEngineIterator(typekey.Rule_Ext.TC_AUTOUPDATERULE_EXT,
          rootObject,
          entityGraphNode,
          null,
          processGraphDescendants,
          runWithNewBundle)

    } catch (e : Exception) {
      LOGGER.error(e)
      throw e
    }
  }


  /**
   * The main method of this class. This method populates the list of
   * entity graph nodes to process, then constructs the RulesEngine instance
   * and uses it to evaluate rules.
   */
  private function rulesEngineIterator(
      ruleType : typekey.Rule_Ext,
      rootObject : KeyableBean,
      entityGraphNode : RuleEntityGraphNode,
      ruleValContext : Object,
      processGraphDescendants : boolean,
      runWithNewBundle : boolean) {
    var entityGraphNodes : List<RuleEntityGraphNode>

    if (processGraphDescendants) {
      entityGraphNodes = new ArrayList<RuleEntityGraphNode>()
      entityGraphNodes.add(entityGraphNode)
      if(entityGraphNode?.Descendants!=null)
        entityGraphNodes.addAll(entityGraphNode?.Descendants)
    } else {
      entityGraphNodes = {entityGraphNode}
    }

    var evaluateRules = \ -> {
      createRulesEngineInstance(ruleType,
          rootObject,
          entityGraphNodes,
          ruleValContext).startRulesEngine()
    }

    if (runWithNewBundle) {
      Transaction.runWithNewBundle (\ bundle -> {
        evaluateRules()
      })
    } else {
      evaluateRules()
    }
  }


  /**
   * createRulesEngineInstance is a factory method for creating an instance
   * of the correct {@link RulesEngine} subtype.
   */
  private function createRulesEngineInstance(
      ruleType : typekey.Rule_Ext,
      rootObject : KeyableBean,
      entityGraphNodes : List<RuleEntityGraphNode>,
      ruleValContext : Object) : RulesEngine {
    switch (ruleType) {
    case TC_AUTOUPDATERULE_EXT:
      return new AutoupdateRuleEngine(rootObject, entityGraphNodes)
    case TC_UWRULE_EXT:
      if ((ruleValContext typeis PolicyEvalContext)
          and (rootObject typeis PolicyPeriod)) {
        return new UnderwritingRulesEngine(rootObject, entityGraphNodes,
            ruleValContext)
      }
      throw new IllegalStateException(
          "UWRules requires a PolicyPeriod and PolicyEvalContext")
    case TC_VALIDATIONRULE_EXT:
      if (ruleValContext typeis PCValidationContext) {
        return new ValidationRulesEngine(rootObject, entityGraphNodes,
            ruleValContext)
      }
      throw new IllegalStateException(
          "Validation requires a PCValidationContext")
    default:
      throw new IllegalStateException("Unknown rule type " + ruleType)
    }
  }
}