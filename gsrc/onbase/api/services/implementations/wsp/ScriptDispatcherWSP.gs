package onbase.api.services.implementations.wsp

uses gw.api.util.Logger
uses gw.xml.XmlElement
uses gw.xml.XmlSerializationOptions
uses gw.xml.XmlSimpleValue

uses java.lang.Integer
uses java.lang.Long
uses java.lang.UnsupportedOperationException
uses java.math.BigInteger
uses java.util.Hashtable

uses onbase.api.services.interfaces.ScriptDispatcherInterface
uses onbase.api.Settings
uses onbase.api.exception.UnityScriptErrorException

/**
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   02/05/2015 - dlittleton
 *     * Initial implementation.
 */

/**
 * Implementation of the ScriptDispatcher interface using WSP.
 *
 * Note that this service call makes use of a Unity Script. Script responses
 * are not represented in the WSDL, so some manual Xml parsing is used.
 */
class ScriptDispatcherWSP implements ScriptDispatcherInterface {

  private var logger = Logger.forCategory(Settings.ServicesLoggerCategory)

  /**
   * Dispatch a unity script in OnBase.
   *
   * @param scriptName The unity script name.
   * @param params The input parameters for the unity script.
   *
   * @return A hash table with unity script results.
   */
  public override function dispatchScript(scriptName: String, params: Hashtable): Hashtable {
    if (logger.isDebugEnabled()){
      logger.debug("Start executing dispatchScript(${scriptName}) using WSP service.")
    }

    var service = new onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.ports.EISClientWithConfig_BasicHttpBinding_HylandOutBoundContract()
    var dispatchRequest = new ScriptDispatchRequest(scriptName, params)
        //TODO: OnBase - commented out awaiting taxonomy
 /*   var response = new ScriptDispatchResponse(service.ScriptDispatcher(dispatchRequest.toString()))
    if (response.HasError) {
      throw new UnityScriptErrorException("Error in Script Dispatcher with error code ${response.ErrorCode}: ${response.ErrorMessage}")
    }

    if (logger.isDebugEnabled()){
      logger.debug("Finished executing dispatchScript(${scriptName}) using WSP service.")
    }

    return response.Results*/
    return null
  }

  /**
   * Helper class to format the request as XML
   */
  private static class ScriptDispatchRequest {

    // Note: Root node is not specified by the unity script, but must exist to contain
    // the two child nodes.
    private static final var ROOT_ELEM = "ScriptDispatch"

    // Element used to specify the name of the script to execute
    private static final var SCRIPT_NAME_ELEM = "ScriptName"

    // Element containing a list of script parameter elements.
    private static final var SCRIPT_PARAMETERS_ELEM = "ScriptParameters"

    // A string valued parameter
    private static final var STRING_PARAMETER_ELEM = "StringParameter"

    // An integer valued parameter
    private static final var INTEGER_PARAMETER_ELEM = "IntegerParameter"

    // Element containing the name of a parameter
    private static final var NAME_ELEM = "ParameterName"

    // Element containing the value of a parameter
    private static final var VALUE_ELEM = "ParameterValue"

    private var _xml = new XmlElement(ROOT_ELEM)

    construct(scriptName: String, params: Hashtable) {
      var nameElement = new XmlElement(SCRIPT_NAME_ELEM)
      nameElement.SimpleValue = XmlSimpleValue.makeStringInstance(scriptName)

      var paramsElement = new XmlElement(SCRIPT_PARAMETERS_ELEM)
      params.eachKeyAndValue(
          \ k, val -> paramsElement.addChild(hashEntryToXmlElement(k as String, val)))

      _xml.addChild(nameElement)
      _xml.addChild(paramsElement)
    }

    private function hashEntryToXmlElement(key: String, value: Object) : XmlElement {

      var rootElement : XmlElement
      var valueElement = new XmlElement(VALUE_ELEM)

      if (value typeis String){
        rootElement = new XmlElement(STRING_PARAMETER_ELEM)
        valueElement.SimpleValue = XmlSimpleValue.makeStringInstance(value)
      }
      else if (value typeis Integer || value typeis Long) {
        rootElement = new XmlElement(INTEGER_PARAMETER_ELEM)
        valueElement.SimpleValue = XmlSimpleValue.makeIntegerInstance(BigInteger.valueOf(value as long))
      }
      else {
        var parameterType = (typeof value).TypeInfo.Name
        throw new UnsupportedOperationException("Unhandled parameter type in ScriptDispatcher: ${parameterType}")
      }

      var nameElement = new XmlElement(NAME_ELEM)
      nameElement.SimpleValue = XmlSimpleValue.makeStringInstance(key)

      rootElement.addChild(nameElement)
      rootElement.addChild(valueElement)

      return rootElement
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
  private static class ScriptDispatchResponse {

    // Element containing an error response.
    private static final var ERROR_ELEM = "Error"

    // Element containing the numeric code of the error
    private static final var ERROR_CODE_ELEM = "ErrorCode"

    // Element containing the string message of the error
    private static final var ERROR_MESSAGE_ELEM = "ErrorMessage"

    // Element containing the name of a return value
    private static final var RETURN_NAME_ELEM = "ReturnName"

    // Element containing the value of a return value
    private static final var RETURN_VALUE_ELEM = "ReturnValue"

    // An integer valued return
    private static final var INTEGER_RETURN_ELEM = "IntegerReturnValue"

    // A string valued return
    private static final var STRING_RETURN_ELEM = "StringReturnValue"

    private var _xml : XmlElement

    construct(xmlString: String) {
      _xml = XmlElement.parse(xmlString)
    }

    public property get HasError(): boolean {
      return _xml.getChild(ERROR_ELEM) != null
    }

    public property get ErrorCode(): String {
      return _xml.getChild(ERROR_ELEM).getChild(ERROR_CODE_ELEM).SimpleValue.StringValue
    }

    public property get ErrorMessage(): String {
      return _xml.getChild(ERROR_ELEM).getChild(ERROR_MESSAGE_ELEM).SimpleValue.StringValue
    }

    private function parse<T>(resultHash: Hashtable, elem: XmlElement) {
      resultHash.put(elem.getChild(RETURN_NAME_ELEM).SimpleValue.StringValue,
                     elem.getChild(RETURN_VALUE_ELEM).SimpleValue.GosuValue as T)
    }

    public property get Results() : Hashtable {
      var resultHash = new Hashtable()

      _xml.getChildren(INTEGER_RETURN_ELEM).each(\ elem -> parse<Long>(resultHash, elem))
      _xml.getChildren(STRING_RETURN_ELEM).each(\ elem -> parse<String>(resultHash, elem))

      return resultHash
    }
  }
}
