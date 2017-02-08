package una.integration.plugins.hpx

uses una.integration.framework.messaging.AbstractMessageTransport
uses una.integration.service.gateway.plugin.GatewayPlugin
uses java.util.Map
uses gw.plugin.InitializablePlugin
uses java.lang.Exception
uses gw.xml.XmlElement

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 7/12/16
 * Time: 10:35 AM
 */


@Export
class HPXMessageTransportImpl extends  AbstractMessageTransport implements InitializablePlugin {
  override function setParameters(p0: Map) {
  }

  override function send(message: gw.pl.messaging.entity.Message, payload: String) {
  try {
    if(payload != null) {
      var ewsRequest = new wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeRequest()
      ewsRequest.Driver.Driver = new gw.xml.BinaryData(payload.Bytes)
      ewsRequest.Driver.FileName = "EWS_INPUT"
      ewsRequest.IncludeHeader = true
      ewsRequest.IncludeMessageFile = true
      ewsRequest.PubFile = "PolicyCenterNA.pub"
      //ewsRequest.OutputFile.Directory = "North_America//PC"
      var ewsResponse = sendToHPX(ewsRequest)
      message.reportAck()
    }
  } catch (e : Exception) {
    e.printStackTrace()
    message.reportError()
  }


  }

  override function suspend() {
    gw.api.email.EmailUtil.sendEmailWithBody( null, "ananayakkara@uihna.com" , "Anil Nanayakkara", "akreci@unagw.com", "Anthony", "HPX queue has been suspended", "Please take a look at the queues")
  }

  function sendToHPX(ewsRequest : wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeRequest)
      : wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeResponse {
    var hpxGateway = GatewayPlugin.makeHPXGateway()
    return hpxGateway.generateDocuments(ewsRequest)
  }
}