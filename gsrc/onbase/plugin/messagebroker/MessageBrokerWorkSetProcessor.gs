package onbase.plugin.messagebroker

uses gw.api.integration.inbound.work.Inbound
uses gw.api.integration.inbound.work.WorkContext
uses gw.api.integration.inbound.work.WorkData
uses gw.api.integration.inbound.work.WorkDataSet
uses gw.api.integration.inbound.work.WorkSetProcessor
uses gw.transaction.Transaction
uses onbase.api.services.datamodels.MessageBrokerMessage
uses onbase.api.services.datamodels.MessageBrokerResponse
uses onbase.api.services.interfaces.MessageProcessingInterface
uses org.slf4j.LoggerFactory

uses java.lang.Exception
uses java.util.Map

/**
 * Hyland Build Version: 16.0.0.999
 */
class MessageBrokerWorkSetProcessor implements WorkSetProcessor, Inbound {

  var logger = LoggerFactory.getLogger('MessageBroker')

  var _batchSize : int

  var _messageProcessors : Map<OnBaseMessageBrokerType_Ext, MessageProcessingInterface>

  construct(batchSize: int, processors: Map<OnBaseMessageBrokerType_Ext, MessageProcessingInterface>) {
    _batchSize = batchSize
    _messageProcessors = processors
  }

  /**
   * Find the message broker work data set by polling the web service.
   */
  override function findWork(): WorkDataSet {
    var dataSet = new MessageBrokerWorkDataSet()
    _messageProcessors.eachValue( \ p -> dataSet.addMessages(p.receiveMessages(_batchSize)))
    return dataSet
  }

  /*
   * Retrieve the object used to find inbound work.
   */
  override property get Inbound(): Inbound {
    return this;
  }

  /*
   * Process a single piece of data.
   */
  override function process(context: WorkContext, data: WorkData) {
    if (data typeis MessageBrokerMessage) {
      logger.debug("Processing message: ${data.MessageInstanceNumber}")

      var response = new MessageBrokerResponse(data.MessageInstanceNumber)

      try {
        var processor = _messageProcessors.get(data.MessageType)
        response = processor.processMessage(data)
      } catch (ex: Exception) {
        // If an unexpected error occurred while processing the message, use the exception text
        // as an error response.
        logger.error('Unexpected exception processing message ${data.MessageInstanceNumber}: ${ex.Message}')
        response.fail(ex.Message)
      }

      // Create a new OnBaseMessageBrokerMessage entity and signal that it has been completed.
      // This will trigger the event rules allowing the response to be sent through the Guidewire
      // messaging system.
      logger.debug('Creating message entity for message ${data.MessageInstanceNumber}')
      Transaction.runWithNewBundle(\bundle -> {
        var messageEntity = new OnBaseMessageBrokerMessage_Ext() {
          :MessageInstanceNumber = data.MessageInstanceNumber,
          :MessageBody = data.MessageXml.asUTFString(),
          :MessageType = data.MessageType,
          :MessageStatus = response.MessageStatus,
          :MessageResponse = response.MessageResponse,
          :MessageError = response.MessageError
        }

        messageEntity.addEvent('MessageComplete')
      }, User.util.UnrestrictedUser)

    } else {
      logger.error("Unexpected WorkData type in MessageBrokerWorkSetProcessor: " + typeof(data))
    }
  }
}
