package onbase.api.services.interfaces

uses onbase.api.services.datamodels.MessageBrokerMessage
uses onbase.api.services.datamodels.MessageBrokerResponse

/**
 * Hyland Build Version: 16.0.0.999
 */
interface MessageProcessingInterface {
  function receiveMessages(count: int) : List<MessageBrokerMessage>
  function processMessage(message: MessageBrokerMessage) : MessageBrokerResponse
  function sendResponse(response: MessageBrokerResponse)
}
