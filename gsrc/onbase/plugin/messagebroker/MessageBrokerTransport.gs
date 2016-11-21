package onbase.plugin.messagebroker

uses gw.plugin.messaging.MessageTransport
uses gw.plugin.InitializablePlugin
uses java.util.Map
uses onbase.api.services.datamodels.MessageBrokerResponse
uses onbase.api.Settings

/**
 * Hyland Build Version: 16.0.0.999
 */
class MessageBrokerTransport implements MessageTransport, InitializablePlugin {

  override function send(message: Message, transformedPayload: String) {
    var messageEntity = message.getEntityByName('response') as OnBaseMessageBrokerMessage_Ext

    var response = new MessageBrokerResponse(messageEntity.MessageInstanceNumber)
    response.MessageStatus = messageEntity.MessageStatus
    response.MessageResponse = messageEntity.MessageResponse
    response.MessageError = messageEntity.MessageError

    var processor = Settings.MessageProcessors.get(messageEntity.MessageType)
    processor.sendResponse(response)
    message.reportAck()
  }

  override function shutdown() {
  }

  override function suspend() {
  }

  override function resume() {
  }

  override function setDestinationID(id: int) {
    print(id)
  }

  override function setParameters(params: Map) {
  }
}
