package util
uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 3/23/17
 * Time: 4:00 PM
 * To change this template use File | Settings | File Templates.
 */
class TemplateSearchResults {


  var  _templateName : String as TemplateName
  var _certified : boolean as CertifiedMail
  var  _ccRecepients : ArrayList<CCRecipients> as CCRecipients
  var  _attachDocuments : ArrayList<Document> as AttachedDocuments


  function addTOCCRecipients(ccRecip : CCRecipients , templateInfo : TemplateSearchResults ){
      if (templateInfo.CCRecipients == null){
            var list = new ArrayList<CCRecipients>()
            list.add(ccRecip)
        templateInfo.CCRecipients =  list
        } else{
         templateInfo.CCRecipients.add(ccRecip)
       }
   }


  function addDocument(document : Document, templateInfo : TemplateSearchResults){
    if(templateInfo.AttachedDocuments == null){
      var list = new ArrayList<Document>()
      list.add(document)
      templateInfo._attachDocuments = list
    } else {
      templateInfo.AttachedDocuments.add(document)
    }

  }


  override function toString() : String {
    return _templateName
  }



}