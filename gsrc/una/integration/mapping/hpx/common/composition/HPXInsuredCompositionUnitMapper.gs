package una.integration.mapping.hpx.common.composition

uses una.integration.mapping.hpx.common.HPXCompositionUnitMapper
uses wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 2/3/17
 * Time: 11:39 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXInsuredCompositionUnitMapper extends HPXCompositionUnitMapper {
  override function createCompositionUnitForRecipient(policyPeriod: PolicyPeriod, forms: Form[], recipient : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType)
      : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType {
    var documentForms = createDocumentForms(forms.where(\elt -> elt.Pattern.InsuredRecType == true))
    var compositionUnit = addFormsToCompositionUnit(recipient, documentForms)
    return compositionUnit
  }

  override function getRecipients(policyPeriod: PolicyPeriod, recipientMapper : HPXRecipientMapper): List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType> {
    var recipients = new List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType>()
    var recipient = recipientMapper.createRecipient("INSURED_PDF",
                                                    "Insured",
                                                    policyPeriod.PrimaryNamedInsured.DisplayName,
                                                    policyPeriod.PolicyAddress.Address,
                                                    policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact.EmailAddress1,
                                                    1)
    recipients.add(recipient)
    return recipients
  }
}