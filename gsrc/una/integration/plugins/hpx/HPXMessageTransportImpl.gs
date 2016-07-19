package una.integration.plugins.hpx

uses una.integration.framework.messaging.AbstractMessageTransport
uses una.integration.service.gateway.plugin.GatewayPlugin
uses java.util.Map
uses gw.plugin.InitializablePlugin
uses java.lang.Exception
uses org.apache.poi.util.IOUtils

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

  override function send(p0: gw.pl.messaging.entity.Message, p1: String) {
  try {
    if(p1 != null) {
      var ewsRequest = new wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeRequest()
      ewsRequest.Driver.Driver = new gw.xml.BinaryData(p1.Bytes)
      ewsRequest.Driver.FileName = "EWS_INPUT"
      ewsRequest.IncludeHeader = true
      ewsRequest.IncludeMessageFile = true
      ewsRequest.PubFile = "PolicyCenterNA.pub"
      var ewsResponse = sendToHPX(ewsRequest)
      p0.reportAck()
    }
  } catch (e : Exception) {
    e.printStackTrace()
    p0.reportError()
  }


  }

  function sendToHPX(ewsRequest : wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeRequest)
      : wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeResponse {
    var hpxGateway = GatewayPlugin.makeHPXGateway()
    return hpxGateway.generateDocuments(ewsRequest)
  }
}