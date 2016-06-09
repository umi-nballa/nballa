package una.integration.mapping.tuna

uses gw.api.address.AddressFillable
uses gw.api.util.DateUtil
uses gw.xml.date.XmlDateTime
uses una.logging.UnaLoggerCategory
uses una.model.AddressDTO
uses una.utils.PropertiesHolder
uses wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel

uses java.lang.Exception
uses java.text.SimpleDateFormat
uses java.lang.Integer
uses java.lang.Double

/**
 * Purpose of the class is to map elements to the payload
 * User: Prathyush   on 5/14/2016
 *
 */
class TunaRequestMapper {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  private static final var CLASS_NAME = TunaRequestMapper.Type.DisplayName
  var message: GetPropertyInformationRequestModel as message
  public static final var DEFAULT_VALUE: Integer = 0

  /*Default Constructor*/
  construct()
  {
    message = new wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel()
  }

  /**
   * TBD- Currently using for Testing Purpose
   */
  function createRequestModel(policyPeriod: PolicyPeriod): GetPropertyInformationRequestModel {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " createRequestModel" + "mapping payload For AddressValidation ", this.IntrinsicType)
      //Default Mapping method for  fields in request
      payloadRequestMapping()
      message.Address.City = PropertiesHolder.getProperty("TUNA_Address_City")
      message.Address.Country = PropertiesHolder.getProperty("TUNA_Address_Country")
      message.Address.State = PropertiesHolder.getProperty("TUNA_Address_State")
      message.Address.Street = PropertiesHolder.getProperty("TUNA_Address_Street")
      message.Address.ZipCode = PropertiesHolder.getProperty("TUNA_Address_Zipcode")
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " createRequestModel" + "mapping payload For AddressValidation ", this.IntrinsicType)
      return message
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + "createRequestMapper1 : Mapping to payload ", exp)
      throw exp
    }
  }

  /**
   * Mapping fields for Address Validation
   * @param address : is Address Entity  in GW
   * @return message contains mapped fields in the request
   */
  function createRequestModel(address: AddressFillable): GetPropertyInformationRequestModel
  {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " createRequestModel" + "mapping payload For scrubonly ", this.IntrinsicType)
      //Default Mapping method for  fields in request
      payloadRequestMapping()
      message.Address.Street = address.AddressLine1
      message.Address.City = address.City
      message.Address.State = address.State.DisplayName
      message.Address.ZipCode = address.PostalCode
      message.Address.Country = address.Country.DisplayName
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " createRequestModel" + "mapping payload For scrubonly ", this.IntrinsicType)
      return message
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + "createMappingAddress2 : Mapping to payload ", exp)
      throw exp
    }
  }

  /**
   *
   * Mapping AccountLocation Entity  to  map address fields to the request
   * @param address : AddressDTO class
   * @return message contains mapped fields in the request
   */
  function createRequestModel(address: AddressDTO): GetPropertyInformationRequestModel
  {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " createRequestModel" + "mapping payload For propertyinformationComplete ", this.IntrinsicType)
      //Default Mapping method for  fields in request
      payloadRequestMapping()
      message.Address.Street = address.AddressLine1
      message.Address.City = address.City
      message.Address.State = address.State
      message.Address.ZipCode = address.PostalCode
      message.Address.Country = address.Country
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " createRequestModel" + "mapping payload For propertyinformationComplete ", this.IntrinsicType)
      return message
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + "createMappingAddress3 : Mapping to payload ", exp)
      throw exp
    }
  }

  /**
   * Default field mapping across all the requests is being done in this method
   *
   * */
  private function payloadRequestMapping()
  {
    try {
      var df = new SimpleDateFormat(PropertiesHolder.getProperty("TUNA_DATE_FORMAT"))
      var s = df.format(DateUtil.currentDate())
      var theXmlDate = new XmlDateTime(s)
      message.YearBuild = DEFAULT_VALUE as Integer
      message.AsOfDate = theXmlDate
      message.TotalSquareFootage = DEFAULT_VALUE as Integer
      message.Coordinates.Latitude = DEFAULT_VALUE as Double
      message.Coordinates.Longitude = DEFAULT_VALUE as Double
      message.Owner = DEFAULT_VALUE
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + "payloadRequestMapping : DefaultMapping ", exp)
      throw exp
    }
  }
}