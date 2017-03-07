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
class HPXCreditReportCompositionUnitMapper extends HPXCompositionUnitMapper {
  override function createCompositionUnitForRecipient(policyPeriod: PolicyPeriod, forms: Form[], recipient : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType)
      : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType {
    var compositionUnit = addFormsToOnBaseOnlyCompositionUnit(recipient, new List<wsi.schema.una.hpx.hpx_application_request.types.complex.DocumentFormType>(), policyPeriod)
    return compositionUnit
  }

  function addFormsToOnBaseOnlyCompositionUnit(recipient : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType,
                                                documentForms : List<wsi.schema.una.hpx.hpx_application_request.types.complex.DocumentFormType>,
                                                policyPeriod  : PolicyPeriod)
      : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType {
    var documentComposition = new wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType()
    if(policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured).CreditReportsExt?.length > 0){
      documentComposition.addChild(new XmlElement("DocumentForm", createDocumentForm("NCRREPORT", "English", "NCRREPORT", null, "1", false,"NCRREPORT","LexisNexis National Credit Report")))
    }
    return documentComposition
  }

  override function getRecipients(policyPeriod: PolicyPeriod, recipientMapper : HPXRecipientMapper): List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType> {
    return new List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType>()
  }

}