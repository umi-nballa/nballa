package onbase.api.services.implementations.wsp

uses gw.api.util.Logger
uses gw.xml.XmlElement
uses gw.xml.XmlSerializationOptions
uses gw.xml.XmlSimpleValue

uses onbase.api.services.datamodels.Keyword
uses onbase.api.services.interfaces.CreateUnityFormInterface
uses onbase.api.Settings

uses onbase.api.exception.ServiceErrorCodeException
uses onbase.api.services.interfaces.CreateUnityFormInterface

/**
 * Hyland Build Version: 0.0.0.0
 *
 * Last Changes:
 *   01/21/2016 - csandham
 *     * Initial implementation.
 */

/**
 * Implementation of the DocCompExecute interface using WSP.
 *
 * Note that this service call makes use of a Unity Script. Script responses
 * are not represented in the WSDL, so some manual Xml parsing is used.
 */
class CreateUnityFormWSP implements CreateUnityFormInterface {

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
  public override function createUnityForm(unityFormName: String, keywords: List <Keyword>): String {
    logger.debug("Start executing createDocumentFromTemplate() using WSP service.")

    var service = new onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.ports.EISClientWithConfig_BasicHttpBinding_HylandOutBoundContract()
    var executeRequest = new CreateUnityFormRequest(unityFormName)
    executeRequest.addParameters(keywords)

      var response = new ExecuteResponse(service.CreateUnityForm(executeRequest.toString()))
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
  private static class CreateUnityFormRequest {

    // XML namespace and prefix expected by the template request.
    private static final var NAMESPACE = "http://Hyland.Integrations.Guidewire.Mapping.DocumentComposition"
    private static final var NAMESPACE_PREFIX = "hyl"

    // Root element of the request
    private static final var REQUEST_ROOT = "CreateUnityFormRequest"

    // Template ID Attribute
    private static final var FORM_NAME = "UnityFormTemplateName"

    // Contains a list of parameters
    private static final var PARAMETERS_LIST_ELEM = "Fields"

    // Parameter elements
    private static final var PARAM_ELEM = "Field"
    private static final var PARAM_NAME_ELEM = "Name"
    private static final var PARAM_VALUE_ELEM = "Value"

    private var _xml : XmlElement

    construct(unityFormName: String){
      _xml = new XmlElement(REQUEST_ROOT)
      var name = new XmlElement(FORM_NAME)
      name.Text = unityFormName
      _xml.addChild(name)
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
  private static class ExecuteResponse {

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