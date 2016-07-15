package una.integration.plugins.hpx

uses una.integration.framework.messaging.AbstractMessageTransport
uses una.integration.service.gateway.plugin.GatewayPlugin
uses java.util.Map
uses gw.plugin.InitializablePlugin

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
    if(p0 != null)
      sendToHPX(p0.PolicyPeriod)
    p0.reportError()
  }

  function sendToHPX(policyPeriod : PolicyPeriod) {
    var hpxGateway = GatewayPlugin.makeHPXGateway()
    hpxGateway.generateDocuments(policyPeriod)
  }

  function sendToHPX() {
    var hpxGateway = GatewayPlugin.makeHPXGateway()
    hpxGateway.generateDocuments(null)
  }
}