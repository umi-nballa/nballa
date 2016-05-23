package una.integration.mapping.tuna

uses gw.api.address.AddressFillable
uses gw.api.util.DateUtil
uses gw.xml.date.XmlDateTime
uses una.logging.UnaLoggerCategory
uses una.utils.PropertiesHolder
uses wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel

uses java.lang.Double
uses java.lang.Exception
uses java.lang.Integer
uses java.text.SimpleDateFormat
uses java.util.Date

/**
 * Purpose of the class is to map elements to the payload
 * User: pyerrumsetty   on 5/14/2016
 *
 */
class TunaRequestMapper {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION

  /**
   *
   * Default Mapping fields for the request
   * @param policyPeriod : Getting fields from UI
   * @return GetPropertyInformationRequestModel : Complex element from WSDL
   */
  function createRequestModel(policyPeriod: PolicyPeriod): GetPropertyInformationRequestModel {
    try {
      logger.debug(" Entry Tunagateway-createRequestModel mapping payload For AddressValidation ", this.IntrinsicType)
      var message = new wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel()
      var df = new SimpleDateFormat(PropertiesHolder.getProperty("TUNA_DATE_FORMAT"))
      var s = df.format(DateUtil.currentDate())
      var theXmlDate = new XmlDateTime(s)
      message.YearBuild = (PropertiesHolder.getProperty("TUNA_Year_Build")) as Integer
      message.AsOfDate = theXmlDate
      message.Address.City = PropertiesHolder.getProperty("TUNA_Address_City")
      message.Address.Country = PropertiesHolder.getProperty("TUNA_Address_Country")
      message.Address.State = PropertiesHolder.getProperty("TUNA_Address_State")
      message.Address.Street = PropertiesHolder.getProperty("TUNA_Address_Street")
      message.Address.ZipCode = PropertiesHolder.getProperty("TUNA_Address_Zipcode")
      message.TotalSquareFootage = (PropertiesHolder.getProperty("TUNA_Total_Square_Footage")) as Integer
      message.Coordinates.Latitude = (PropertiesHolder.getProperty("TUNA_Coordinates_Latitude")) as Double
      message.Coordinates.Longitude = PropertiesHolder.getProperty("TUNA_Coordinates_Longitude") as Double
      message.Owner = PropertiesHolder.getProperty("TUNA_Owner")
      logger.debug(" Exit Tunagateway-createRequestModel mapping payload For AddressValidation ", this.IntrinsicType)
      return message
    } catch (e: Exception) {
      logger.error("TunaGateway-createRequestMapper : Mapping to payload " , e)
      throw e
    }
  }


  /**
   *
   * Mapping fields for create account Address Validation
   * @param address : Getting fields from UI
   * @return GetPropertyInformationRequestModel : Complex element from WSDL
   */

  function createRequestModel(address: AddressFillable): GetPropertyInformationRequestModel
  {
    try {
      logger.debug(" Inside Tunagateway-createRequestModel mapping payload For AddressValidation ", this.IntrinsicType)
      var message = new wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel()
      var df = new SimpleDateFormat(PropertiesHolder.getProperty("TUNA_DATE_FORMAT"))
      var s = df.format(DateUtil.currentDate())
      var theXmlDate = new XmlDateTime(s)
      message.YearBuild = (PropertiesHolder.getProperty("TUNA_Year_Build")) as Integer
      message.AsOfDate = theXmlDate
      message.Address.Street = address.AddressLine1
      message.Address.City = address.City
      message.Address.State = address.State.DisplayName
      message.Address.ZipCode = address.PostalCode
      message.Address.Country = address.Country.DisplayName
      message.TotalSquareFootage = PropertiesHolder.getProperty("TUNA_Total_Square_Footage") as Integer
      message.Coordinates.Latitude = PropertiesHolder.getProperty("TUNA_Coordinates_Latitude") as Double
      message.Coordinates.Longitude = PropertiesHolder.getProperty("TUNA_Coordinates_Longitude") as Double
      message.Owner = PropertiesHolder.getProperty("TUNA_Owner")
      logger.info("AddressLine1:" + address.AddressLine1 +" "+address.City +"State: "+address.State.DisplayName +"PostalCode:"
          +address.PostalCode +"Country: "+address.Country.DisplayName)
      return message
    } catch (e: Exception) {
      logger.error("TunaGateway-createMappingAddress : Mapping to payload ", e)
      throw e
    }
  }
}