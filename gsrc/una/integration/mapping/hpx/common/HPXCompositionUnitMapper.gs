package una.integration.mapping.hpx.common

uses java.util.Date
uses gw.xml.XmlElement

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/1/16
 * Time: 4:57 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCompositionUnitMapper {
  function createRecipient(recipientId : String, recipientCode : String, recipientName : String) : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType {
    var recipient = new wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType()
    recipient.RecipientID = recipientId
    recipient.RecipientCode = recipientCode
    recipient.RecipientName = recipientName
    return recipient
  }

  function createDocumentForm(formId : String, formLanguage : String, formName : String, formEffectiveDate : Date, formEdition : String, isDeclarationOrSchedule : Boolean)
                : wsi.schema.una.hpx.hpx_application_request.types.complex.DocumentFormType {
    var documentForm = new wsi.schema.una.hpx.hpx_application_request.types.complex.DocumentFormType()
    documentForm.FormID = formId
    documentForm.FormLanguage = formLanguage
    documentForm.FormName = formName
    if (formEffectiveDate != null) {
      documentForm.FormEffectiveDate.Day = formEffectiveDate.DayOfMonth
      documentForm.FormEffectiveDate.Month = formEffectiveDate.MonthOfYear
      documentForm.FormEffectiveDate.Year = formEffectiveDate.YearOfDate
    }
    documentForm.FormEdition = formEdition
    documentForm.IsDeclarationOrSchedule = isDeclarationOrSchedule
    return documentForm
  }

  function createCompositionUnit(recipient : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType,
                                 documentForms : List<wsi.schema.una.hpx.hpx_application_request.types.complex.DocumentFormType>)
                                        : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType {
    var documentComposition = new wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType()
    documentComposition.addChild(new XmlElement("Recipient", recipient))
    for (form in documentForms) {
      documentComposition.addChild(new XmlElement("DocumentForm", form))
    }

    var compositionUnitMapper = new HPXCompositionUnitMapper()
    var documentForm1 = compositionUnitMapper.createDocumentForm("DP04731202","English","DP04731202", new java.util.Date(),"07-02", false)
    documentComposition.addChild(new XmlElement("DocumentForm", documentForm1))

    return documentComposition
  }

  function createCompositionUnit(policyPeriod : PolicyPeriod, forms : Form[])  : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType {
    var compositionUnitMapper = new HPXCompositionUnitMapper()
    var documentForms = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DocumentFormType>()
    var recipient = compositionUnitMapper.createRecipient("INSURED_PDF", "String", "String")
    for (form in forms) {
      var formNumber = form.FormNumber.replace(" ", "")

      if(form.Pattern != null){
        formNumber += form.Pattern.Edition.replace(" ", "")
      }
      documentForms.add(createDocumentForm(formNumber, "English", form.FormDescription, form.EffectiveDate, form.Pattern.Edition, false) )
    }
    var compositionUnit = createCompositionUnit(recipient, documentForms)
    return compositionUnit
  }
}