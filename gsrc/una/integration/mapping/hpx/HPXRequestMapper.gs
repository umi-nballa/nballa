package una.integration.mapping.hpx

uses java.io.File
uses org.apache.poi.util.IOUtils
uses java.io.FileInputStream
uses wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeRequest
uses java.lang.StringBuilder
uses java.lang.management.BufferPoolMXBean
uses java.io.BufferedReader
uses java.io.BufferedInputStream
uses java.io.FileReader

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 7/14/16
 * Time: 6:50 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXRequestMapper {
  function createRequestModel(policyPeriod : PolicyPeriod) {

  }


  function createXMLRequestModel(policyPeriod : PolicyPeriod) : String {
    var file = new File("U:/Shared_Documents/Core Systems Transformation Program(Guidewire)/Project Phase Deliverables/03-Development and Implementation Phase/04-Integration/hpx/ewsrequest/xml.txt")
    var myScan = new FileReader(file)
    var bis = new BufferedReader(myScan)
    var xml = new StringBuilder()
    while (bis.ready()) {
      xml.append(bis.readLine())
    }
    return xml.toString()
  }
}