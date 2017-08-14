package una.integration.framework.messaging

uses gw.api.admin.DestinationMessageStatisticsUtil
uses gw.plugin.messaging.MessageTransport
uses una.logging.UnaLoggerCategory

uses java.lang.Integer
uses gw.pl.logging.Logger

/**
 * Abstract message transport that is super class for all the message transport implementations.
 * This class implements MessagePlugin methods required to be implemented such as shutdown, suspend, resume.
 * Also, whenever a destination status is changed, it will send an email alert to the configured email id.
 * Created By: vtadi on 5/18/2016
 */
abstract class AbstractMessageTransport implements MessageTransport {
  protected final static var _logger : Logger = UnaLoggerCategory.UNA_INTEGRATION

  protected var _destinationId: Integer as DestinationID
  protected var _destinationName: String as DestinationName

  /**
   * Sets the destination id and name for this message transport.
   * @param destId the destination id
   */
  override function setDestinationID(destId: int) {
    _logger.info("Setting destination id for ${this.IntrinsicType.RelativeName}: ${destId}.")
    DestinationID = destId
    DestinationName = DestinationMessageStatisticsUtil.getMessageStatistics().firstWhere( \ elt -> elt.DestinationId == destId).DestinationName
  }

  /**
   * Logs the destination status change.
   * Also, sends an email on this status change to the configured email id.
   */
  override function shutdown() {
    _logger.info("${DestinationName} messaging destination is shutdown.")
  }

  /**
   * Logs the destination status change.
   * Also, sends an email on this status change to the configured email id.
   */
  override function suspend() {
    _logger.info("${DestinationName} messaging destination is suspending.")
  }

  /**
   * Logs the destination status change.
   * Also, sends an email on this status change to the configured email id.
   */
  override function resume() {
    _logger.info("${DestinationName} messaging destination is resuming.")
  }

}