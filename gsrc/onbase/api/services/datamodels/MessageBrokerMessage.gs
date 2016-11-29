package onbase.api.services.datamodels

uses gw.api.integration.inbound.work.WorkData
uses gw.xml.XmlElement

/**
 * Hyland Build Version: 16.0.0.999
 */
class MessageBrokerMessage implements WorkData {

  private var _messageType : OnBaseMessageBrokerType_Ext as MessageType
  private var _messageInstanceNumber : String as readonly MessageInstanceNumber
  private var _messageXml: XmlElement as readonly MessageXml


  construct(messageType: OnBaseMessageBrokerType_Ext,
            messageInstanceNumber: String,
            messageXml: XmlElement) {
    _messageType = messageType
    _messageInstanceNumber = messageInstanceNumber
    _messageXml = messageXml
  }
}
