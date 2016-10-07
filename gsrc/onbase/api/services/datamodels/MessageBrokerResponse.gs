package onbase.api.services.datamodels

/**
 * Hyland Build Version: 16.0.0.999
 */
class MessageBrokerResponse {

  private var _messageInstanceNumber : String as readonly MessageInstanceNumber
  private var _messageStatus : OnBaseMessageBrokerStatus_Ext as MessageStatus

  private var _messageResponse : String as MessageResponse
  private var _messageError : String as MessageError


  construct(messageInstanceNumber: String) {
    _messageInstanceNumber = messageInstanceNumber
    _messageStatus = OnBaseMessageBrokerStatus_Ext.TC_PENDING
  }

  public function complete(response: String) {
    _messageStatus = OnBaseMessageBrokerStatus_Ext.TC_SUCCESS
    _messageResponse = response
  }

  public function fail(error: String) {
    _messageStatus = OnBaseMessageBrokerStatus_Ext.TC_FAILURE
    _messageError = error
  }

}
