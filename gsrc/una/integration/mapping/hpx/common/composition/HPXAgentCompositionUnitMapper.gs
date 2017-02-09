package una.integration.mapping.hpx.common.composition

uses una.integration.mapping.hpx.common.HPXCompositionUnitMapper
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 2/6/17
 * Time: 12:01 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXAgentCompositionUnitMapper extends HPXCompositionUnitMapper {
  override function createCompositionUnitForRecipient(policyPeriod: PolicyPeriod, forms: Form[], recipient : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType)
      : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType {
    var documentForms = createDocumentForms(forms.where(\elt -> elt.Pattern.AgentRecType == true))
    var compositionUnit = addFormsToCompositionUnit(recipient, documentForms)
    return compositionUnit
  }

  override function getRecipients(policyPeriod: PolicyPeriod, recipientMapper : HPXRecipientMapper): List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType> {
    var recipients = new List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType>()
    var agent = policyPeriod.ProducerOfRecord
    var recipient = recipientMapper.createRecipient("AGENT_PDF",
        "Agent",
        agent.DisplayName,
        agent.Contact.PrimaryAddress,
        agent.Contact.EmailAddress1,
        1)
    recipients.add(recipient)
    return recipients
  }
}