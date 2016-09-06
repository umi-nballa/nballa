package una.integration.mapping.hpx.common

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
    recipient = compositionUnitMapper.createRecipient("INSURED_PDF", "String", "String")
  /*
    for (form in forms) {
      documentForms.add(createDocumentForm(form.FormNumber, "English", form.FormDescription, form.EffectiveDate, form.Pattern.Edition, false) )
    }
  */

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
    var documentForm26 = compositionUnitMapper.createDocumentForm("CAOOL0609","English","CAOOL0609", new java.util.Date(),"07-02", false)
    var documentForm27 = compositionUnitMapper.createDocumentForm("DP04710694","English","DP04710694", new java.util.Date(),"07-02", false)
    var documentForm28 = compositionUnitMapper.createDocumentForm("DP04711202","English","DP04711202", new java.util.Date(),"07-02", false)
    var documentForm36 = compositionUnitMapper.createDocumentForm("HO04201000","English","HO04201000", new java.util.Date(),"07-02", false)
    var documentForm43 = compositionUnitMapper.createDocumentForm("HO04771000","English","HO04771000", new java.util.Date(),"07-02", false)
    var documentForm44 = compositionUnitMapper.createDocumentForm("HO04811000","English","HO04811000", new java.util.Date(),"07-02", false)
    var documentForm46 = compositionUnitMapper.createDocumentForm("HO05431000","English","HO05431000", new java.util.Date(),"07-02", false)
    var documentForm47 = compositionUnitMapper.createDocumentForm("HO1050792","English","HO1050792", new java.util.Date(),"07-02", false)
    var documentForm48 = compositionUnitMapper.createDocumentForm("HO23561205","English","HO23561205", new java.util.Date(),"07-02", false)
    var documentForm49 = compositionUnitMapper.createDocumentForm("HO24711000","English","HO24711000", new java.util.Date(),"07-02", false)
    var documentForm51 = compositionUnitMapper.createDocumentForm("HO32200612","English","HO32200612", new java.util.Date(),"07-02", false)
    var documentForm54 = compositionUnitMapper.createDocumentForm("HO32960503","English","HO32960503", new java.util.Date(),"07-02", false)
    var documentForm55 = compositionUnitMapper.createDocumentForm("INUN10150316","English","INUN10150316", new java.util.Date(),"07-02", false)
    var documentForm56 = compositionUnitMapper.createDocumentForm("INUN10160316","English","INUN10160316", new java.util.Date(),"07-02", false)
    var documentForm57 = compositionUnitMapper.createDocumentForm("PL24150986","English","PL24150986", new java.util.Date(),"07-02", false)
    var documentForm59 = compositionUnitMapper.createDocumentForm("TDP0100792","English","TDP0100792", new java.util.Date(),"07-02", false)
    var documentForm60 = compositionUnitMapper.createDocumentForm("TDP0110792","English","TDP0110792", new java.util.Date(),"07-02", false)
    var documentForm61 = compositionUnitMapper.createDocumentForm("TDP0150792","English","TDP0150792", new java.util.Date(),"07-02", false)
    var documentForm62 = compositionUnitMapper.createDocumentForm("TDP0260401","English","TDP0260401", new java.util.Date(),"07-02", false)
    var documentForm63 = compositionUnitMapper.createDocumentForm("TDP0270401","English","TDP0270401", new java.util.Date(),"07-02", false)
    var documentForm64 = compositionUnitMapper.createDocumentForm("UI04200607","English","UI04200607", new java.util.Date(),"07-02", false)
    var documentForm65 = compositionUnitMapper.createDocumentForm("UI2040904","English","UI2040904", new java.util.Date(),"07-02", false)
    var documentForm66 = compositionUnitMapper.createDocumentForm("UIDPXC0412","English","UIDPXC0412", new java.util.Date(),"07-02", false)
    var documentForm67 = compositionUnitMapper.createDocumentForm("UIDPXW0607","English","UIDPXW0607", new java.util.Date(),"07-02", false)
    var documentForm69 = compositionUnitMapper.createDocumentForm("UIHOXW0607","English","UIHOXW0607", new java.util.Date(),"07-02", false)
    var documentForm70 = compositionUnitMapper.createDocumentForm("UIHOXW0607","English","UIHOXW0607", new java.util.Date(),"07-02", false)
    var documentForm71 = compositionUnitMapper.createDocumentForm("UISCMVINS0916","English","UISCMVINS0916", new java.util.Date(),"07-02", false)
    var documentForm72 = compositionUnitMapper.createDocumentForm("UN10050308","English","UN10050308", new java.util.Date(),"07-02", false)
    var documentForm73 = compositionUnitMapper.createDocumentForm("UNLPP03510111","English","UNLPP03510111", new java.util.Date(),"07-02", false)
    var documentForm74 = compositionUnitMapper.createDocumentForm("UNLPP04691202","English","UNLPP04691202", new java.util.Date(),"07-02", false)
    var documentForm75 = compositionUnitMapper.createDocumentForm("UNLPP04711202","English","UNLPP04711202", new java.util.Date(),"07-02", false)
    var documentForm77 = compositionUnitMapper.createDocumentForm("MRCO0508","English","MRCO0508", new java.util.Date(),"07-02", false)
    var documentForm79 = compositionUnitMapper.createDocumentForm("HO04511000","English","HO04511000", new java.util.Date(),"07-02", false)
    var documentForm81 = compositionUnitMapper.createDocumentForm("HO04121000","English","HO04121000", new java.util.Date(),"07-02", false)

    var documentForm82 = compositionUnitMapper.createDocumentForm("HO04401000","English","HO04401000", new java.util.Date(),"07-02", false)
    var documentForm83 = compositionUnitMapper.createDocumentForm("HO04500511","English","HO04500511", new java.util.Date(),"07-02", false)
    var documentForm84 = compositionUnitMapper.createDocumentForm("HO04531000","English","HO04531000", new java.util.Date(),"07-02", false)
    var documentForm85 = compositionUnitMapper.createDocumentForm("TDP_026_ICT","English","TDP_026_ICT", new java.util.Date(),"07-02", false)
    var documentForm86 = compositionUnitMapper.createDocumentForm("TDP_027_ICT","English","TDP_027_ICT", new java.util.Date(),"07-02", false)



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
    documentForms.add(documentForm26)
    documentForms.add(documentForm27)
    documentForms.add(documentForm28)
    documentForms.add(documentForm36)
    documentForms.add(documentForm43)
    documentForms.add(documentForm44)
    documentForms.add(documentForm46)
    documentForms.add(documentForm47)
    documentForms.add(documentForm48)
    documentForms.add(documentForm49)
    documentForms.add(documentForm51)
    documentForms.add(documentForm54)
    documentForms.add(documentForm55)
    documentForms.add(documentForm56)
    documentForms.add(documentForm57)
    documentForms.add(documentForm59)
    documentForms.add(documentForm60)
    documentForms.add(documentForm61)
    documentForms.add(documentForm62)
    documentForms.add(documentForm63)
    documentForms.add(documentForm64)
    documentForms.add(documentForm65)
    documentForms.add(documentForm66)
    documentForms.add(documentForm67)
    documentForms.add(documentForm69)
    documentForms.add(documentForm70)
    documentForms.add(documentForm71)
    documentForms.add(documentForm72)
    documentForms.add(documentForm73)
    documentForms.add(documentForm74)
    documentForms.add(documentForm75)
    documentForms.add(documentForm77)
    documentForms.add(documentForm79)
    documentForms.add(documentForm81)

    documentForms.add(documentForm82)
    documentForms.add(documentForm83)
    documentForms.add(documentForm84)
    documentForms.add(documentForm85)
    documentForms.add(documentForm86)

    var compositionUnit = createCompositionUnit(recipient, documentForms)
    return compositionUnit
  }
}