package gw.diff.tree

uses gw.api.diff.DiffAdd
uses gw.api.diff.DiffItem
uses gw.api.diff.DiffProperty
uses gw.api.diff.DiffRemove
uses gw.api.diff.DiffWindow
uses gw.api.diff.node.AbstractOrderedDiffTreeNode
uses gw.api.diff.node.IDiffItemTreeNode
uses gw.api.diff.node.IDiffTreeNode
uses gw.api.diff.node.generator.DiffTreeNodeGenerator
uses gw.api.diff.node.generator.IKeyedNodeGenerator
uses gw.api.diff.node.generator.IPropertyNodeGenerator
uses gw.api.diff.node.generator.IWindowNodeGenerator
uses gw.api.diff.node.generator.PropertyNodeGenerator
uses gw.api.diff.node.key.DiffTreeNodeKey
uses gw.api.diff.schema.DiffTreeElement
uses gw.api.system.logging.LOBLoggerCategory
uses gw.api.tree.RowTreeRootNode
uses gw.commons.entity.KeyableBeanUtil
uses gw.lang.reflect.IPropertyInfo
uses gw.lang.reflect.IType

uses java.lang.StringBuffer
uses java.util.Collection
uses java.util.Collections
uses java.util.Date
uses java.util.HashMap
uses java.util.Map

/**
 * Represents a difference tree (a structured, hierarchical organization of differences {@link gw.api.diff.node.IDiffTreeNode}) for display in the UI,
 * for example during policy review, multiquote, or during a policy change.
 */
@ReadOnly
class DiffTree {
  var _root : AbstractOrderedDiffTreeNode as readonly RootNode
  var _nodeMap : Map<DiffTreeNodeKey, AbstractOrderedDiffTreeNode> as readonly NodeMap
  var _addNodeGenerators : Map<IType, IKeyedNodeGenerator> as readonly AddNodeGenerators
  var _removeNodeGenerators : Map<IType, IKeyedNodeGenerator> as readonly RemoveNodeGenerators
  var _propNodeGenerators : Map<IType, IPropertyNodeGenerator> as readonly PropNodeGenerators
  var _windowNodeGenerators : Map<IType, IWindowNodeGenerator> as readonly WindowNodeGenerators
  var _reason : DiffReason as readonly Reason

  /**
   * Constructs a {@link gw.diff.tree.DiffTree} with the passed list of diff <code>items</code> using the difference tree
   * configuration file specified by the passed <code>configFile</code> to create and structure nodes.  Only
   * {@link gw.api.diff.DiffProperty}, {@link gw.api.diff.DiffAdd}, and {@link gw.api.diff.DiffRemove} items will be used to create nodes; so any
   * other types of items will be ignored.
   *
   * @param items       a {@link java.util.List} of items to be used to create the tree
   * @param configFile  the name of a {@link java.io.File} that contains the XML that describes how the items should be ordered
   * @param diffReason  the {@link typekey.DiffReason} the tree is being created
   */
  construct(items : List<DiffItem>, configFile : String, diffReason : DiffReason) {
    // Parse the passed configuration file into a DiffTreeElement.
    var diffTreeElement = DiffTreeElement.parse(configFile)
    _reason = diffReason

    // Use the above DiffTreeElement to set up a tree of node generators.
    _addNodeGenerators = new HashMap<IType, IKeyedNodeGenerator>()
    _removeNodeGenerators = new HashMap<IType, IKeyedNodeGenerator>()
    _propNodeGenerators = new HashMap<IType, IPropertyNodeGenerator>()
    _windowNodeGenerators = new HashMap<IType, IWindowNodeGenerator>()
    diffTreeElement.addAllNodeGenerators(_addNodeGenerators, _removeNodeGenerators, _propNodeGenerators, _windowNodeGenerators)

    // Pre-populate the node map with a root difference tree node.
    _nodeMap = new HashMap<DiffTreeNodeKey, AbstractOrderedDiffTreeNode>()
    _root = DiffTreeNodeGenerator.INSTANCE.getOrCreateRootNode(_nodeMap)

    // Initialize the node map based on the passed DiffItems.
    for (item in items) {
      if (item.Property) {
        addChangerNode(item.asProperty())
      } else if (item.Add) {
        addAdderNode(item.asAdd())
      } else if (item.Remove) {
        addRemoverNode(item.asRemove())
      } else if (item.Window) {
        addWindowNode(item.asWindow())
      } else {
        // Other diff items types are, for now, ignored.
        LOBLoggerCategory.DIFF.debug("Ignoring diff item: " + item)
      }
    }
  }

