package gw.accelerator.ruleeng

uses gw.lang.reflect.IType
uses gw.lang.reflect.ReflectUtil
uses gw.lang.reflect.TypeSystem
uses gw.pl.logging.LoggerFactory

uses java.util.ArrayDeque
uses java.util.ArrayList
uses java.util.Collection
uses java.util.Collections
uses java.util.Deque
uses java.util.List
uses java.util.Map

/**
 * Describes an entry in the graph of entities that can be operated on using the rules framework accelerator.
 */
class RuleEntityGraphNode {
  /**
   * The name of the root node.
   */
  public static final var ROOT_NODE_NAME : String = "root"

  /** Class logger. */
  static final var LOGGER = LoggerFactory.getLogger(RulesEngine.LOG_CATEGORY,
      "RuleEntityGraphNode")

  var _nodeType : typekey.RuleEntityNodeType_Ext as readonly NodeType
  var _nodeName : String as readonly NodeName
  var _internal : boolean as readonly Internal
  var _parent : RuleEntityGraphNode as readonly ParentNode
  var _path : String as readonly Path
  var _children = new ArrayList<RuleEntityGraphNode>()

  construct() {
    _nodeName = ROOT_NODE_NAME
    _nodeType = TC_ROOT
    _internal = true
    _path = ROOT_NODE_NAME
  }

  construct(nodeName : String,
            nodeType : typekey.RuleEntityNodeType_Ext,
            isInternal : boolean,
            parent : RuleEntityGraphNode) {
    _nodeName = nodeName
    _nodeType = nodeType
    _internal = isInternal
    _parent = parent
    _path = parent.Path + "." + nodeName
    _parent.addToChildren(this)
  }

  private function addToChildren(node : RuleEntityGraphNode) {
    _children.add(node)
  }

  property get GosuType() : IType {
    return TypeSystem.getByRelativeName(NodeName)
  }

  property get Children() : Collection<RuleEntityGraphNode> {
    return Collections.unmodifiableList(_children)
  }

  property get Descendants() : Collection<RuleEntityGraphNode> {
    var result = new ArrayList<RuleEntityGraphNode>()
    addDescendants(result)
    return result
  }

  private function addDescendants(accumulator : List<RuleEntityGraphNode>) {
    _children.each(\ child -> {
      accumulator.add(child)
      child.addDescendants(accumulator)
    })
  }

  /**
   * Gets the value of the property represented by this node from the
   * corresponding object in the entity model.
   */
  @Param("obj", "The object")
  @Returns("The value of the property this node represents from the object")
  function getValue(obj : Object) : Object {
    return ReflectUtil.getProperty(obj, NodeName)
  }

  function getValueFromParents(
      parentValues : Map<RuleEntityGraphNode, Object>) : Object {
    // Has this value already been computed, or are we a direct child of the
    // root?
    var value = parentValues[this]
    if (value == null) {
      var parentValue = parentValues[ParentNode]
      if (parentValue == null) {
        parentValue = ParentNode.getValueFromParents(parentValues)
      }
      value = getValue(parentValue)
      parentValues[this] = value
    }
    return value
  }

  @Returns("The path from this node to the root, not including the root")
  property get PathToRoot() : Deque<RuleEntityGraphNode> {
      return getPathToRoot(null)
    }

  /**
   * Traverses from the current node UP to the root object (if provided) or
   * tree root. It returns a stack of the nodes in the tree.
   */
  @Param("rootObject", "If provided, the root object")
  @Returns("The path from this node to the root object")
  function getPathToRoot(rootObject : KeyableBean)
      : Deque<RuleEntityGraphNode> {
    var topNodeName = nodeNameForObject(rootObject)

    var nodeStack = new ArrayDeque<RuleEntityGraphNode>()
    var currentNode = this
    while (currentNode.NodeName != topNodeName) {
      nodeStack.add(currentNode)
      currentNode = currentNode.ParentNode
    }

    if (currentNode.NodeType != TC_ROOT) {
      nodeStack.add(currentNode)
    }

    if (LOGGER.DebugEnabled) {
      LOGGER.debug("Path to root: " + NodeName + " -> " + nodeStack)
    }

    return nodeStack
  }

  @Param("rootObject", "If provided, the root object")
  @Returns("The name of the corresponding graph node")
  static function nodeNameForObject(rootObject : Object) : String {
    var topNodeName = ROOT_NODE_NAME
    if (rootObject != null) {
      var rootObjectType = TypeSystem.getFromObject(rootObject)
      if (rootObjectType.Array) {
        rootObjectType = rootObjectType.ArrayType
        topNodeName = rootObjectType.RelativeName + "s"
      } else {
        topNodeName = rootObjectType.RelativeName
      }
    }

    return topNodeName
  }

  @Param("nodeName", "The name of the node to find")
  @Returns("A descendant of this node with the given name, or null if there"
      + " is no such node")
  function findDescendant(nodeName : String) : RuleEntityGraphNode {
    // Check immediate children
    for (child in _children) {
      if (child.NodeName.equalsIgnoreCase(nodeName)) {
        return child
      }
    }

    // If we still haven't found it, look through grandchildren
    for (child in _children) {
      var result = child.findDescendant(nodeName)
      if (result != null) {
        return result
      }
    }

    return null
  }

  override function toString() : String {
    return "Node[" + NodeName + ']'
  }
}
