package una.integration.service.transport.mock

uses java.io.File
uses gw.xml.XmlElement
uses una.logging.UnaLoggerCategory
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 7/5/16
 * Time: 12:46 PM
 */
class TunaMockPayloadGenerator {

  private var logger = UnaLoggerCategory.UNA_INTEGRATION
  private var pathToSampleData: String
  private var relativePathToSampleData = "/sampledata/tuna"
  construct() {
    /*
    get relative path to sample data by converting this class' package name to path and concatenate with file name
    of plugin config file.  i.e. foo.bar -> foo/bar   +  "/sample.xml"
    */
    pathToSampleData = this.IntrinsicType.Namespace.replace(".", "/") + relativePathToSampleData
  }


  /* This is a sample code, we have to change the code to read the Address scrub soap response from AddressValidation_Res.xml
   *
   * */


  public function GetPropertyInformationScrubOnly(): XmlElement {
    var payloadPath = pathToSampleData + "/AddresValidation_Res.xml"
    var payloadFile = new File(TunaMockPayloadGenerator.Type.TypeLoader.getResource(payloadPath).File)
    var payload = payloadFile.read()
    var xmlElement = XmlElement.parse(payload)


    return xmlElement
  }
}