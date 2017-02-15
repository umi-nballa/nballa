package gw.accelerator.ruleeng

uses gw.api.database.Query
uses gw.api.productmodel.PolicyLinePattern
uses gw.api.productmodel.Product
uses gw.api.system.logging.LoggerFactory
uses gw.lang.reflect.IPropertyInfo
uses gw.transaction.Transaction

uses java.lang.Exception
uses java.util.HashSet
uses java.util.List
uses gw.api.productmodel.PolicyLinePatternLookup
uses typekey.ProductLookup

/**
 * RuleEntityGraphBuilder dynamically constructs the entity graph reference
 * data used within the Rules Engine. Triggered by the 'Rebuild Rule
 * Entity Graph' button on the RuleAdminExt screen and at startup by the
 * RuleEntityGraphStartablePlugin.
 */
class RuleEntityGraphBuilder {
  /** Class logger. */
  static var _logger = LoggerFactory.getLogger(RulesEngine.LOG_CATEGORY,
      "RuleEntityGraphBuilder")

  /** Stores the PolicyPeriod node. */
  var _policyPeriodNode : RuleEntityGraphNode

  var _productAbbrForLines = new HashSet<String>()

  //quick and dirty node filter approach
  static final var NODE_KEYWORDS_TO_FILTER : List<String> = {
      "Candidates", "Available"
  }
  static final var NODE_NAMES_TO_FILTER : List<String> = {
      "AllCoverables",
      "AllModifiables",
      "AllRIRisks",
      "AllStates",
      "Answers",
      "QuestionSets"
  }

  /**
   * Initialization
   */
  private construct() {
    prepareLineAbbreviations()
  }

  /**
   * Rebuilds the entity graph on server startup, and retires any rules that
   * refer to data model elements that have been removed.
   */
  public static function buildRuleGraph() {
    try {
      Transaction.runWithNewBundle(\ bundle -> {
        new RuleEntityGraphBuilder().rebuildRuleGraph()
      })
    } catch(e : Exception) {
      _logger.error(e)
      throw e
    }
  }

  /**
   * buildRuleGraph: Instance signature with bundle; Called from
   * static buildRuleGraph signature above.
   */
  private function rebuildRuleGraph() {
    _logger.info("Building rule entity graph")

    // LEVEL 1.  Load Root
    var root = RuleEntityGraph.Instance.Root

    // LEVEL 2. Load root's direct children.
    //root is parent
    var rootChildren = typekey.RuleEntityGraphRoot_Ext.getTypeKeys(false)

    for (aRootChild in rootChildren) {
      var node = new RuleEntityGraphNode(aRootChild.Code,
          typekey.RuleEntityNodeType_Ext.TC_ENTITY,
          /* isInternal */ true,
          root)

      // save policyperiod node's public id for LEVEL3.POLICYLINEs below
      if (aRootChild == typekey.RuleEntityGraphRoot_Ext.TC_POLICYPERIOD) {
        _policyPeriodNode = node
      }
    }

    // LEVEL 3a. PolicyPeriod's RulePolicyLine children
    //pass root child node's (i.e. polPer's) PID, which is parent to all "line" nodes
    processRulePolicyLines()

    // LEVEL 3b-4. PolicyPeriod's other children + PolicyLine's children
    // Note: In order to increase the depth of the entity tree,
    // below should be implemented recursively
    var allInternalNodes = root.Descendants

    for (node in allInternalNodes) {

      var currParent = node

      var nodeType = node.GosuType

      /* Note: The types of nodes included in the tree would be adjusted here. */
      var nodeChildren = nodeType.TypeInfo.Properties.where(
          \ i -> i.FeatureType.Array
              and not i.Deprecated
              and not i.Hidden)

      for (aNodeChild in nodeChildren) {
        _logger.debug("Examining " + currParent + '.' + aNodeChild)
        if (!isSpecialNodeFilter(aNodeChild, currParent)) {
          new RuleEntityGraphNode(aNodeChild.Name,
            typekey.RuleEntityNodeType_Ext.TC_ARRAY,
            /* isInternal */ false,
            currParent)
        }
      }
    }

    RuleEntityGraph.Instance.flatten()

    // Find all rules that apply to nodes that no longer exist
    var allPaths = root.Descendants.map(\ node -> node.Path).toTypedArray()
    var rulesToRetire = Query.make(Rule_Ext)
        .compareNotIn(Rule_Ext#GraphNodePath, allPaths)
        .select()
    for (var rule in rulesToRetire) {
      _logger.debug("Retiring rule " + rule + " with path "
          + rule.GraphNodePath)
      Transaction.Current.add(rule).remove()
    }
  }

  /**
   * isSpecialNodeFilter
   */
  private function isSpecialNodeFilter(nodeChild : IPropertyInfo,
                                       currParent : RuleEntityGraphNode) : boolean {
    var returnVar = false

    // Special Node Filter 1:  remove PolicyPeriod.<line>Transactions arrays
    // for lines not in PolicyLine RulePolicyLine typefilter
    if (currParent == _policyPeriodNode
        and nodeChild.Name.contains("Transactions")
        and not _productAbbrForLines.contains(nodeChild.Name.replace("Transactions", ""))) {

      returnVar = true
    }

    else if (NODE_NAMES_TO_FILTER.contains(nodeChild.Name)) {
      returnVar = true
    }

    //quick and dirty RuleDetailScreen node reduction solution
    else if (NODE_KEYWORDS_TO_FILTER.hasMatch(\ s -> nodeChild.Name.contains(s))) {
      returnVar = true
    }

    /* Include additional 'Special Node Filters' here.  For example: */
    //else if (x=y) {
    //  return true
    //}

    return returnVar
  }

  /**
   * Process PolicyPeriod's RulePolicyLine children
   */
  private function processRulePolicyLines()  {
    for (aRulePolicyLine in typekey.PolicyLine.TF_RULEPOLICYLINE.TypeKeys*.Code) {
      /*
      var polPerLineFieldNameForPolicyLine =
          PolicyLinePattern.All.firstWhere(
              \ pattern -> pattern.PolicyLineSubtype.Code == aRulePolicyLine) */

      var polPerLineFieldNameForPolicyLine =
          PolicyLinePatternLookup.All.firstWhere(
              \ pattern -> pattern.PolicyLineSubtype.Code == aRulePolicyLine)

      new RuleEntityGraphNode(polPerLineFieldNameForPolicyLine.Code,
          typekey.RuleEntityNodeType_Ext.TC_POLICYLINE,
          /* isInternal */ true,
          _policyPeriodNode)
    }
  }

  /**
   * prepareLineAbbreviations
   */
  private function prepareLineAbbreviations() {
    var polLineProdMatchStr = new HashSet<String>()

    for (line in typekey.PolicyLine.TF_RULEPOLICYLINE.TypeKeys) {
      polLineProdMatchStr.add(line.Code.replace("Line", "") )
    }

    //for (_aProduct in Product.getAll()) {
    for (_aProduct in ProductLookup.getTypeKeys(false).toList()) {
      if (polLineProdMatchStr.contains(_aProduct.Code)) {
       // _productAbbrForLines.add(_aProduct.Abbreviation)
        _productAbbrForLines.add(_aProduct.Code)
      }
    }
  }
}