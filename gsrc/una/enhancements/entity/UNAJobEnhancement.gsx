package una.enhancements.entity

uses una.utils.ActivityUtil

/**
 * Created with IntelliJ IDEA.
 * User: tvang
 * Date: 8/14/17
 * Time: 8:31 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNAJobEnhancement : entity.Job {
  public function generateDocumentRequest(docType : DocumentRequestType_Ext, relatedEntity : KeyableBean){
    //TODO tlv we need to either generate an activity right away or create WF depending on what the reqs and req clarifications are in upcoming CR
    //ActivityUtil.createDocumentRequestActivity(docType, this)
    var shouldAddRequest : boolean

    if(relatedEntity != null){
      shouldAddRequest = !DocumentUploadRequests?.hasMatch( \ documentRequest -> documentRequest.Type == docType and documentRequest.AssociatedEntity == relatedEntity)
    }else{
      shouldAddRequest = !DocumentUploadRequests?.hasMatch( \ documentRequest -> documentRequest.Type == docType)
    }

    if(shouldAddRequest){
      this.addToDocumentRequests(new DocumentRequest_Ext(this){:Type = docType, :AssociatedEntity = relatedEntity})
    }
  }

  public function removeDocumentRequest(docType : DocumentRequestType_Ext, relatedEntity : KeyableBean){
    var toRemove = DocumentUploadRequests?.where( \ documentRequest -> documentRequest.Type == docType)

    if(relatedEntity != null){
      toRemove = toRemove?.where( \ documentRequest -> documentRequest.AssociatedEntity == relatedEntity)
    }

    toRemove?.each( \ documentRequest -> {
      //TODO tlv we need to either remove an activity right away or kill a WF depending on what the reqs and req clarifications are in upcoming CR
      //ActivityUtil.removeDocumentRequestActivityUnconditionally(docType, this)
      this.removeFromDocumentRequests(documentRequest)
    })
  }

  public property get DocumentUploadRequests() : DocumentRequest_Ext[]{
    return this.getFieldValue("DocumentRequests") as DocumentRequest_Ext[]
  }
}
