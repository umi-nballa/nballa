package una.integration.mapping.hpx

uses java.io.File
uses java.lang.StringBuilder
uses java.io.BufferedReader
uses java.io.FileReader
uses wsi.schema.una.hpx.hpx_application_request.OtherIdentifier

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

   var policyPeriodXML = new gw.webservice.pc.pc800.gxmodel.policyperiodmodel.PolicyPeriod(policyPeriod)
    var line = policyPeriod.HomeownersLine_HOE.AllCoverages
    line.each( \ elt -> {
      print(elt.CovTerms.where( \ elt1 -> elt1.DisplayName == "Limit" ).ValueAsString)
    })
    print(policyPeriodXML.asUTFString())
    var file = new File("//uimfs02/users/Shared_Documents/Core Systems Transformation Program(Guidewire)/Integration Docs/FileIntegrations/DevServer/HPX/ewsrequest/xml.txt")
    var myScan = new FileReader(file)
    var bis = new BufferedReader(myScan)
    var xml = new StringBuilder()
    while (bis.ready()) {
      xml.append(bis.readLine())
    }
    return xml.toString()
  }



  function createHPXDwellingPolicyRequestModel(dwellingPolicy : wsi.schema.una.hpx.hpx_application_request.DwellingPolicy,
                                 compositionUnit : wsi.schema.una.hpx.hpx_application_request.CompositionUnit) : String {
    var hpxRequest = new wsi.schema.una.hpx.hpx_application_request.PublishDocumentRequest()
    var polInfoTypeRq = new wsi.schema.una.hpx.hpx_application_request.PolInfoTypeRq()
    var publishingEngineFileKey = new wsi.schema.una.hpx.hpx_application_request.PublishingEngineFileKey()
    publishingEngineFileKey.setText("PolicyCenterNA.pub")
    var transaction = new wsi.schema.una.hpx.hpx_application_request.Transaction()
    transaction.setText("Policy Dwelling")
    polInfoTypeRq.addChild(dwellingPolicy)
    hpxRequest.addChild(polInfoTypeRq)
    hpxRequest.addChild(publishingEngineFileKey)
    hpxRequest.addChild(compositionUnit)
    hpxRequest.addChild(transaction)
    hpxRequest.addChild(createPublishingConsumerAppKey())
    return hpxRequest.asUTFString()
  }

  function createPublishingConsumerAppKey() : wsi.schema.una.hpx.hpx_application_request.PublishingConsumerAppKey {
    var publishingConsumerAppKey = new wsi.schema.una.hpx.hpx_application_request.PublishingConsumerAppKey()
    var appKeyCode = new wsi.schema.una.hpx.hpx_application_request.AppKeyCd()
    appKeyCode.setText("a")
    var appKeyDesc = new wsi.schema.una.hpx.hpx_application_request.AppKeyDesc()
    appKeyDesc.setText("String")
    publishingConsumerAppKey.addChild(appKeyCode)
    publishingConsumerAppKey.addChild(appKeyDesc)
    return publishingConsumerAppKey
  }
}