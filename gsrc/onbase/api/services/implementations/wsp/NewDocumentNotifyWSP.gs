package onbase.api.services.implementations.wsp

uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.transaction.Transaction
uses onbase.api.Settings
uses onbase.api.services.datamodels.MessageBrokerMessage
uses onbase.api.services.datamodels.MessageBrokerResponse
uses onbase.api.services.implementations.wsp.webservicecollection.onbasemessagebroker.soapservice.anonymous.elements.MessageData_MessageContent
uses onbase.api.services.implementations.wsp.webservicecollection.onbasemessagebroker.soapservice.anonymous.elements.MessageData_MessageContentType_DequeuePCDocumentMessageType_DocumentProperties
uses onbase.api.services.implementations.wsp.webservicecollection.onbasemessagebroker.soapservice.anonymous.elements.MessageData_MessageContentType_DequeuePCDocumentMessageType_Keywords
uses onbase.api.services.implementations.wsp.webservicecollection.onbasemessagebroker.soapservice.elements.InputData
uses onbase.api.services.implementations.wsp.webservicecollection.onbasemessagebroker.soapservice.elements.UpdateMessageData
uses onbase.api.services.interfaces.MessageProcessingInterface
uses org.slf4j.LoggerFactory

uses java.text.SimpleDateFormat
uses java.util.Date
uses gw.api.database.IQueryBeanResult
uses java.lang.IllegalArgumentException
uses gw.job.UNAHORenewalProcess

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

    var messageResults = service.DequeuePCDocument(pollRequest)

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
      var dequeueMessage = message.MessageXml.DequeuePCDocumentMessage
      var keywords = dequeueMessage.Keywords
      var properties = dequeueMessage.DocumentProperties

      logger.debug("New Document Notification for DocumentHandle: " + properties.DocumentHandle)

      var existingDocs = Query.make(Document).compare('DocUID', Relop.Equals, properties.DocumentHandle)
      var existingDocResults = existingDocs.select()

      try {
        var responseMessage: String = null
        var asyncDocId = keywords.StandAlone.AsyncDocumentID_Collection.AsyncDocumentID.first()

        if (existingDocResults.Count == 0) {
          if (asyncDocId.HasContent) {
            responseMessage = updatePendingDocument(message, asyncDocId)
          } else {
            responseMessage = addNewDocument(message)
          }
        } else {
          responseMessage = updateExistingDocument(existingDocResults, message)
        }
        if (!responseMessage.HasContent) {
          response.complete("")
        } else {
          response.fail(responseMessage)
        }
      } catch (e: IllegalArgumentException) {
        logger.error(e.Message)
        response.fail(e.Message)
      }
    } else {
      var errorMessage = displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_UnrecognizedMessageContent(message.MessageXml.QName)
      logger.error(errorMessage)
      response.fail(errorMessage)
    }
    return response
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

  @Throws(java.lang.IllegalArgumentException, "If Policy Number is not present or does not exist, throws IllegalArgumentException")
  private function addNewDocument(message: MessageBrokerMessage): String {
    var response = ""
    var dequeueMessage = (message.MessageXml as MessageData_MessageContent).DequeuePCDocumentMessage
    var keywords = dequeueMessage.Keywords
    var properties = dequeueMessage.DocumentProperties

    var date = getDateStored(properties)
    var policyNumber = keywords.StandAlone.PolicyNumber_Collection.PolicyNumber.first()
    var policy: Policy = null

    if (policyNumber.HasContent) {
      policy = Policy.finder.findPolicyByPolicyNumber(policyNumber)
      if (policy == null) {
        throw(new IllegalArgumentException(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_InvalidPolicyNumber(policyNumber)))
      }
    }

    var period = policy.LatestPeriod
    // note that a user must be provided as the inbound-integration does not have a user context.
    Transaction.runWithNewBundle(\bundle -> {
      var doc = new Document()
      doc.DocUID = properties.DocumentHandle
      doc.DateCreated = date
      doc.OnBaseDocumentType = getOnBaseDocumentType(keywords)
      doc.OnBaseDocumentSubtype = getOnBaseDocumentSubtype(keywords)
      doc.Account = policy.Account
      doc.Name = properties.DocName
      doc.Description = keywords.StandAlone.Description_Collection.Description.first()
      doc.Status = typekey.DocumentStatusType.TC_APPROVED
      doc.Type = typekey.DocumentType.TC_ONBASE
      doc.MimeType = properties.MimeType
      doc.DateModified = date
      doc.Policy = policy
      doc.PolicyPeriod = period
      doc.DMS = true

      onDocumentAdded(doc)
    }, User.util.UnrestrictedUser)

    return response
  }

  private function updatePendingDocument(message: MessageBrokerMessage, asyncdocid: String): String {
    var response = ""
    var asyncarchivequery = Query.make(Document).compare('PendingDocUID', Relop.Equals, asyncdocid)

    var asyncdoc = asyncarchivequery.select().AtMostOneRow
    if (asyncdoc != null) {
      var properties = (message.MessageXml as MessageData_MessageContent).DequeuePCDocumentMessage.DocumentProperties
      Transaction.runWithNewBundle(\bundle -> {
        asyncdoc = bundle.add(asyncdoc)
        asyncdoc.DocUID = properties.DocumentHandle
        asyncdoc.PendingDocUID = null
        asyncdoc.DateModified = getDateStored(properties)
      }, User.util.UnrestrictedUser)
    } else {
      response = displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_UnknownPendingID(asyncdocid)
    }
    return response
  }

  private function updateExistingDocument(existingDocResults: IQueryBeanResult<Document>, message: MessageBrokerMessage): String {
    var response = ""
    var dequeueMessage = (message.MessageXml as MessageData_MessageContent).DequeuePCDocumentMessage
    var keywords = dequeueMessage.Keywords
    var properties = dequeueMessage.DocumentProperties
    // note that a user must be provided as the inbound-integration does not have a user context.
    existingDocResults.each(\exDoc -> {
      if (exDoc.Status == typekey.DocumentStatusType.TC_FINAL) {
        response = displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_CanNotModifyDocumentEntity("Document has status of Final")
      } else {
        Transaction.runWithNewBundle(\bundle -> {
          var changeDoc = bundle.add(exDoc)
          changeDoc.Name = properties.DocName
          changeDoc.OnBaseDocumentType = getOnBaseDocumentType(keywords)
          changeDoc.OnBaseDocumentSubtype = getOnBaseDocumentSubtype(keywords)
          changeDoc.Description = keywords.StandAlone.Description_Collection.Description.first()
        }, User.util.UnrestrictedUser)
      }
    })

    return response
  }

  @Throws(java.lang.IllegalArgumentException, "If OnBase Document Type is not present, throws IllegalArgumentException")
  private function getOnBaseDocumentType(keywords: MessageData_MessageContentType_DequeuePCDocumentMessageType_Keywords): OnBaseDocumentType_Ext {
    var onBaseDocType: OnBaseDocumentType_Ext = null
    var onBaseDocumentTypeName = keywords.StandAlone.OnBaseDocumentType_Collection.OnBaseDocumentType.first()
    if (onBaseDocumentTypeName.HasContent) {
      onBaseDocType = typekey.OnBaseDocumentType_Ext.getByName(onBaseDocumentTypeName)
      if (onBaseDocType == null) {
        var errorMessage = displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_OnBaseDocumentTypeNotFound(onBaseDocumentTypeName)
        logger.error(errorMessage)
        throw(new IllegalArgumentException(errorMessage))
      }
    }
    return onBaseDocType
  }

  private function getOnBaseDocumentSubtype(keywords: MessageData_MessageContentType_DequeuePCDocumentMessageType_Keywords): OnBaseDocumentSubtype_Ext {
    var onBaseDocumentSubtypeName = keywords.StandAlone.Subtype_Collection.Subtype.first()
    var onBaseDocSubtype: OnBaseDocumentSubtype_Ext = null
    if (onBaseDocumentSubtypeName.HasContent) {
      onBaseDocSubtype = typekey.OnBaseDocumentSubtype_Ext.getByName(onBaseDocumentSubtypeName)
    }
    return onBaseDocSubtype
  }

  private function getDateStored(properties: MessageData_MessageContentType_DequeuePCDocumentMessageType_DocumentProperties): Date {
    var date_stored = properties.DateStored
    var temp_date = date_stored.replaceAll("Z$", "+0000")
    var df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ssZ");
    return df.parse(temp_date);
  }

  private function onDocumentAdded(document : Document){
    if(document.Type == TC_ONBASE and document.OnBaseDocumentSubtype == tc_incorr_consent_to_rate){
      var openRenewal = document.Policy.OpenRenewalJob

      if(openRenewal != null and openRenewal.LatestPeriod.HomeownersLine_HOEExists){
        (openRenewal.LatestPeriod.JobProcess as UNAHORenewalProcess).onUploadConsentToRateForm()
      }
    }
  }
}
