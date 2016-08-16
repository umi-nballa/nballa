package una.integration.framework.util

uses java.util.regex.Pattern

/**
   * Adapted from Data Prefill Accelerator ( PrefillAddressParser )
   * 
   * This is a utility class that parses values out of a PolicyCenter contact address into a format 
   * that can be used to order a prefill report from LexisNexis.  
   * Basically, an Addreass Line 1 is broken up into:
   *     - Street Number
   *     - Street Name
   *     - Apartment Number
   * 
   * Note that the parsed values are visible only on the "OrderPrefillReportPopup.pcf" page.  
   * They are used only as input into the Order Prefill service - the parsed values are not persisted in PolicyCenter.
   * 
   */
class AddressParser {
  // regEx pattern to extract the apartment number. Group 3 contains the number which may be alphanumeric e.g. "100A"
  private final var _patApt = Pattern.compile("(.+[ ]){0,}(?i)(APT|APAR|APARTMENT|UNIT|SUITE)[. #]{1,}([0-9A-Za-z]+)[ ]*(.*{0,1})")
  
  // regEx pattern to extract the street number. 
  private final var _patStreetNum = Pattern.compile("[ ]*([0-9]{1,})[ ]+(.+)")

  // Pattern to get the street name
  private final var _patStreetNam = Pattern.compile("[ ]*[0-9]*[ ]+(.+?)[ ]+(?i)(((APT|APAR|APARTMENT|UNIT|SUITE)[. #]{1,}([0-9A-Za-z]+){0,1})|((FLOOR|SUITE)[. #]{1,}([0-9A-Za-z]+){0,1}))+(.*)") //(?i)((APT|APAR|APARTMENT|UNIT|SUITE)[. #]{1,}[0-9A-Za-z]+{0,1}[ ]*){0,1}
  
  // regEx alternative pattern to extract the street name (of no apartement or floor found)
  private final var _patStreetNamNoApt = Pattern.compile("[ ]*([0-9]*)[ ]+(.+)")

  private static var _instance : AddressParser
    
  public static function getInstance() : AddressParser {
    // No need of locking here
    if (_instance == null) {
      _instance = new AddressParser()
    }
    
    return _instance
  }
  
  /**
   * Parses out the "Street Number" from the Named Insured's Primary Address.  This method interrogates only the 
   * Address Line 1 value to get the Street Number.  Address Line 2 and Address Line 3 are not used.
   */
  @Param("addrLine1", "A String value representing a complete address")
  @Returns("A String value representing the Street Number as parsed out of the Named Insured's Primary Address")
  function parseStreetNumber(addrLine1 : String) : String  {
    
    var streetNum = ""
    
    if (addrLine1 != null) {
      var matcher = _patStreetNum.matcher(addrLine1)
      
      if (matcher.matches()) {
        streetNum = matcher.group(1)
      }
    }  
    
    return streetNum
  }
  
  /**
   * Parses out the "Street Name" from the Named Insured's Primary Address.  This method interrogates only the 
   * Address Line 1 and Address Line 2 values.  Address Line 3 is not used.
   */
  @Param("addrLine1", "A String value representing a complete address")
  @Param("addrLine2", "A String value representing a complementary (and optional) address")
  @Returns("A String value representing the Street Name as parsed out of the Named Insured's Primary Address")
  function parseStreetName(addrLine1 : String, addrLine2 : String) : String  {
    
    var result = ""
    
    if (addrLine1 != null) {
      var addr : String = addrLine2 == null ? addrLine1 : addrLine1 + " " + addrLine2
      var matcher = _patStreetNam.matcher(addr)

      if (matcher.matches()) {
        result = matcher.group(1)
      } 
      else {
        matcher = _patStreetNamNoApt.matcher(addr)
        if (matcher.matches()) {
          result = matcher.group(2)
        } 
      }    
    }
    
    return result
  }

  /**
   * Parses out the "Apartment Number" from the Named Insured's Primary Address.  This method interrogates only the 
   * Address Line 1 and Address Line 2 values.  Address Line 3 is not used.
   */
  @Param("addrLine1", "A String value representing a complete address")
  @Param("addrLine2", "A String value representing a complementary (and optional) address")
  @Returns("A String value representing the Apartment Number as parsed out of the Named Insured's Primary Address")
  function parseApartmentNumber(addrLine1 : String, addrLine2 : String) : String  {
    
    var result = ""
    
    if (addrLine1 != null) {
      var addr : String = addrLine2 == null ? addrLine1 : addrLine1 + " " + addrLine2
      var matcher = _patApt.matcher(addr)

      if (matcher.matches()) {
        result = matcher.group(3)
      }
    }
    
    return result
  }
}
