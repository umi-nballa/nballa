package una.integration.creditreport.service.ncf.util

uses una.integration.framework.util.AddressParser
uses una.integration.creditreport.testutil.AccountFactory

@gw.testharness.ServerTest
class AddressParserTest extends gw.testharness.TestBase {

  static var address : AddressParser
 
  override function beforeClass() {
    
    address = AddressParser.getInstance()
  }
  
  function testParseStreetNumberPositive() {
    
    assertTrue(address.parseStreetNumber(AccountFactory.AddressLine1Array[0]).length>0)
  }
  
  function testParseStreetNumberNegative() {
    
    //assertEquals(address.parseStreetNumber("La Vega"), "")
    assertEquals("", address.parseStreetNumber(AccountFactory.AddressLine1Array[9]))
  }
  
  function testParseStreetNumberNull() {
    
    assertEquals("", address.parseStreetNumber(null))
  }
  
  function testParseStreetNamePositive() {
    
    assertTrue(address.parseStreetName(AccountFactory.AddressLine1Array[0], null).length > 0)
  }
  
  function testParseStreetNameNegative() {
    
    //assertEquals(address.parseStreetName("Floor 0000", null), "")
    assertEquals("", address.parseStreetName(AccountFactory.AddressLine2Array[0], null))
  }
  
  function testParseStreetNameNull() {
    
    assertEquals("", address.parseStreetName(null, null))
  }
  
  function testParseApartmentNumberPositive() {

    assertTrue(address.parseApartmentNumber(AccountFactory.AddressLine1Array[1], AccountFactory.AddressLine2Array[1]).length > 0)
  }
  
  function testParseApartmentNumberNegative() {
    
    //assertEquals(address.parseApartmentNumber("Floor 0000", null), "")
    assertEquals("", address.parseApartmentNumber(AccountFactory.AddressLine2Array[0], null))
  }
  
  function testParseApartmentNumberNull() {
    
    assertEquals("", address.parseApartmentNumber(null, null))
  }
}
