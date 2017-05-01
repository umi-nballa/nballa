package una.utils

uses gw.xml.XmlElement
uses java.io.File
uses java.util.ArrayList
uses gw.xml.XmlSerializationOptions

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 4/27/17
 * Time: 3:09 PM
 * To change this template use File | Settings | File Templates.
 * sorts and
 */
class Rule_ExtSorter {
  private final var PUBLIC_ID = "public-id"
  private final var RULE_TYPES = {"UWRule_Ext", "ValidationRule_Ext", "AutoupdateRule_Ext"}
  private final var RELATED_ENTITY_NODES = {"RuleJob_Ext", "ValidationRuleVehType_Ext", "RulePolicyType_Ext", "RuleJurisdiction_Ext"}
  private final var META_DATA_NODES = {"referenced-entity", "typekey"}

  var _xml : XmlElement
  var _file : File

  construct(file : File){
    this._xml = XmlElement.parse(file)
    _file = file
  }

  function sortAndOverwrite(){
    if(_file.exists()){
      var newChildren : ArrayList<XmlElement>  = {}
      var ruleNodes = _xml.Children.where( \ child -> RULE_TYPES.containsIgnoreCase(child.QName.LocalPart))
      var metaDataNodes : List<XmlElement> = {}

      ruleNodes.sortBy(\ row -> row.getAttributeValue(PUBLIC_ID))

      ruleNodes?.each( \ ruleNode -> {
        newChildren.add(ruleNode)
        var relatedNodes = _xml.Children.where( \ child -> RELATED_ENTITY_NODES.containsIgnoreCase(child.QName.LocalPart) and child.getAttributeValue("Rule")?.equalsIgnoreCase(ruleNode.getAttributeValue("id")))
        relatedNodes.sortBy(\ node -> node.getAttributeValue(PUBLIC_ID))

        newChildren.addAll(relatedNodes)
      })

      metaDataNodes = _xml.Children.where( \ child -> META_DATA_NODES.containsIgnoreCase(child.QName.LocalPart))
      metaDataNodes.sortBy( \ node -> node.getAttributeValue(PUBLIC_ID))

      metaDataNodes?.each( \ metaDataNode -> {
        newChildren.add(metaDataNode)
      })

      var xmlOptions = new XmlSerializationOptions()
      xmlOptions.AttributeIndent = 2
      xmlOptions.AttributeNewLine = true
      xmlOptions.Pretty = true
      xmlOptions.XmlDeclaration = true

      var qName = _xml.QName
      var root = new XmlElement(qName)
      _xml.DeclaredNamespaces.each( \ declaredNamespace -> root.declareNamespace(declaredNamespace.Second, declaredNamespace.First))

      _xml.AttributeNames.each( \ attribute -> root.setAttributeValue(attribute, _xml.getAttributeValue(attribute)))

      newChildren.each( \ child -> {
        root.addChild(child)
      })

      _file.write(root.asUTFString(xmlOptions))
    }
  }
}