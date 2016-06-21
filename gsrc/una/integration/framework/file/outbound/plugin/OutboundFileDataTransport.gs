package una.integration.framework.file.outbound.plugin

uses una.integration.framework.exception.ExceptionUtil
uses una.logging.UnaLoggerCategory
uses una.integration.framework.messaging.AbstractMessageTransport
uses una.integration.framework.persistence.context.PersistenceContext
uses una.integration.framework.persistence.dao.IntegrationBaseDAO
uses una.integration.framework.persistence.util.ProcessStatus
uses una.integration.framework.util.ErrorCode

uses java.lang.Exception

/**
 * An abstract base class for all the message transport implementations for the outbound flat file integrations.
 * Created By: vtadi on 5/18/2016
 */
abstract class OutboundFileDataTransport extends AbstractMessageTransport implements IFileDataTransport {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION

  /**
   * This function takes care of inserting an outbound file record created based on the given payload into the integration database.
   */
  override function send(message: Message, payload: String) {
    _logger.debug("Entry into the method 'send' of OutboundFileDataTransport'")
    var outboundEntityDAO = new IntegrationBaseDAO(FileDataMapping)
    try {
      if (payload != null && payload.trim().NotBlank) {
        PersistenceContext.runWithNewTransaction( \-> {
          var outboundEntity = createOutboundFileData(payload)
          outboundEntity.Status = ProcessStatus.UnProcessed
          outboundEntity.CreateUser = this.IntrinsicType.RelativeName
          outboundEntity.UpdateUser = outboundEntity.CreateUser
          outboundEntity.RetryCount = 0
          outboundEntityDAO.insert(outboundEntity)
        })
        message.reportAck()
      } else {
        message.ErrorDescription = ErrorCode.OUTBOUND_PAYLOAD_EMPTY.ErrorMessage
        message.reportError()
        ExceptionUtil.suppressException(ErrorCode.OUTBOUND_PAYLOAD_EMPTY)
      }
    } catch (ex: Exception) {
      message.ErrorDescription = ex.StackTraceAsString
      message.reportError()
      ExceptionUtil.suppressException(ErrorCode.ERROR_INSERTING_OUTBOUND_RECORD, null, ex)
    }
    _logger.debug("Exit from the method 'send' of OutboundFileDataTransport'")
  }


}