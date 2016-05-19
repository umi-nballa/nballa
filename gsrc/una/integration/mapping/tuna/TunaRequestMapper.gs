package una.integration.mapping.tuna

uses wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel
uses una.logging.UnaLoggerCategory
uses java.util.Date
uses java.text.SimpleDateFormat
uses gw.xml.date.XmlDateTime
uses gw.api.address.AddressFillable

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty   on 5/14/2016
 *
 */

class TunaRequestMapper {

  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
     /*Default Mapping fields for the request*/
   function createRequestMapper(address : PolicyPeriod) : GetPropertyInformationRequestModel {
     var message = new wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel()
     var date = new Date()
     var df = new SimpleDateFormat("yyyy-MM-d'T'HH:mm:ss.S")
     var s = df.format(date)
     var theXmlDate = new XmlDateTime(s)
     message.YearBuild = 2000
     message.AsOfDate = theXmlDate
     message.Address.City = "Sarasota"
     message.Address.Country = "US"
     message.Address.State = "FL"
     message.Address.Street =  "101 Paramount Dr"
     message.Address.ZipCode = "34232"
     message.TotalSquareFootage=2000
     message.Coordinates.Latitude= 27.3364
     message.Coordinates.Longitude= 82.5307
     message.Owner="Test"

     return message

   }
    /*Mapping fields for create account Address Validation*/
  function createMappingAddress(address :AddressFillable) : GetPropertyInformationRequestModel
  {
    var message = new wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel()
    var date = new Date()
    var df = new SimpleDateFormat("yyyy-MM-d'T'HH:mm:ss.S")
    var s = df.format(date)
    var theXmlDate = new XmlDateTime(s)
    message.AsOfDate = theXmlDate
    message.YearBuild = 2000
    message.Address.Street =  address.AddressLine1
    message.Address.City = address.City
    message.Address.State = address.State.DisplayName
    message.Address.ZipCode = address.PostalCode
    message.Address.Country = address.County
    message.TotalSquareFootage=2000
    message.Coordinates.Latitude= 27.3364
    message.Coordinates.Longitude= 82.5307
    message.Owner="Test"

    return message

  }

}