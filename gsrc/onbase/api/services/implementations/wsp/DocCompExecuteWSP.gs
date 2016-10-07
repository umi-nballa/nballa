package onbase.api.services.implementations.wsp

uses gw.api.util.Logger
uses gw.xml.XmlElement
uses gw.xml.XmlSerializationOptions
uses gw.xml.XmlSimpleValue

uses onbase.api.services.datamodels.Keyword
uses onbase.api.services.interfaces.DocCompExecuteInterface
uses onbase.api.Settings

uses javax.xml.namespace.QName
uses onbase.api.exception.ServiceErrorCodeException

/**
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/30/2015 - dlittleton
 *     * Initial implementation.
 */

/**
 * Implementation of the DocCompExecute interface using WSP.
 *
 * Note that this service call makes use of a Unity Script. Script responses
 * are not represented in the WSDL, so some manual Xml parsing is used.
 */
class DocCompExecuteWSP implements DocCompExecuteInterface {

  private var logger = Logger.forCategory(Settings.ServicesLoggerCategory)

  /**
   * Create a document from template.
   *
   * @param templateID The template id.
   * @param keywords The keyword values for this document.
   * @param xmlPayload The extra xml payload to be used to create the document.
   *
   * @return Newly created document id.
   */
  public override function createDocumentFromTemplate(templateID: long, keywords: List <Keyword>, xmlPayload: XmlElement): String {
    logger.debug("Start executing createDocumentFromTemplate() using WSP service.")

    var service = new onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.ports.EISClientWithConfig_BasicHttpBinding_HylandOutBoundContract()
    var executeRequest = new ExecuteTemplateRequest(templateID)
    executeRequest.addParameters(keywords)
    executeRequest.addData(xmlPayload)

    var response = new ExecuteTemplateResponse(service.DocComp(executeRequest.toString()))
    if (response.HasError){
      throw new ServiceErrorCodeException(response.ErrorMessage)
    }


    if (logger.isDebugEnabled()) {
      logger.debug("Finished executing createDocumentFromTemplate() using WSP service: ${response.DocumentID}")
    }

    return response.DocumentID
  }

  /**
   * Helper class to properly format the request as Xml
   * <hyl:ExecuteTemplate xmlns:hyl="NAMESPACE">
   *   <Parameters>
   *     <param><name>foo</name><value>bar</value>
   *     ...
   *   </Parameters>
   *   <Data><ExecuteMessage>xmlPayload</ExecuteMessage></Data>
   * </hyl:ExecuteTemplate>
   */
  private static class ExecuteTemplateRequest {

    // XML namespace and prefix expected by the template request.
    private static final var NAMESPACE = "http://Hyland.Integrations.Guidewire.Mapping.DocumentComposition"
    private static final var NAMESPACE_PREFIX = "hyl"

    // Root element of the request
    private static final var REQUEST_ROOT = "ExecuteTemplate"

    // Template ID Attribute
    private static final var TEMPLATE_ID_ATTR = "TemplateID"

    // Contains a list of parameters
    private static final var PARAMETERS_LIST_ELEM = "Parameters"

    // Parameter elements
    private static final var PARAM_ELEM = "param"
    private static final var PARAM_NAME_ELEM = "name"
    private static final var PARAM_VALUE_ELEM = "value"

    // Embedded data elements
    private static final var DATA_ELEM = "Data"
    private static final var EXECUTE_MESSAGE_ELEM = "ExecuteMessage"

    private var _xml : XmlElement

    construct(templateID: long){
      _xml = new XmlElement(new QName(NAMESPACE, REQUEST_ROOT, NAMESPACE_PREFIX))
      _xml.setAttributeSimpleValue(TEMPLATE_ID_ATTR, XmlSimpleValue.makeStringInstance(templateID as String))
    }

    public function addParameters(keywords: List<Keyword>) {
      if (keywords.Empty){
        return
      }

      var parameters = new XmlElement(PARAMETERS_LIST_ELEM)
      foreach (keyword in keywords) {
        var param = new XmlElement(PARAM_ELEM)

        var name = new XmlElement(PARAM_NAME_ELEM)
        name.SimpleValue = XmlSimpleValue.makeStringInstance(keyword.Name)

        var value = new XmlElement(PARAM_VALUE_ELEM)
        value.SimpleValue = XmlSimpleValue.makeStringInstance(keyword.Value)

        param.addChild(name)
        param.addChild(value)
        parameters.addChild(param)
      }

      _xml.addChild(parameters)
    }

    public function addData(xmlPayload: XmlElement) {
      var data = new XmlElement(DATA_ELEM)
      var executeMessage = new XmlElement(EXECUTE_MESSAGE_ELEM)

      executeMessage.addChild(xmlPayload)
      data.addChild(executeMessage)
      _xml.addChild(data)
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
  private static class ExecuteTemplateResponse {

    // Status response elements
    private static final var STATUS_ELEM = "Status"
    private static final var STATUS_CODE_ELEM = "Code"
    private static final var STATUS_MESSAGE_ELEM = "Message"
    private static final var STATUS_ERROR_CODE = "ERROR"

    // Document ID element
    private static final var DOCUMENT_ID_ELEM = "DocumentId"

    var _xml : XmlElement

    construct(responseString : String) {
      _xml = XmlElement.parse(responseString)
    }

    property get HasError() : boolean {
      return _xml.getChild(STATUS_ELEM).getChild(STATUS_CODE_ELEM).SimpleValue.StringValue == STATUS_ERROR_CODE
    }

    property get ErrorMessage() : String {
      return _xml.getChild(STATUS_ELEM).getChild(STATUS_MESSAGE_ELEM).SimpleValue.StringValue
    }

    property get DocumentID() : String {
      return _xml.getChild(DOCUMENT_ID_ELEM).SimpleValue.StringValue
    }
  }
}
