package una.integration.mapping.hpx.common.composition

uses una.integration.mapping.hpx.common.HPXCompositionUnitMapper
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 2/6/17
 * Time: 12:01 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXMasterAgentCompositionUnitMapper extends HPXCompositionUnitMapper {
  override function createCompositionUnitForRecipient(policyPeriod: PolicyPeriod, forms: Form[], recipient : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType)
      : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType {
    var documentForms = createDocumentForms(forms.where(\elt -> elt.Pattern.MasterAgentRecType == true))
    var compositionUnit = addFormsToCompositionUnit(recipient, documentForms)
    return compositionUnit
  }

  override function getRecipients(policyPeriod: PolicyPeriod, recipientMapper : HPXRecipientMapper): List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType> {
    var recipients = new List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType>()
    var masterAgent = policyPeriod.ProducerOfRecord.MasterOrganization_Ext
    var recipient = recipientMapper.createRecipient("MASTER_AGENT_PDF",
        "MasterAgent",
        masterAgent.DisplayName,
        masterAgent.Contact.PrimaryAddress,
        masterAgent.Contact.EmailAddress1,
        1)
    recipients.add(recipient)
    return recipients
  }
}