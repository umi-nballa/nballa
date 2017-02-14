package gw.accelerator.ruleeng

uses gw.api.database.InOperation
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.database.Restriction
uses gw.api.system.PLLoggerCategory
uses gw.api.system.logging.LoggerFactory
uses gw.pl.logging.Logger

uses java.lang.IllegalArgumentException
uses java.lang.Iterable
uses java.util.ArrayList
uses java.util.Date
uses java.util.List
uses java.util.Map

/**
 * RulesEngine is a base class that loads executable instances of rules for
 * a particular rule type and manages the execution of them.
 *
 * @param <R> The type of the root entity in rule execution
 * @param <C> The context type
 * @param <RT> The rule subtype that this engine executes
 */
abstract public class RulesEngine<R extends KeyableBean, C, RT extends Rule_Ext> {
  /**
   * The prefix that all loggers in the rules framework use.
   */
  public static final var LOG_CATEGORY : Logger =
      LoggerFactory.getLogger(PLLoggerCategory.RULES, "RulesFramework")

  /**
   * Instance logger.
   */
  private var _logger : Logger as readonly Log

  /**
   * The root object against which rules are executed.
   */
  var _rootObject : R as readonly RootObject

  /**
   * The entity graph nodes to consider when evaluating rules.
   */
  var _entityGraphNodes: Iterable<RuleEntityGraphNode>

  /**
   * A single validation base/context instance (if applicable) is used for the
   * rules engine instance (i.e. not per rule instance).
   */
  var _context : C as readonly Context

  /**
   * constructor
   */
  @Param("rootObject", "The root of rule evaluation")
  @Param("entityGraphNodes",
      "The nodes of the entity graph to evaluate rules against")
  @Param("ruleValContext", "The context for evaluation")
  @Param("graph", "The rule entity graph")
  protected construct(rootObject : R,
                      entityGraphNodes : Iterable<RuleEntityGraphNode>,
                      ruleValContext : C) {
    if (rootObject == null) {
      throw new IllegalArgumentException("rootObject is a required argument.")
    }

    _logger = LoggerFactory.getLogger(LOG_CATEGORY,
        this.IntrinsicType.RelativeName)
    _rootObject = rootObject
    _entityGraphNodes = entityGraphNodes
    _context = ruleValContext
  }

  /**
   * startRulesEngine is the main entry point. This method loads the
   * appropriate rules, and then walks through the list of target nodes,
   * evaluating rules at each level.
   */
  public final function startRulesEngine() : void {
    _logger.debug("Beginning rule execution")
    var rules = findAvailableRules()

    // Don't bother looping through entityGraphNodes if there are no rules
    if (not rules.Empty) {
      var entityValues =
          RuleEntityGraph.Instance.getEntities(_rootObject, rules.keySet())
      for (node in _entityGraphNodes) {
        _logger.trace("Processing node " + node)
        iterateAvailableRules(node, rules[node], entityValues[node])
      }
    }
  }

  @Returns("A Query for the appropriate rule subtype")
  protected abstract function newQuery() : Query<RT>

