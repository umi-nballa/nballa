package una.integration.mapping.hpx.common.composition

uses una.integration.mapping.hpx.common.HPXCompositionUnitMapper
uses gw.xml.XmlElement

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 2/6/17
 * Time: 12:01 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXOnBaseOnlyCompositionUnitMapper extends HPXCompositionUnitMapper {
  override function createCompositionUnitForRecipient(policyPeriod: PolicyPeriod, forms: Form[], recipient : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType)
      : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType {
    var documentForms = createDocumentForms(forms.where( \ elt1 -> elt1.Pattern.InsuredRecType == false and
        elt1.Pattern.AddnlInsuredRecType == false and
        elt1.Pattern.AddnlIntLienholderRecType == false and
        elt1.Pattern.AddnlIntMortgageeRecType == false and
        elt1.Pattern.AgentRecType == false and
        elt1.Pattern.MasterAgentRecType == false))
    var compositionUnit = addFormsToCompositionUnit(recipient, documentForms)
    return compositionUnit
  }

  override function getRecipients(policyPeriod: PolicyPeriod, recipientMapper : HPXRecipientMapper): List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType> {
    return new List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType>()
  }

}