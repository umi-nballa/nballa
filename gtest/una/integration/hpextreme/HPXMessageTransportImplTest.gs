package una.integration.hpextreme

uses una.integration.UnaIntTestBase
uses una.logging.UnaLoggerCategory
uses una.integration.plugins.hpx.HPXMessageTransportImpl
uses gw.api.builder.MessageBuilder
uses una.integration.mapping.hpx.common.HPXRequestMapper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 7/15/16
 * Time: 7:43 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXMessageTransportImplTest extends UnaIntTestBase {
  static var logger = UnaLoggerCategory.TEST
  var hpxMsgTransport : HPXMessageTransportImpl

  override function beforeClass() {
    super.beforeClass()
    logger.info("Initializing HPXMessageTransportImpl")
  }

  override function afterClass() {
    logger.info("Dereferencing the HPXMessageTransportImpl")
    hpxMsgTransport = null
    super.afterClass()
  }

  function testCreateStaticDocument() {
    hpxMsgTransport = new HPXMessageTransportImpl()
    var requestMapper = new HPXRequestMapper()
    var p1 = requestMapper.createXMLRequestModel(null)
    var ewsRequest = new wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeRequest()
    ewsRequest.Driver.Driver = new gw.xml.BinaryData(p1.Bytes)
    ewsRequest.Driver.FileName = "EWS_INPUT"
    ewsRequest.IncludeHeader = true
    ewsRequest.IncludeMessageFile = true
    ewsRequest.PubFile = "PolicyCenterNA.pub"
    hpxMsgTransport.sendToHPX(ewsRequest)
  }
}