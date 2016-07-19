package una.integration.mapping.hpx

uses wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeResponse
uses java.io.File
uses java.util.logging.FileHandler

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 7/14/16
 * Time: 7:03 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXResponseMapper {
  /*function updateResponseModel(ewsResponse : EwsComposeResponse, policyPeriod : PolicyPeriod) {
    var fileOutput = ewsResponse.Files.get(0).FileOutput
    var file = new File("U:/Shared_Documents/Core Systems Transformation Program(Guidewire)/Project Phase Deliverables/03-Development and Implementation Phase/04-Integration/hpx/generatedforms/" + ewsResponse.Files.get(0).FileName)
    file.writeBytes(fileOutput.Bytes)
  }
   */
  function updateResponseModel(ewsResponse : EwsComposeResponse) {
    var fileOutput = ewsResponse.Files.get(0).FileOutput
    var file = new File("U:/Shared_Documents/Core Systems Transformation Program(Guidewire)/Project Phase Deliverables/03-Development and Implementation Phase/04-Integration/hpx/generatedforms/" + ewsResponse.Files.get(0).FileName)
    file.writeBytes(fileOutput.Bytes)
  }
}