  /**
   * findAvailableRules: Loads all applicable rules for the given dimensions.
   */
  @Returns("A collection of rules in execution order,"
      + " keyed by rule entity graph node")
  private function findAvailableRules() : Map<RuleEntityGraphNode, List<Rule_Ext>> {

    var effDate : DateTime

    var availQuery = newQuery()
        .compareIn(Rule_Ext#GraphNodePath,
            _entityGraphNodes.map(\node -> node.Path).toTypedArray())

    if (_rootObject typeis PolicyPeriod) {

      // builds list of Job typelist typecodes having the RuleJob typefilter
      var ruleJobs = new ArrayList<typekey.Job>(typekey.Job.TF_RULEJOB.TypeKeys)
      ruleJobs.add(typekey.Job.TC_SUBMISSION)

      // Get the job subtype of the job referenced on this branch
      if (ruleJobs.contains(_rootObject.Job.Subtype)) {
        // only job types defined by RuleJobs typefilter are operated on
        var join = availQuery.join(RuleJob_Ext, RuleJob_Ext#Rule.PropertyInfo.Name)
            .compare(RuleJob_Ext#JobType, Equals, _rootObject.Job.Subtype)
        if (_rootObject.Job typeis Submission) {
          // Since Full App and QQ aren't actually Jobs, use the flag here
          join.compare(RuleJob_Ext#FullApplication, Equals,
              _rootObject.Job.FullMode)
        }
      }

      var jurisdiction = _rootObject.BaseState
      availQuery.and(\ stateCompare -> {
        stateCompare.or(\ juris -> {
          // Either flagged for all jurisdictions
          juris.compare(UWRule_Ext#AllJurisdictions, Relop.Equals, true)
          // or valid for the current jurisdiction
          // Can't do a join inside an OR, so we use a subselect.
          var jurisQuery = Query.make(RuleJurisdiction_Ext)
              .compare(RuleJurisdiction_Ext#Jurisdiction, Equals, jurisdiction)
          juris.subselect(Rule_Ext#ID, InOperation.CompareIn, jurisQuery, RuleJurisdiction_Ext#Rule)
        })
      })

     var policytype = _rootObject.HomeownersLine_HOEExists ?  _rootObject.HomeownersLine_HOE?.HOPolicyType : null
      if(policytype != null ){
        availQuery.and(\ poltype -> {
          poltype.or(\ type -> {
            // Either flagged for all jurisdictions
            type.compare(UWRule_Ext#AllPolicyTypes, Relop.Equals, true)
            // or valid for the current jurisdiction
            // Can't do a join inside an OR, so we use a subselect.
            var typeQuery = Query.make(RulePolicyType_Ext)
                .compare(RulePolicyType_Ext#PolicyType, Equals, policytype)
            type.subselect(Rule_Ext#ID, InOperation.CompareIn, typeQuery, RulePolicyType_Ext#Rule)
          })
        })
      }
      effDate = _rootObject.EditEffectiveDate

    } else {
      // e.g. account, account contact, etc rules
      effDate = gw.api.util.DateUtil.currentDate();
    }

    availQuery.compare(Rule_Ext#EffectiveDate, LessThanOrEquals, effDate)
    availQuery.and(\ expiration -> {
      expiration.or(\ expirationOpts -> {
        expirationOpts.compare(Rule_Ext#ExpirationDate, GreaterThan, effDate)
        expirationOpts.compare(Rule_Ext#ExpirationDate, Equals, null)
      })
    })

    // Allow subtypes to further restrict the DB query
    restrictQuery(availQuery)

    var allRuleInstances = new ArrayList<Rule_Ext>()
    for (rule in filterRules(availQuery.select())) {
      allRuleInstances.add(rule)
    }

    _logger.debug("Loaded {} rule(s)", allRuleInstances.Count)

    return allRuleInstances.partition(\ rule -> rule.GraphNode)
  }

  /**
   * The base implementation doesn't restrict the query further.
   */
  @Param("query", "The rule query")
  protected function restrictQuery(query : Restriction<RT>) {
  }

  /**
   * The base implementation simply returns all rules.
   */
  @Param("rules", "The raw query results")
  @Returns("A subset of the rules after applying in-memory filtering, "
      + "if necessary")
  protected function filterRules(rules : Iterable<RT>) : Iterable<RT> {
    return rules
  }

  /**
   * Evaluates all the rules for a given node in the graph.
   */
  function iterateAvailableRules(entityGraphNode : RuleEntityGraphNode,
                                 rules : List<Rule_Ext>,
                                 objectToValidate : Object) : void {
    if (rules.HasElements) {
      // Order by Priority
      for (rule in rules.order()) {
        if (_logger.DebugEnabled) {
          _logger.debug("Evaluating " + rule + " against " + objectToValidate)
        }

        var executable = rule as IExecutableRule
        var condition = rule.NewConditionInstance()

        // Based on the rule apply method, we evaluate the rule against each
        // element in an array (if it is an array) or against the array (or
        // object) as a whole.
        if (rule.RuleApplyMethod == typekey.RuleApplyMethod_Ext.TC_EACH
            and objectToValidate typeis Array) {
          for (var target in objectToValidate) {
            executable.evaluate(target, Context, condition)
          }
        } else {
          executable.evaluate(objectToValidate, Context, condition)
        }
      }
    }
  }
}
