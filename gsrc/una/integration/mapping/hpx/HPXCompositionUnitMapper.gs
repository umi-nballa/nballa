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
    var documentForm = compositionUnitMapper.createDocumentForm("HO03170901","English","HO03170901", new java.util.Date(),"07-02", false)
    documentForms.add(documentForm)
    var compositionUnit = createCompositionUnit(recipient, documentForms)
    return compositionUnit
  }
}