  /**
   * Return an ordered {@link java.util.Collection} of the top level root sections ordered by their <code>sortOrder</code> properties.
   *
   * @return An ordered {@link java.util.Collection} of the top level root sections ordered by their <code>sortOrder</code> properties.
   */
  final property get Sections() : Collection<IDiffTreeNode> {
    return RootNode.Children
  }

  /**
   * Return a list of diff item diff tree nodes
   *
   * @param node    a diff tree {@link gw.api.diff.node.IDiffTreeNode}
   * @param list    list of abstract diff item @{link IDiffItemTreeNode} diff tree nodes to add to
   * @return        A list of diff item diff tree {@link gw.api.diff.node.IDiffItemTreeNode}
   */
  function getDiffItemDiffTreeNodes(node : IDiffTreeNode, list : List<IDiffItemTreeNode>) : List<IDiffItemTreeNode> {
    if (node typeis IDiffItemTreeNode) {
      list.add(node)
    }
    node.Children.each(\ child -> getDiffItemDiffTreeNodes(child, list))
    return list
  }

  /**
   * Return a {@link java.lang.String} that represents a particular {@link entity.KeyableBean}'s
   * {@link gw.lang.reflect.IPropertyInfo}
   *
   * @param entity    the {@link entity.KeyableBean} from which you wish to retrieve the {@link gw.lang.reflect.IPropertyInfo}
   * @param prop      the {@link gw.lang.reflect.IPropertyInfo} you wish to retrieve from the {@link entity.KeyableBean}
   * @return          a {@link java.lang.String} that represents a particular {@link entity.KeyableBean}'s {@link gw.lang.reflect.IPropertyInfo}
   */
  function getPropertyValueAsString(entity : KeyableBean, prop : IPropertyInfo) : String {
    var generator = _propNodeGenerators.get(KeyableBeanUtil.getProductModelAwareEntityType(entity)) as PropertyNodeGenerator
    return generator.getPropertyValueAsString(entity, prop)
  }

  /**
   * Return a human readable representation of the entire {@link gw.diff.tree.DiffTree}
   *
   * @return A {@link java.lang.String} human readable representation of the entire {@link gw.diff.tree.DiffTree}
   */
  override function toString() : String {
    var output = new StringBuffer()
    var nodes = Sections
    for (node in nodes) {
      output.append(treeAsString(0, node))
    }
    return output.toString()
  }

  // ---------- private helper methods ----------

  /**
   * Adds a change node for a {@link gw.api.diff.DiffProperty}.
   *
   * @param item    the {@link gw.api.diff.DiffProperty} that needs to be added to the tree as a changed item
   * @return        the {@link gw.api.diff.node.AbstractOrderedDiffTreeNode} that was added to the tree as a change
   */
  protected function addNodeForChange(item : DiffProperty) : AbstractOrderedDiffTreeNode {
    var type = KeyableBeanUtil.getProductModelAwareEntityType(item.Bean)
    var date = calcEffDate(item, _reason)
    return createNodeForType(_propNodeGenerators, type, \ generator -> generator.createChangeNode(item.Bean, item.BasedOn, item.PropertyInfo, _nodeMap, date))
  }

  //prevents overridable function from being called inside constructor
  private function addChangerNode(item : DiffProperty) : AbstractOrderedDiffTreeNode {
    return addNodeForChange(item)
  }

