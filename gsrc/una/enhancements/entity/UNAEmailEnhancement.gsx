package una.enhancements.entity

uses gw.api.util.SymbolTableUtil
uses gw.util.Pair

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 2/28/17
 * Time: 8:58 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNAEmailEnhancement : gw.api.email.Email {
  public function saveAsDocument(branch : PolicyPeriod, level : com.guidewire.pc.domain.linkedobject.LinkedObjectContainer, docType : OnBaseDocumentType_Ext, docSubType : OnBaseDocumentSubType_Ext){
    var templatePlugin = gw.plugin.Plugins.get(gw.plugin.document.IDocumentTemplateSource)
    var template = templatePlugin.getDocumentTemplate("CreateEmailSent.gosu.htm", gw.api.util.LocaleUtil.toLanguage(TC_EN_US))
    if (template == null) {
      throw new gw.api.util.DisplayableException ("Could not save email as a document because the EmailSent template does not exist!")
    } else {
      var documentToSave = new Document(branch)
      documentToSave.Name  = this.Subject
      documentToSave.MimeType = template.MimeType
      documentToSave.Type = template.TemplateType
      documentToSave.OnBaseDocumentType = docType
      documentToSave.OnBaseDocumentSubtype = docSubType
      documentToSave.Section = template.getMetadataPropertyValue( "section" ) as String // assigment will force it to SectionType
      documentToSave.SecurityType = template.DefaultSecurityType
      documentToSave.Status = typekey.DocumentStatusType.TC_APPROVED
      documentToSave.Recipient = this.ToRecipients.first().Name
      documentToSave.Author = User.util.CurrentUser.DisplayName
      documentToSave.Inbound = false
      documentToSave.Level = level
      documentToSave.DateCreated = gw.api.util.DateUtil.currentDate()

      var symbolTable = SymbolTableUtil.populateBeans(branch.Policy)
      var paramMap = new java.util.HashMap (symbolTable)
      paramMap.put("User", User.util.CurrentUser)
      paramMap.put("Email", this)
      paramMap.put("DateSent", gw.api.util.DateUtil.currentDate())
      gw.document.DocumentProduction.createAndStoreDocumentSynchronously(template, paramMap, documentToSave)
    }
  }
}
