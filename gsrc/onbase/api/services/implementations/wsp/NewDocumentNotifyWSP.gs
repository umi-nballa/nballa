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

    logger.debug("Polling for messages with maximum count of ${count}.")
    var messageResults = service.DequeuePCDocument(pollRequest)
    //TODO: OnBase - changed from DequeueNewDocuemntMessagePC to DequeueNewDocumentMessage
    logger.debug("Found ${messageResults.MessageData.Count} messages.")

    return messageResults.MessageData.map(\message -> {
      return new MessageBrokerMessage(_messageType,
          message.MessageInstanceNumber,
          message.MessageContent)
    })
  }

  override function processMessage(message: MessageBrokerMessage): MessageBrokerResponse {
    var response = new MessageBrokerResponse(message.MessageInstanceNumber)
    if (message.MessageXml typeis MessageData_MessageContent) {

      //TODO: OnBase - commented out awaiting taxonomy

      // Read relevant keywords out of the message.

      var keywords = message.MessageXml.DequeuePCDocumentMessage.Keywords
      var properties = message.MessageXml.DequeuePCDocumentMessage.DocumentProperties


      var date_stored = properties.DateStored

      var temp_date = date_stored.replaceAll("Z$", "+0000")
      var df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ssZ");
      var date = df.parse(temp_date);

      var existingDocs = Query.make(Document).compare('DocUID', Relop.Equals, properties.DocumentHandle)
      if (existingDocs.select().Count > 0){
        response.complete("")
        return response
      }

      /* //match pending doc id with the asyncdocid
       var asyncdocid = keywords.StandAlone.AsyncDocumentID_Collection.AsyncDocumentID.first()

       if (asyncdocid.HasContent)
       {

         var asyncarchivequery = Query.make(Document).compare('PendingDocUID', Relop.Equals, asyncdocid)

         var asyncdoc = asyncarchivequery.select().AtMostOneRow
         if (asyncdoc != null)
         {
           Transaction.runWithNewBundle(\bundle -> {
             asyncdoc = bundle.add(asyncdoc)
             asyncdoc.DocUID = properties.DocumentHandle
             asyncdoc.PendingDocUID = null
             asyncdoc.DateModified = date
           }, User.util.UnrestrictedUser)
           response.complete("")
           return response
         }
         else
         {
           logger.error(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_UnknownPendingID(asyncdocid))
           response.fail(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_UnknownPendingID(asyncdocid))
           return response
         }
       }
*/
      /*        var accountNumber = null// keywords.StandAlone. AccountNumber_Collection.AccountNumber.first()
              var account: Account = null
              if (accountNumber == null) {    //accountNumber.HasContent
                account = Account.finder.findAccountByAccountNumber(accountNumber)
                if (account == null) {
                  logger.error(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_InvalidAccountNumber(accountNumber))
                  response.fail(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_InvalidAccountNumber(accountNumber))
                  return response
                }
              }*/

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


      //        var docName = keywords.StandAlone.GWFileName_Collection.GWFileName.first()
      /*   if (account == null && policy == null) {
            logger.error(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_NoAccountOrPolicy)
            response.fail(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_NoAccountOrPolicy)
            return response
          }
          else if (account == null && policy != null) {
            //find the account linked to the policy
            //account = policy.Account
          }
          else if (account != null && policy != null)     //both account and policy has content
            {
              if (policy.Account != account)
              {
                logger.error(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_UnrelatedAccountAndPolicy(accountNumber, policyNumber))
                response.fail(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_UnrelatedAccountAndPolicy(accountNumber, policyNumber))
                return response
              }
            }*/
      //        if (!docName.HasContent)
      //        {
      //          docName = properties.DocName
      //        }
      var description = keywords.StandAlone.Description_Collection.Description.first()
      var onbaseDocumentType = keywords.StandAlone.OnBaseDocumentType_Collection.OnBaseDocumentType.first()
      var user = keywords.StandAlone.Underwriter_Collection.Underwriter.first()//keywords.StandAlone.User_Collection.User.first()
      //var recipient = keywords.StandAlone.Recipient_Collection.Recipient.first()
      //var status_temp = keywords.StandAlone.Status_Collection.Status.first()
      /*        var status: DocumentStatusType = null
              if (status_temp.HasContent)
              {
                status = DocumentStatusType.get(status_temp)
                if (status == null)           // invalid status entered
                {
                  logger.error(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_InvalidStatus(status_temp))
                  response.fail(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_InvalidStatus(status_temp))
                  return response
                }
              }
              var doc_type_temp = keywords.StandAlone.DocumentType_Collection.DocumentType.first()
              var doc_type: DocumentType = null
              if (doc_type_temp.HasContent)
              {
                doc_type = DocumentType.get(doc_type_temp)
                if (doc_type == null)                //invalid doc type entered.
                {
                  logger.error(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_InvalidDocumentType(doc_type_temp))
                  response.fail(displaykey.Accelerator.OnBase.MessageBroker.Error.STR_GW_InvalidDocumentType(doc_type_temp))
                  return response
                }
              }*/
      // note that a user must be provided as the inbound-integration does not have a user context.

      Transaction.runWithNewBundle(\bundle -> {

        var doc = new Document()
        doc.DocUID = properties.DocumentHandle
        doc.DateCreated = date//properties.DocDate
        doc.OnBaseDocumentType = onbaseDocumentType

        doc.Account = policy.Account
        //doc.Account = account
        doc.Name = properties.DocName // docName
        doc.Description = description
        doc.Author = user
        //doc.Recipient = recipient
        doc.Status = typekey.DocumentStatusType.TC_FINAL // Hard-coding this status, it might be needed. cmattox 11/10/16
        doc.Type = typekey.DocumentType.TC_ONBASE // Hard-coding this it might be needed. cmattox 11/10/16
        doc.MimeType = properties.MimeType
        doc.DateModified = date
        doc.Policy = policy
        doc.DMS = true
      }, User.util.UnrestrictedUser)


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
