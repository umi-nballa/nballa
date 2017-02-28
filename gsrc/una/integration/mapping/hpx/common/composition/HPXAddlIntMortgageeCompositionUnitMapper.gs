package una.integration.mapping.hpx.common.composition

uses una.integration.mapping.hpx.common.HPXCompositionUnitMapper
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 2/6/17
 * Time: 12:01 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXAddlIntMortgageeCompositionUnitMapper extends HPXCompositionUnitMapper {
  override function createCompositionUnitForRecipient(policyPeriod: PolicyPeriod, forms: Form[], recipient : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType)
      : wsi.schema.una.hpx.hpx_application_request.types.complex.CompositionUnitType {
    var documentForms = createDocumentForms(forms.where(\elt -> elt.Pattern.AddnlIntMortgageeRecType))
    var compositionUnit = addFormsToCompositionUnit(recipient, documentForms)
    return compositionUnit
  }

  override function getRecipients(policyPeriod: PolicyPeriod, recipientMapper : HPXRecipientMapper): List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType> {
    var recipients = new List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType>()
    var additionalInterests = recipientMapper.getAdditionalInterests(policyPeriod)
    return createAdditionalInterestRecipients(additionalInterests?.where( \ elt -> elt.AdditionalInterestType == typekey.AdditionalInterestType.TC_FIRSTMORTGAGEE_EXT or
                                                                                  elt.AdditionalInterestType == typekey.AdditionalInterestType.TC_SECONDMORTGAGEE_EXT or
                                                                                  elt.AdditionalInterestType == typekey.AdditionalInterestType.TC_THIRDMORTGAGEE_EXT)
                                                                                          , recipientMapper)
  }

  private function createAdditionalInterestRecipients(additionalInterests : AddlInterestDetail [], recipientMapper : HPXRecipientMapper) : List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType> {
    var recipients = new List<wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType>()
    for (additionalInterest in additionalInterests) {
      var recipient = recipientMapper.createRecipient("MORGAGEE_PDF",
          "Mortgagee",
          additionalInterest.PolicyAddlInterest.AccountContactRole.AccountContact.Contact.DisplayName,
          additionalInterest.PolicyAddlInterest.AccountContactRole.AccountContact.Contact.PrimaryAddress,
          additionalInterest.PolicyAddlInterest.AccountContactRole.AccountContact.Contact.EmailAddress1,
          1)
      recipients.add(recipient)
    }
    return recipients
  }
}