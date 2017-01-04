package onbase.api.messaging

uses gw.plugin.InitializablePlugin
uses gw.plugin.messaging.MessageTransport
uses gw.util.Base64Util
uses onbase.api.services.ServicesManager
uses onbase.api.services.datamodels.UpdateKeywordsRequest

uses java.lang.Exception
uses java.util.Map

/**
 * Hyland Build Version: 16.0.0.999
 */
class OnBaseMessageTransport implements MessageTransport, InitializablePlugin {

  private var _destinationId : int

  /** Send a message. */
  override function send(message: gw.pl.messaging.entity.Message, payload: String) {

    var updateRequest : UpdateKeywordsRequest = null
    try {
      var decodedPayload = Base64Util.decode(payload)
      var updateModel = onbase.api.messaging.updatekeywordsrequestmodel.UpdateKeywordsRequest.parse(decodedPayload)
      updateRequest = deserializeModel(updateModel)
    }
    catch (ex : Exception) {
      // Exceptions encountered while parsing an update request are likely to be unrecoverable, go ahead and report failure.
      message.ErrorDescription = ex.Message
      message.reportError()
    }

    // Allowing web service exceptions to propagate upwards will cause the message queue to retry.
    var services = new ServicesManager()
    services.updateKeywords(updateRequest)
    message.reportAck()
  }

  /** Shutdown the transport */
  override function shutdown() {
  }

  /** Suspend the transport */
  override function suspend() {
  }

  /** Resume transport */
  override function resume() {
  }

  /** Set messaging destination ID */
  override function setDestinationID(id: int) {
    _destinationId = id
  }

  /** Read plugin initialization parameters. */
  override function setParameters(parameters: Map) {
  }

  /** Convert an instance of the keyword update GSX model into a normal UpdateKeywordsRequest that can be passed
   *  to the services layer.
   *
   *  @param model serialized request
   */
  public static function deserializeModel(model: onbase.api.messaging.updatekeywordsrequestmodel.UpdateKeywordsRequest) : UpdateKeywordsRequest {
    var updateRequest = new UpdateKeywordsRequest()
    updateRequest.UserID = model.UserID
    updateRequest.PolicyNumber = model.PolicyNumber

    // Add any list entries that are present
    if (model.DocumentHandles.Entry.HasElements) {
      updateRequest.DocumentHandles.addAll((model.DocumentHandles.Entry))
    }
    model.Actions.Entry?.each(\action -> updateRequest.addUpdateAction(action.Action, action.KeywordName, action.KeywordValue))

    return updateRequest
  }
}
