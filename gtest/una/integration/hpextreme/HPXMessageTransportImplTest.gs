package una.integration.hpextreme

uses una.integration.UnaIntTestBase
uses una.logging.UnaLoggerCategory
uses una.integration.plugins.hpx.HPXMessageTransportImpl
uses gw.api.builder.MessageBuilder

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
    //var message = new MessageBuilder()
    //message.withPolicyPeriod(null)
    hpxMsgTransport = new HPXMessageTransportImpl()
    hpxMsgTransport.sendToHPX()
  }
}