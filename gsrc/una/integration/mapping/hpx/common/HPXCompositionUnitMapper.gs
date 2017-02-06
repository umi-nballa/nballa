package una.integration.mapping.hpx.common

uses java.util.Date
uses gw.xml.XmlElement
uses gw.xml.date.XmlDate
uses java.lang.Exception
uses una.integration.mapping.hpx.common.composition.HPXInsuredCompositionUnitMapper
uses una.integration.mapping.hpx.common.composition.HPXRecipientMapper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/1/16
 * Time: 4:57 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class HPXCompositionUnitMapper {

  function createDocumentForms(forms : Form[])  : List<wsi.schema.una.hpx.hpx_application_request.types.complex.DocumentFormType> {
    var documentForms = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DocumentFormType>()
    for (form in forms) {
      var formNumber = form.FormNumber.replace(" ", "")

      if(form.Pattern != null){
        formNumber += form.Pattern.Edition.replace(" ", "")
      }
      documentForms.add(createDocumentForm(formNumber, "English", form.FormDescription, form.EffectiveDate, form.Pattern.Edition, false) )
    }
    return documentForms
  }

  function createDocumentForm(formId : String, formLanguage : String, formName : String, formEffectiveDate : Date, formEdition : String, isDeclarationOrSchedule : Boolean)
                : wsi.schema.una.hpx.hpx_application_request.types.complex.DocumentFormType {
    var documentForm = new wsi.schema.una.hpx.hpx_application_request.types.complex.DocumentFormType()
    documentForm.FormID = formId
    documentForm.FormLanguage = formLanguage
    documentForm.FormName = formName
    if (formEffectiveDate != null) {
      documentForm.FormEffectiveDate = new XmlDate(formEffectiveDate)
    }
    documentForm.FormEdition = formEdition
    documentForm.IsDeclarationOrSchedule = isDeclarationOrSchedule
    return documentForm
  }

  function addFormsToCompositionUnit(recipient : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType,
                                 documentForms : List<wsi.schema.una.hpx.hpx_application_request.types.complex.DocumentFormType>)
                                        : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType {
    var documentComposition = new wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType()
    documentComposition.addChild(new XmlElement("Recipient", recipient))
    for (form in documentForms) {
      documentComposition.addChild(new XmlElement("DocumentForm", form))
    }
    var documentForm1 = createDocumentForm("DP04731202","English","DP04731202", new java.util.Date(),"07-02", false)
    documentComposition.addChild(new XmlElement("DocumentForm", documentForm1))
    return documentComposition
  }

  abstract function createCompositionUnitForRecipient(policyPeriod: PolicyPeriod, forms: Form[], recipient : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType)
        : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType

  abstract function getRecipients(policyPeriod : PolicyPeriod, recipientMapper : HPXRecipientMapper) : List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType>
}