package una.integration.mapping.tuna

uses wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel
uses una.logging.UnaLoggerCategory
uses java.util.Date
uses java.text.SimpleDateFormat
uses gw.xml.date.XmlDateTime

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 5/11/16
 * Time: 4:43 PM
 */

class TunaRequestMapper {

  var logger = UnaLoggerCategory.UNA_INTEGRATION

   function createRequestMapper(policyPeriod : PolicyPeriod) : GetPropertyInformationRequestModel {
     var message = new wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel()
     var date = new Date()
     var df = new SimpleDateFormat("yyyy-MM-d'T'HH:mm:ss.S")
     var s = df.format(date)
     var theXmlDate = new XmlDateTime(s)

     //TODO message should be mapped to policyPeriod information

     message.YearBuild = ""
     message.AsOfDate = theXmlDate
     message.Address.City = "Sarasota"
     message.Address.Country = "US"
     message.Address.State = "FL"
     message.Address.Street =  "101 Paramount Dr"
     message.Address.ZipCode = "34232"

     return message

   }

}