  /**
   * Adds an add node for a {@link gw.api.diff.DiffProperty}.
   *
   * @param item  the {@link gw.api.diff.DiffProperty} that needs to be added to the tree as an Add item
   * @return      the {@link gw.api.diff.AbstractOrderedDiffTreeNode} that was added to the tree as an Add
   */
  protected function addNodeForAdd(item : DiffAdd) : AbstractOrderedDiffTreeNode {
    var type = KeyableBeanUtil.getProductModelAwareEntityType(item.Bean)
    var date = calcEffDate(item, _reason)
    return createNodeForType(_addNodeGenerators, type, \ generator -> generator.getOrCreateNode(item.Bean, date, _nodeMap))
  }

  //prevents overridable function from being called inside constructor
  private function addAdderNode(item : DiffAdd) : AbstractOrderedDiffTreeNode {
    return addNodeForAdd(item)
  }

  /**
   * Adds a remove node for  a {@link gw.api.diff.DiffProperty}.
   *
   * @param item - The {@link gw.api.diff.DiffProperty} that needs to be added to the tree as a Remove item
   * @return The {@link gw.api.diff.node.AbstractOrderedDiffTreeNode} that was added to the tree as a Remove
   */
  protected function addNodeForRemove(item : DiffRemove) : AbstractOrderedDiffTreeNode {
    var type = KeyableBeanUtil.getProductModelAwareEntityType(item.Bean)
    var date = calcEffDate(item, _reason)
    return createNodeForType(_removeNodeGenerators, type, \ generator -> generator.getOrCreateNode(item.Bean, date, _nodeMap))
  }

  //prevents overridable function from being called inside constructor
  private function addRemoverNode(item : DiffRemove) : AbstractOrderedDiffTreeNode {
    return addNodeForRemove(item)
  }

  /**
   * Adds a window node for a {@link gw.api.diff.DiffProperty}.
   *
   * @param item  the {@link gw.api.diff.DiffProperty} that needs to be added to the tree as a Window item
   * @return      the {@link gw.api.diff.node.AbstractOrderedDiffTreeNode} that was added to the tree as a Window
   */
  protected function addNodeForWindow(item : DiffWindow) : AbstractOrderedDiffTreeNode {
    var type = KeyableBeanUtil.getProductModelAwareEntityType(item.Bean)
    var date = calcEffDate(item, _reason)
    return createNodeForType(_windowNodeGenerators, type, \ generator -> generator.createWindowChangeNode(item.EffDatedBean, _nodeMap, date))
  }

  //prevents overridable function from being called inside constructor
  private function addWindowNode(item : DiffWindow) : AbstractOrderedDiffTreeNode {
    return addNodeForWindow(item)
  }

  /**
   * Invokes the passed <code>createNode</code> block on the generator from the passed <code>map</code>
   * matching the passed <code>type</code>.  If no generator can be located for the <code>type</code>,
   * nothing will be generated.
   *
   * @param map        map of types to node generators.
   * @param type       key of the generator to use in {@link java.util.Map}.
   * @param createNode block to invoke for node creation.
   */
  private static function createNodeForType<T>(map : Map<IType, T>, type : IType, createNode(generator : T) : AbstractOrderedDiffTreeNode)  : AbstractOrderedDiffTreeNode {
    if (map.containsKey(type)) {
      var generator = map.get(type)
      return createNode(generator)
    } else {
      // This item is for an unrecognized type.
      LOBLoggerCategory.DIFF.debug("Ignoring diff item for unrecognized type: " + type)
      return null
    }
  }

  /**
   * Constructs and returns a String representation of the tree rooted at the passed <code>node</code> starting
   * at the specified <code>depth</code>.
   *
   * @param depth Number of indents to use for the returned String.
   * @param node  Root of the tree to convert to String form.
   */
  private static function treeAsString(depth : int, node : IDiffTreeNode) : String {
    var output = new StringBuffer("\n")
    for (i in 0..|depth) {
      output.append("  ")
    }
    output.append(node.toString())
    for (child in node.Children) {
      output.append(treeAsString(depth + 1, child))
    }
    return output.toString()
  }

