package gw.accelerator.ruleeng

uses gw.api.system.logging.LoggerFactory

uses java.lang.Exception
uses java.util.ArrayList
uses java.util.Collection
uses java.util.HashMap
uses java.util.Map

/**
 * RuleEntityGraph provides a cache for the set of all RuleEntityGraphNode
 * instances.
 */
class RuleEntityGraph {
  /** Class logger. */
  static final var LOGGER = LoggerFactory.getLogger(RulesEngine.LOG_CATEGORY,
      "RuleEntityGraph")

  /** Singleton instance. */
  static final var INSTANCE : RuleEntityGraph as readonly Instance
      = new RuleEntityGraph()

  /** The root node. */
  var _root : RuleEntityGraphNode as readonly Root = new RuleEntityGraphNode()

  /**
   * A cache of nodes indexed by their node name. Node name isn't globally
   * unique, so the value type is a collection.
   */
  var _nodesByName = new HashMap<String, Collection<RuleEntityGraphNode>>()

  /**
   * A cache of nodes indexed by their path. Path is unique.
   */
  var _nodesByPath = new HashMap<String, RuleEntityGraphNode>()

  /** Private constructor for singleton. */
  private construct() {
    LOGGER.debug("Constructing new instance")
  }

  /**
   * This method builds the caches by name and path. This method should only
   * be called from {@link RuleEntityGraphBuilder}.
   */
  function flatten() {
    _nodesByName.clear()
    _nodesByPath.clear()

    _nodesByName[Root.NodeName] = {Root}
    _nodesByPath[Root.Path] = Root
    for (var node in Root.Descendants) {
      var key = node.NodeName.toLowerCase()
      var matches = _nodesByName[key]
      if (matches == null) {
        matches = new ArrayList<RuleEntityGraphNode>(2)
        _nodesByName[key] = matches
      }
      matches.add(node)
      _nodesByPath[node.Path] = node
    }
  }

  /**
   * Given a node name, finds the corresponding node.
   */
  @Param("node", "The node name to search for")
  @Returns("The matching node")
  @Throws(Exception, "Thrown if no matching node (or more than one) is found")
  function findNamedNode(node : String) : RuleEntityGraphNode {
    LOGGER.debug("Finding node named " + node)
    var matches = _nodesByName[node.toLowerCase()]

    if (matches.Count == 1) {
      return matches.first()
    } else {
      throw "Matching node ${node} not unique or not found"
    }
  }

  /**
   * Given a root object, finds the corresponding top node in the
   * entity tree.
   */
  /**
   * Looks up a entity graph node by its path in the tree.
   */
  @Param("path", "The path from the root to the node")
  @Returns("The node at the given path")
  function findByPath(path : String) : RuleEntityGraphNode {
    return _nodesByPath[path]
  }

  /**
   * This method traverses the entity graph once to get the corresponding
   * values from the given root entity.
   */
  @Param("rootObject", "The root of rule execution")
  @Param("nodes", "The nodes of the graph to retrieve")
  @Returns("The corresponding entity values from the rootObject")
  function getEntities(rootObject : Object,
                       nodes : Collection<RuleEntityGraphNode>)
      : Map<RuleEntityGraphNode, Object> {
    if (LOGGER.DebugEnabled) {
      LOGGER.debug("Getting values " + nodes + " from " + rootObject)
    }

    var result = new HashMap<RuleEntityGraphNode, Object>()
    // Order to avoid cache misses
    var topNodeName = RuleEntityGraphNode.nodeNameForObject(rootObject)
    result[findNamedNode(topNodeName)] = rootObject
    for (var node in nodes.orderBy(\ node -> node.Path)) {
      result[node] = node.getValueFromParents(result)
    }

    if (LOGGER.DebugEnabled) {
      LOGGER.debug("Before retain: " + result)
    }

    // Remove any intermediate values that may have been added to the map
    result.retainWhereKeys(\ node -> nodes.contains(node))
    if (LOGGER.DebugEnabled) {
      LOGGER.debug("After retain: " + result)
    }

    return result
  }
}
