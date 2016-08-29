package una.integration.tuna

uses gw.api.address.AddressFillable
uses una.integration.UnaIntTestBase
uses una.integration.service.gateway.tuna.TunaGatewayStub

/**
 * Created the class to run Gunit test for Tuna Address validation
 * Created By: pavan Theegala
 * Created on: 6/22/16
 *
 */
class TunaGateWayServiceTest extends UnaIntTestBase  {
  static var tunaGatewayStub: TunaGatewayStub
  var addr : AddressFillable


  /**
   * This method is used to initialize the test data common for all the tests in this class
   */
  override function beforeClass() {
    super.beforeClass()
    Logger.info("Initializing the classes")
    tunaGatewayStub = new TunaGatewayStub()

  }

  /**
   * This method is used to free up of resources initialized in the beforeClass() method
   */
  override function afterClass() {
    Logger.info("Dereferencing the classes")
    tunaGatewayStub = null

    super.afterClass()
  }



  /**
   * This method tests address scrub service
   */
  function testPropertyInformationScrubOnly() {

    Logger.info("Entering the test method 'testPropertyInformationScrubOnly'")
    var tunaResponse = tunaGatewayStub.fetchPropertyInformationScrubOnly(addr)
    Logger.info("Scrub Status Let's us know the Address Validation : " )
    Logger.info("Leaving the test method 'testPropertyInformationScrubOnly'")
  }


}