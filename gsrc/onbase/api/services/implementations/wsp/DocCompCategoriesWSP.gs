package onbase.api.services.implementations.wsp

uses gw.api.util.Logger
uses gw.xml.XmlElement
uses gw.xml.XmlSerializationOptions

uses onbase.api.services.datamodels.Category
uses onbase.api.services.interfaces.DocCompCategoriesInterface
uses onbase.api.Settings

/**
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   02/05/2015 - dlittleton
 *     * Initial implementation.
 */

/**
 * Implementation of the DocCompCategories interface using WSP.
 *
 * Note that this service call makes use of a Unity Script. Script responses
 * are not represented in the WSDL, so some manual Xml parsing is used.
 */
//TODO: REMOVE THIS CLASS?
class DocCompCategoriesWSP implements DocCompCategoriesInterface {

  private var logger = Logger.forCategory(Settings.ServicesLoggerCategory)


  /**
   * Get document composition template categories.
   *
   * @return A list of template categories.
   */
  public override function getDocumentTemplateCategories(): List<Category> {
    logger.debug("Start executing getDocumentTemplateCategories() using WSP service.")

   //TODO: OnBase - commented out awaiting taxonomy. Also, changed to return null
 /*   var service = new onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.ports.EISClientWithConfig_BasicHttpBinding_HylandOutBoundContract()
    var response = service.DocComp(new TemplateCategoryRequest().toString())

    var categoryResponse = new TemplateCategoryResponse(response)

    logger.debug("Finished executing getDocumentTemplateCategories() using WSP service.")
    return categoryResponse.Categories*/
    return null
  }

  /**
   * Helper class to properly format the request as Xml
   *
   * <CategoryRequest/>
   */
  private static class TemplateCategoryRequest{
    // Root xml element for category requests.
    private static final var CATEGORY_REQUEST = "CategoryRequest"

    private var _xml = new XmlElement(CATEGORY_REQUEST)

    public override function toString() : String {
      // Xml fragment, skip declaration
      var options = new XmlSerializationOptions()
      options.XmlDeclaration = false

      return _xml.asUTFString(options)
    }
  }

  /**
   * Helper class to parse Xml response
   */
  private static class TemplateCategoryResponse {

    // Contains list of Categories
    private static final var CATEGORY_LIST_ELEM = "CategoryInfoList"

    // Individual category element
    private static final var CATEGORY_ELEM = "Category"

    // Category ID
    private static final var ID_ATTR = "id"

    // Category name
    private static final var NAME_ATTR = "name"

    private var _xml : XmlElement

    construct(xmlString: String) {
      _xml = XmlElement.parse(xmlString)
    }

    private function xmlToCategoryModel(elem: XmlElement) : Category {
      var category = new Category()
      category.ID = elem.getAttributeSimpleValue(ID_ATTR).StringValue
      category.Name = elem.getAttributeSimpleValue(NAME_ATTR).StringValue

      return category
    }

    property get Categories() : List<Category> {
      var categoryResponses = _xml.getChild(CATEGORY_LIST_ELEM).getChildren(CATEGORY_ELEM)
      return categoryResponses.map( \ elem -> xmlToCategoryModel(elem) )
    }
  }

}
