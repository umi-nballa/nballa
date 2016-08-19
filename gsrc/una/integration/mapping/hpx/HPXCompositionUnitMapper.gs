package una.integration.mapping.hpx

uses java.util.Date
uses wsi.schema.una.hpx.hpx_application_request.DocumentForm

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/1/16
 * Time: 4:57 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCompositionUnitMapper {
  function createRecipient(recipientId : String, recipientCode : String, recipientName : String) : wsi.schema.una.hpx.hpx_application_request.Recipient {
    var recipient = new wsi.schema.una.hpx.hpx_application_request.Recipient()
    var receivId = new wsi.schema.una.hpx.hpx_application_request.RecipientID()
    receivId.setText(recipientId)
    recipient.addChild(receivId)
    var reciptCode = new wsi.schema.una.hpx.hpx_application_request.RecipientCode()
    reciptCode.setText(recipientCode)
    recipient.addChild(reciptCode)
    var reciptName = new wsi.schema.una.hpx.hpx_application_request.RecipientName()
    reciptName.setText(recipientName)
    recipient.addChild(reciptName)
    return recipient
  }

  function createDocumentForm(formId : String, formLanguage : String, formName : String, formEffectiveDate : Date, formEdition : String, isDeclarationOrSchedule : Boolean) : wsi.schema.una.hpx.hpx_application_request.DocumentForm {
    var documentForm = new wsi.schema.una.hpx.hpx_application_request.DocumentForm()
    var frmId = new wsi.schema.una.hpx.hpx_application_request.FormID()
    frmId.setText(formId)
    documentForm.addChild(frmId)
    var frmLanguage = new wsi.schema.una.hpx.hpx_application_request.FormLanguage()
    frmLanguage.setText(formLanguage)
    documentForm.addChild(frmLanguage)
    var frmName = new wsi.schema.una.hpx.hpx_application_request.FormName()
    frmName.setText(formName)
    documentForm.addChild(frmName)
    var frmEffectiveDate = new wsi.schema.una.hpx.hpx_application_request.FormEffective()
    frmEffectiveDate.setText(formEffectiveDate.toStringWithFormat("yyyy-MM-dd"))
    documentForm.addChild(frmEffectiveDate)
    var frmEdition = new wsi.schema.una.hpx.hpx_application_request.FormEdition()
    frmEdition.setText(formEdition)
    documentForm.addChild(frmEdition)
    var isDecOrSchedule = new wsi.schema.una.hpx.hpx_application_request.IsDeclarationOrSchedule()
    isDecOrSchedule.setText(false)
    documentForm.addChild(isDecOrSchedule)
    return documentForm
  }

  function createCompositionUnit(recipient : wsi.schema.una.hpx.hpx_application_request.Recipient,
                                 documentForms : List<DocumentForm>) : wsi.schema.una.hpx.hpx_application_request.CompositionUnit {
    var documentComposition = new wsi.schema.una.hpx.hpx_application_request.CompositionUnit()
    documentComposition.addChild(recipient)
    for (form in documentForms) {
      documentComposition.addChild(form)
    }
    return documentComposition
  }

  function createCompositionUnit(policyPeriod : PolicyPeriod)  : wsi.schema.una.hpx.hpx_application_request.CompositionUnit {
    var forms = policyPeriod.NewlyAddedForms
    var compositionUnitMapper = new HPXCompositionUnitMapper()
    var documentForms = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.DocumentForm>()
    var recipient = compositionUnitMapper.createRecipient("INSURED_PDF", "String", "String")
    var documentForm1 = compositionUnitMapper.createDocumentForm("DP04731202","English","DP04731202", new java.util.Date(),"07-02", false)
    var documentForm2 = compositionUnitMapper.createDocumentForm("DP17670788","English","DP17670788", new java.util.Date(),"07-02", false)
    var documentForm3 = compositionUnitMapper.createDocumentForm("HO03120511","English","HO03120511", new java.util.Date(),"07-02", false)
    var documentForm4 = compositionUnitMapper.createDocumentForm("HO03170901","English","HO03170901", new java.util.Date(),"07-02", false)
    var documentForm5 = compositionUnitMapper.createDocumentForm("HO03330503","English","HO03330503", new java.util.Date(),"07-02", false)
    var documentForm6 = compositionUnitMapper.createDocumentForm("HO03340503","English","HO03340503", new java.util.Date(),"07-02", false)
    var documentForm7 = compositionUnitMapper.createDocumentForm("HO03630612","English","HO03630612", new java.util.Date(),"07-02", false)
    var documentForm8 = compositionUnitMapper.createDocumentForm("HO04260402","English","HO04260402", new java.util.Date(),"07-02", false)
    var documentForm9 = compositionUnitMapper.createDocumentForm("HO04270402","English","HO04270402", new java.util.Date(),"07-02", false)
    var documentForm10 = compositionUnitMapper.createDocumentForm("HO04280402","English","HO04280402", new java.util.Date(),"07-02", false)
    var documentForm11 = compositionUnitMapper.createDocumentForm("HO04361000","English","HO04361000", new java.util.Date(),"07-02", false)
    var documentForm12 = compositionUnitMapper.createDocumentForm("HO04411000","English","HO04411000", new java.util.Date(),"07-02", false)
    var documentForm13 = compositionUnitMapper.createDocumentForm("HO04541000","English","HO04541000", new java.util.Date(),"07-02", false)
    var documentForm14 = compositionUnitMapper.createDocumentForm("HO04840612","English","HO04840612", new java.util.Date(),"07-02", false)
    var documentForm15 = compositionUnitMapper.createDocumentForm("HO32100612","English","HO32100612", new java.util.Date(),"07-02", false)
    var documentForm16 = compositionUnitMapper.createDocumentForm("HO32270612","English","HO32270612", new java.util.Date(),"07-02", false)
    var documentForm17 = compositionUnitMapper.createDocumentForm("HO32540612","English","HO32540612", new java.util.Date(),"07-02", false)
    var documentForm18 = compositionUnitMapper.createDocumentForm("TDP0070792","English","TDP0070792", new java.util.Date(),"07-02", false)
    var documentForm19 = compositionUnitMapper.createDocumentForm("UIHOXC0607","English","UIHOXC0607", new java.util.Date(),"07-02", false)
    var documentForm20 = compositionUnitMapper.createDocumentForm("HO04481000","English","HO04481000", new java.util.Date(),"07-02", false)
    var documentForm21 = compositionUnitMapper.createDocumentForm("HO04610511","English","HO04610511", new java.util.Date(),"07-02", false)
    var documentForm22 = compositionUnitMapper.createDocumentForm("HO04651000","English","HO04651000", new java.util.Date(),"07-02", false)
    var documentForm23 = compositionUnitMapper.createDocumentForm("NOCPDP0110","English","NOCPDP0110", new java.util.Date(),"07-02", false)
    var documentForm24 = compositionUnitMapper.createDocumentForm("OIRB116550210","English","OIRB116550210", new java.util.Date(),"07-02", false)
    var documentForm25 = compositionUnitMapper.createDocumentForm("SCPCLS0115","English","SCPCLS0115", new java.util.Date(),"07-02", false)
    documentForms.add(documentForm1)
    documentForms.add(documentForm2)
    documentForms.add(documentForm3)
    documentForms.add(documentForm4)
    documentForms.add(documentForm5)
    documentForms.add(documentForm6)
    documentForms.add(documentForm7)
    documentForms.add(documentForm8)
    documentForms.add(documentForm9)
    documentForms.add(documentForm10)
    documentForms.add(documentForm11)
    documentForms.add(documentForm12)
    documentForms.add(documentForm13)
    documentForms.add(documentForm14)
    documentForms.add(documentForm15)
    documentForms.add(documentForm16)
    documentForms.add(documentForm17)
    documentForms.add(documentForm18)
    documentForms.add(documentForm19)
    documentForms.add(documentForm20)
    documentForms.add(documentForm21)
    documentForms.add(documentForm22)
    documentForms.add(documentForm23)
    documentForms.add(documentForm24)
    documentForms.add(documentForm25)
    var compositionUnit = createCompositionUnit(recipient, documentForms)
    return compositionUnit
  }
}