  /**
   * Calculates the item's effective date.
   *
   * @param item      the {@link gw.api.diff.DiffItem} of which you want the effective date
   * @param reason    the {@link DiffReason} the diff code is being called
   * @return          null if the item's effective date matches the branch edit effective date or if
   *                  the reason is 'MultiVersionJob' or 'CompareJobs' otherwise return the diff item's
   *                  effective date.
   */
  protected static function calcEffDate(item : DiffItem, reason : DiffReason) : DateTime {
    var effDate : DateTime = null
    if (reason == null or (not item.EffDated) or
        reason == DiffReason.TC_MULTIVERSIONJOB or reason == DiffReason.TC_COMPAREJOBS){
      effDate = null
    } else {
      var effBean = item.EffDatedBean
      var branchEditEffDate = effBean.BranchUntyped.EditEffectiveDate
      var effBeanEffDate = item.Remove ? effBean.ExpirationDate : effBean.EffectiveDate

      if (branchEditEffDate != effBeanEffDate){
        effDate = effBeanEffDate
      }
    }
    return effDate
  }

  /**
   * For policy review diff pages, create the root tree node which is used for
   * displaying the diff tree
   *
   * @param policyPeriod      the current policy period
   * @return RowTreeRootNode  the root node of the diff tree
   */
  static function recalculateRootNodeForPolicyReview(policyPeriod : PolicyPeriod) : RowTreeRootNode {
    return recalculateRootNode(policyPeriod, policyPeriod, "PolicyReview")
  }

  /**
   * Creates a new {@link DiffTree} when the user has chosen to resolve conflicts
   *
   * @param policyPeriod      the policy period that contains the conflict
   * @param diffItems         the list of {@link gw.api.diff.DiffItem} that caused the conflict
   * @return                  a {@link RowTreeRootNode} of {@link gw.api.diff.DiffItem} that has a new root node
   */
  static function recalculateRootNodeForPreemptionConflicts(policyPeriod : PolicyPeriod, diffItems : DiffItem[]) : RowTreeRootNode {
    var diffTreeConfig = policyPeriod.Policy.Product.DiffTreeConfig
    var diffTree = new DiffTree(diffItems.toList(), diffTreeConfig, DiffReason.TC_APPLYCHANGES)
    return new RowTreeRootNode(diffTree.Sections.toList(), \ o -> (o as IDiffTreeNode).Children.toList(), \ o -> (o as IDiffTreeNode).IsTitle)
  }

  /**
   * Create the root tree node which is used for displaying the diff tree, based
   * on a particular diff reason
   * @param p1                the first policy period that we're comparing
   * @param p2                the second policy period that we're comparing
   * @param diffReason        the reason used to generate the diffs.
   * @return RowTreeRootNode  the root node of the diff tree
   */
  static function recalculateRootNode(p1 : PolicyPeriod, p2 : PolicyPeriod, diffReason : DiffReason) : RowTreeRootNode {
    var diffTreeConfig = p1.Policy.Product.DiffTreeConfig
    if (diffTreeConfig != null) {
      var items : List<DiffItem>
      if (p1 != null and p2 != null and diffReason != "PolicyReview") {
        items = p1.compareTo(diffReason, p2).toList()
      } else if (p1 != null) {
        items = p1.getDiffItems(diffReason)
      } else {
        items = Collections.emptyList<DiffItem>()
      }
      var diffTree = new DiffTree(items, diffTreeConfig, diffReason)
      LOBLoggerCategory.DIFF.debug("Using BP7 DiffTree override")
      return new RowTreeRootNode(diffTree.Sections.toList(), \ o -> (o as IDiffTreeNode).Children.toList(), \ o -> true)
    }
    return null
  }
}
