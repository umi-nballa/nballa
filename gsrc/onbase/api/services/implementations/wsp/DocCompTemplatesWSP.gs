package onbase.api.services.implementations.wsp

uses gw.api.util.Logger
uses gw.xml.XmlElement
uses gw.xml.XmlSerializationOptions
uses gw.xml.XmlSimpleValue

uses onbase.api.exception.ServicesTierException
uses onbase.api.services.datamodels.Template
uses onbase.api.services.interfaces.DocCompTemplatesInterface
uses onbase.api.Settings

uses javax.xml.namespace.QName

/**
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/30/2015 - dlittleton
 *     * Initial implementation.
 */

/**
 * Implementation of the DocCompTemplates interface using WSP.
 *
 * Note that this service call makes use of a Unity Script. Script responses
 * are not represented in the WSDL, so some manual Xml parsing is used.
 */
class DocCompTemplatesWSP implements DocCompTemplatesInterface {

  private var logger = Logger.forCategory(Settings.ServicesLoggerCategory)

    /**
   * Get document composition templates in categories.
   *
   * @param templateCategories The template categories.
   *
   * @return A list of templates in the template categories.
   */
  public override function getDocumentTemplates(templateCategories : String[]): List<Template> {
    logger.debug("Start executing getDocumentTemplates() using WSP service.")

    if (templateCategories == null) {
      logger.error("OnBase Template Categories parameter cannot be null")
      throw new ServicesTierException("OnBase Template Categories parameter cannot be null")
    }

    var service = new onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.ports.EISClientWithConfig_BasicHttpBinding_HylandOutBoundContract()
    var templateRequest = new DocumentTemplateRequest(templateCategories)

    var response = service.DocComp(templateRequest.toString())
    var templateResponse = new DocumentTemplateResponse(response)

    logger.debug("Finished executing getDocumentTemplates() using WSP service.")
    return templateResponse.Templates
  }

  /**
   * Helper class to properly format the request as Xml
   *  <hyl:TemplateRequest xmlns:hyl="NAMESPACE">
   *  <Categories>
   *    <Category name="category1"/>
   *    ...
   *  </Categories>
   *  </hyl:TemplateRequest>
   */
  private static class DocumentTemplateRequest {

    // XML namespace and prefix expected by the template request.
    private static final var NAMESPACE = "http://Hyland.Integrations.Guidewire.Mapping.DocumentComposition"
    private static final var NAMESPACE_PREFIX = "hyl"

    // Root element of the request
    private static final var REQUEST_ROOT = "TemplateRequest"

    // Contains a list of categories
    private static final var CATEGORIES_ELEM = "Categories"

    // Individual category element
    private static final var CATEGORY_ELEM = "Category"

    // Attribute on categories containing the category name
    private static final var NAME_ATTR = "name"


    private var _xml : XmlElement

    construct(categories : String[]) {
      _xml = new XmlElement(new QName(NAMESPACE, REQUEST_ROOT, NAMESPACE_PREFIX))

      var categoriesNode = new XmlElement(CATEGORIES_ELEM)
      foreach (category in categories) {
        var categoryNode = new XmlElement(CATEGORY_ELEM)
        categoryNode.setAttributeSimpleValue(NAME_ATTR, XmlSimpleValue.makeStringInstance(category))

        categoriesNode.addChild(categoryNode)
      }

      _xml.addChild(categoriesNode)
    }

    public override function toString() : String {
      // Xml fragment, skip declaration
      var options = new XmlSerializationOptions()
      options.XmlDeclaration = false

      return _xml.asUTFString(options)
    }
  }

  /**
   * Helper class to parse the Xml response
   */
  private static class DocumentTemplateResponse {

    // Contains a list of templates in the response
    private static final var TEMPLATE_LIST_ELEM = "TemplateInfoList"

    // Individual template element
    private static final var TEMPLATE_ELEM = "Template"

    // Attribute that contains the parent category of the template
    private static final var CATEGORY_ATTR = "templateName"

    // Attribute that contains the ID of the template
    private static final var ID_ATTR = "id"

    // Attribute that contains the Name of the template
    private static final var NAME_ATTR = "name"

    private var _xml : XmlElement

    construct(xmlString : String) {
      _xml = XmlElement.parse(xmlString)
    }

    private function xmlToTemplateModel(elem : XmlElement) : Template {
      var template = new Template()
      template.Category = elem.getAttributeSimpleValue(CATEGORY_ATTR).StringValue
      template.ID = java.lang.Long.getLong(elem.getAttributeSimpleValue(ID_ATTR).StringValue)
      template.Name = elem.getAttributeSimpleValue(NAME_ATTR).StringValue

      return template
    }

    property get Templates() : List<Template> {
      var templateResponses = _xml.getChild(TEMPLATE_LIST_ELEM).getChildren(TEMPLATE_ELEM)
      return templateResponses.map( \ elem -> xmlToTemplateModel(elem))
    }


  }
}
