package una.integration.mapping.hpx.common.composition

uses una.integration.mapping.hpx.common.HPXCompositionUnitMapper
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 2/6/17
 * Time: 12:00 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXAddlIntLienHolderCompositionUnitMapper extends HPXCompositionUnitMapper {
  override function createCompositionUnitForRecipient(policyPeriod: PolicyPeriod, forms: Form[], recipient : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType)
      : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType {
    var documentForms = createDocumentForms(forms.where(\elt -> elt.Pattern.AddnlIntLienholderRecType == true))
    var compositionUnit = addFormsToCompositionUnit(recipient, documentForms)
    return compositionUnit
  }

  override function getRecipients(policyPeriod: PolicyPeriod, recipientMapper : HPXRecipientMapper): List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType> {
    var recipients = new List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType>()
    var additionalInterests = recipientMapper.getAdditionalInterests(policyPeriod)
    return createAdditionalInterestRecipients(additionalInterests.where( \ elt -> elt.AdditionalInterestType == typekey.AdditionalInterestType.TC_LIEN), recipientMapper)
  }

  private function createAdditionalInterestRecipients(additionalInterests : AddlInterestDetail [], recipientMapper : HPXRecipientMapper) : List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType> {
    var recipients = new List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType>()
    for (additionalInterest in additionalInterests) {
      var recipient = recipientMapper.createRecipient("LIEN_HOLDER_PDF",
          "Lienholder",
          additionalInterest.PolicyAddlInterest.AccountContactRole.AccountContact.Contact.DisplayName,
          additionalInterest.PolicyAddlInterest.AccountContactRole.AccountContact.Contact.PrimaryAddress,
          additionalInterest.PolicyAddlInterest.AccountContactRole.AccountContact.Contact.EmailAddress1,
          1)
      recipients.add(recipient)
    }
    return recipients
  }
}