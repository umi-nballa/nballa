package onbase.api.services.implementations.wsp

uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.transaction.Transaction
uses onbase.api.Settings
uses onbase.api.services.datamodels.MessageBrokerMessage
uses onbase.api.services.datamodels.MessageBrokerResponse
uses onbase.api.services.implementations.wsp.webservicecollection.onbasemessagebroker.soapservice.anonymous.elements.MessageData_MessageContent
uses onbase.api.services.implementations.wsp.webservicecollection.onbasemessagebroker.soapservice.elements.InputData
uses onbase.api.services.implementations.wsp.webservicecollection.onbasemessagebroker.soapservice.elements.UpdateMessageData
uses onbase.api.services.interfaces.MessageProcessingInterface
uses org.slf4j.LoggerFactory

uses java.text.SimpleDateFormat

/**
 * Hyland Build Version: 16.0.0.999
 *
 * * Last Changes:
 *   06/29/2016 - Anirudh Mohan
 *     * Initial implementation of message broker for new document notification in onbase
 *
 *   08/04/2016 - Anirudh Mohan
 *     * Added Error Handling functionalities to relate account and policy
 *
 *   08/16/2016 - Anirudh Mohan
 *     * Replaced Error Messages with Display Keys for international purposes
 *
 *   08/18/2016 - Anirudh Mohan
 *     * Added Error handling for status and doc types
 *
 */
// Notify Guidewire of new documents in OnBase (ex, all the documents asyncronously archived.They may not be available in Guidewire yet and the async doc id needs to be notified to guidewire

class NewDocumentNotifyWSP implements MessageProcessingInterface {

  private var logger = LoggerFactory.getLogger(Settings.ServicesLoggerCategory)

  private static final var _messageType = OnBaseMessageBrokerType_Ext.TC_NEWDOCNOTIFY

  override function receiveMessages(count: int): List<MessageBrokerMessage> {
    var service = new onbase.api.services.implementations.wsp.webservicecollection.onbasemessagebroker.soapservice.ports.EISClientWithConfig_BasicHttpBinding_HylandOutBoundContract()

    var pollRequest = new InputData() {
        : Count = count as String
    }

    //logger.debug("Polling for messages with maximum count of ${count}.")
    var messageResults = service.DequeuePCDocument(pollRequest)
    //logger.debug("Found ${messageResults.MessageData.Count} messages.")

    return messageResults.MessageData.map(\message -> {
      return new MessageBrokerMessage(_messageType,
          message.MessageInstanceNumber,
          message.MessageContent)
    })
  }

  override function processMessage(message: MessageBrokerMessage): MessageBrokerResponse {
    var response = new MessageBrokerResponse(message.MessageInstanceNumber)
    if (message.MessageXml typeis MessageData_MessageContent) {

      // Read relevant keywords out of the message.
      var keywords = message.MessageXml.DequeuePCDocumentMessage.Keywords
      var properties = message.MessageXml.DequeuePCDocumentMessage.DocumentProperties

      var date_stored = properties.DateStored

      var temp_date = date_stored.replaceAll("Z$", "+0000")
      var df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ssZ");
      var date = df.parse(temp_date);

      var existingDocs = Query.make(Document).compare('DocUID', Relop.Equals, properties.DocumentHandle)
      var existingDocResults = existingDocs.select()
      var policyNumber = keywords.StandAlone.PolicyNumber_Collection.PolicyNumber.first()
      var policy: Policy = null
      if (policyNumber.HasContent) {
        policy = Policy.finder.findPolicyByPolicyNumber(policyNumber)
        if (policy == null) {
          logger.error(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_InvalidPolicyNumber(policyNumber))
          response.fail(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_InvalidPolicyNumber(policyNumber))
          return response
        }
      }

      var description = keywords.StandAlone.Description_Collection.Description.first()

      var onbaseDocumentType = typekey.OnBaseDocumentType_Ext.getByName(keywords.StandAlone.OnBaseDocumentType_Collection.OnBaseDocumentType.first())

      var onBaseDocType: OnBaseDocumentType_Ext = null
      var onBaseDocumentTypeName = keywords.StandAlone.OnBaseDocumentType_Collection.OnBaseDocumentType.first()
      if (onBaseDocumentTypeName.HasContent) {
        onBaseDocType = typekey.OnBaseDocumentType_Ext.getByName(onBaseDocumentTypeName)
        if (onBaseDocType == null) {
          var errorMessage = displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_OnBaseDocumentTypeNotFound(onBaseDocumentTypeName)
          logger.error(errorMessage)
          response.fail(errorMessage)
          return response
        }
      }

      var onBaseDocumentSubtypeName = keywords.StandAlone.Subtype_Collection.Subtype.first()
      var onBaseDocSubtype: OnBaseDocumentSubtype_Ext = null
      if (onBaseDocumentSubtypeName.HasContent) {
        onBaseDocSubtype = typekey.OnBaseDocumentSubtype_Ext.getByName(onBaseDocumentSubtypeName)
      }

      var user = keywords.StandAlone.Underwriter_Collection.Underwriter.first()
      var period = policy.LatestPeriod.getSlice(date)

      if (existingDocResults.Count > 0){
        // note that a user must be provided as the inbound-integration does not have a user context.
        Transaction.runWithNewBundle(\bundle -> {
          existingDocResults.each( \ exDoc -> {
            bundle.add(exDoc)
            exDoc.OnBaseDocumentType = onBaseDocType
            exDoc.OnBaseDocumentSubtype = onBaseDocSubtype
            exDoc.Description = description
          } )
        }, User.util.UnrestrictedUser)
      } else {
        // note that a user must be provided as the inbound-integration does not have a user context.
        Transaction.runWithNewBundle(\bundle -> {
          var doc = new Document()
          doc.DocUID = properties.DocumentHandle
          doc.DateCreated = date//properties.DocDate
          doc.OnBaseDocumentType = onBaseDocType//onbaseDocumentType
          doc.OnBaseDocumentSubtype = onBaseDocSubtype
          doc.Account = policy.Account
          doc.Name = properties.DocName // docName
          doc.Description = description
          doc.Author = user
          doc.Status = typekey.DocumentStatusType.TC_FINAL // Hard-coding this status, it might be needed. cmattox 11/10/16
          doc.Type = typekey.DocumentType.TC_ONBASE // Hard-coding this it might be needed. cmattox 11/10/16
          doc.MimeType = properties.MimeType
          doc.DateModified = date
          doc.Policy = policy
          doc.PolicyPeriod = period
          doc.DMS = true
        }, User.util.UnrestrictedUser)
      }
      response.complete("")
      return response

    } else {
      logger.error(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_UnrecognizedMessageContent(message.MessageXml.QName))
      response.fail(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_UnrecognizedMessageContent(message.MessageXml.QName))
      return response
    }
  }

  override function sendResponse(response: MessageBrokerResponse) {
    var service = new onbase.api.services.implementations.wsp.webservicecollection.onbasemessagebroker.soapservice.ports.EISClientWithConfig_BasicHttpBinding_HylandOutBoundContract()

    var status = response.MessageStatus == OnBaseMessageBrokerStatus_Ext.TC_SUCCESS ? Settings.MessageBrokerSuccess : Settings.MessageBrokerError

    var update = new UpdateMessageData() {
        : MessageInstanceNumber = response.MessageInstanceNumber,
        : ResponseCode = status,
        : MessagePayload = response.MessageResponse ?: '',
        : ErrorMessage = response.MessageError ?: ''
    }

    service.UpdateMessageStatus(update)
  }
}
