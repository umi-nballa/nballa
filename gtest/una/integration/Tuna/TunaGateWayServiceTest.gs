package una.integration.Tuna

uses gw.api.util.DateUtil
uses gw.xml.date.XmlDateTime
uses una.integration.UnaIntTestBase
uses una.integration.service.transport.tuna.TunaCommunicator
uses wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel
uses java.lang.Double
uses java.lang.Exception
uses java.lang.Integer
uses java.text.SimpleDateFormat

/**
 * Created the class to run Gunit test for Tuna Address validation
 * Created By: pavan Theegala
 * Created on: 6/22/16
 *
 */
class TunaGateWayServiceTest extends UnaIntTestBase {
  static var tunaCommunicator: TunaCommunicator
  static var message: GetPropertyInformationRequestModel as message
  static final var DEFAULT_VALUE: Integer = 0
  static final var TUNA_Address_City = "Sarosta"
  static final var TUNA_Address_Country= "US"
  static final var TUNA_Address_State = "FL"
  static final var TUNA_Address_Street = "101 Paramount DR"
  static final var TUNA_Address_Zipcode = "34232"
  static final var TUNA_DATE_FORMAT = "yyyy-MM-d'T'HH:mm:ss.S"

  /**
   * This method is used to initialize the test data common for all the tests in this class
   */
  override function beforeClass() {
    super.beforeClass()
    Logger.info("Initializing the classes")
    tunaCommunicator = new TunaCommunicator()
    message = new wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel()
  }

  /**
   * This method is used to free up of resources initialized in the beforeClass() method
   */
  override function afterClass() {
    Logger.info("Dereferencing the classes")
    tunaCommunicator = null
    message = null
    super.afterClass()
  }

  /**
   * This method tests Property Information Complete Service
   */
  function testPropertyInformationComplete() {
    Logger.info("Entering the test method 'testPropertyInformationComplete'")
    var req = createRequestModel(true)
    var tunaResponse = tunaCommunicator.getPropertyInformationComplete(req)
    Logger.info("Scrub Status Let's us know the Address Validation : " + tunaResponse.Address.ScrubStatus)
    Logger.info(tunaResponse.Address.Zipcode.Major + "-" + tunaResponse.Address.Zipcode.Minor)
    assertEquals(tunaResponse.Address.Zipcode.Major + "-" + tunaResponse.Address.Zipcode.Minor, "34232-6044")
    Logger.info("Leaving the test method 'testPropertyInformationComplete'")
  }

  /**
   * This method tests address scrub service
   */
  function testPropertyInformationScrubOnly() {
    Logger.info("Entering the test method 'testPropertyInformationScrubOnly'")
    var req = createRequestModel(true)
    var tunaResponse = tunaCommunicator.getPropertyInformationScrubOnly(req)
    Logger.info("Scrub Status Let's us know the Address Validation : " + tunaResponse.Address.ScrubStatus)
    Logger.info(tunaResponse.Address.Zipcode.Major + "-" + tunaResponse.Address.Zipcode.Minor)
    assertEquals(tunaResponse.Address.Zipcode.Major + "-" + tunaResponse.Address.Zipcode.Minor, "34232-6044")
    Logger.info("Leaving the test method 'testPropertyInformationScrubOnly'")
  }

  /**
   * This method tests address scrub service with invalid Inputs
   */
  function testInvalidPropertyInformationScrubOnly() {
    Logger.info("Entering the test method 'testInvalidPropertyInformationScrubOnly'")
    var req = createRequestModel(false)
    var tunaResponse = tunaCommunicator.getPropertyInformationScrubOnly(req)
    assertEquals(tunaResponse.Status, -100)
    Logger.info("Leaving the test method 'testInvalidPropertyInformationScrubOnly'")
  }

  /**
   * This method tests Property Information Service
   */
  function testPropertyInformation() {
    Logger.info("Entering the test method 'testPropertyInformation'")
    var req = createRequestModel(true)
    var tunaResponse = tunaCommunicator.getPropertyInformation(req)
    Logger.info("Scrub Status Let's us know the Address Validation : " + tunaResponse.Address.ScrubStatus)
    Logger.info(tunaResponse.Address.Zipcode.Major + "-" + tunaResponse.Address.Zipcode.Minor)
    assertEquals(tunaResponse.Address.Zipcode.Major + "-" + tunaResponse.Address.Zipcode.Minor, "34232-6044")
    Logger.info("Leaving the test method 'testPropertyInformation'")
  }

  /**
   * This method tests Property Information 360 Value Lookup service
   */
  function testPropertyInformation360ValueLookUpOnly() {
    Logger.info("Entering the test method 'testPropertyInformation360ValueLookUpOnly'")
    var req = createRequestModel(true)
    var tunaResponse = tunaCommunicator.getPropertyInformation360ValueLookUpOnly(req)
    Logger.info("Size of the List " + tunaResponse.Datums.PropertyDatumModel.size())
    assertList(tunaResponse.Datums.PropertyDatumModel)
    assertGreaterThan(0,tunaResponse.Datums.PropertyDatumModel.size())
    Logger.info("Leaving the test method 'testPropertyInformation360ValueLookUpOnly'")
  }

  /**
   * This method tests Property Information Geo Lookup Service
   */
  function testPropertyInformationGeoLookUp() {
    Logger.info("Entering the test method 'testPropertyInformationGeoLookUp'")
    var req = createRequestModel(true)
    var tunaResponse = tunaCommunicator.getPropertyInformationGeoLookUp(req)
    Logger.info("Scrub Status Let's us know the Address Validation : " + tunaResponse.Address.ScrubStatus)
    assertEquals(3, tunaResponse.Address.ScrubStatus)
    assertGreaterThan(0,tunaResponse.Datums.PropertyDatumModel.size())
    Logger.info("Leaving the test method 'testPropertyInformationGeoLookUp'")
  }

  /**
   * This method is used to form a request XML with Valid Data to hit the Service
   */
  private function createRequestModel(valid: Boolean): GetPropertyInformationRequestModel {
    try {
      //Default Mapping method for  fields in request
      var df = new SimpleDateFormat(TUNA_DATE_FORMAT)
      var s = df.format(DateUtil.currentDate())
      var theXmlDate = new XmlDateTime(s)
      message.YearBuild = DEFAULT_VALUE
      message.AsOfDate = theXmlDate
      message.TotalSquareFootage = DEFAULT_VALUE
      message.Coordinates.Latitude = DEFAULT_VALUE as Double
      message.Coordinates.Longitude = DEFAULT_VALUE as Double
      message.Owner = DEFAULT_VALUE as String
      if (valid) {
        message.Address.City = TUNA_Address_City
        message.Address.Country = TUNA_Address_Country
        message.Address.State = TUNA_Address_State
        message.Address.Street = TUNA_Address_Street
        message.Address.ZipCode = TUNA_Address_Zipcode
      } else {
        message.Address.City = ""
        message.Address.Country = ""
        message.Address.State = ""
        message.Address.Street = ""
        message.Address.ZipCode = ""
      }
      return message
    } catch (exp: Exception) {
      throw exp
    }
  }
}