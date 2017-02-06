package una.integration.mapping.hpx.common.composition

uses java.lang.Exception
uses una.integration.mapping.hpx.common.HPXCompositionUnitMapper
uses una.integration.mapping.hpx.common.HPXRequestMapper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 2/6/17
 * Time: 11:02 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXRecipientMapper {

  function createFormsForRecipients(policyPeriod : PolicyPeriod, forms : Form[]) : List<String> {
    var formsRequests : List<String> = new()
    formsRequests.addAll(createFormsRequestForInsuredRecipientType(policyPeriod, forms))
    formsRequests.addAll(createFormsRequestForAddlInsuredRecipientType(policyPeriod, forms))
    formsRequests.addAll(createFormsRequestForAddlIntLeinHolderRecipientType(policyPeriod, forms))
    formsRequests.addAll(createFormsRequestForAddlIntMortgageeRecipientType(policyPeriod, forms))
    formsRequests.addAll(createFormsRequestForAgentRecipientType(policyPeriod, forms))
    formsRequests.addAll(createFormsRequestForMasterAgentRecipientType(policyPeriod, forms))
    return formsRequests
  }

  private function createFormsForRecipientType(policyPeriod : PolicyPeriod, forms : form[], compositionUnitMapper : HPXCompositionUnitMapper) : List<String> {
    var hpxRequestMapper = new HPXRequestMapper()
    var formsRequestsForRecipientType : List<String> = new()
    var recipentsForRecipientType = compositionUnitMapper.getRecipients(policyPeriod, this)
    for (recipient in recipentsForRecipientType) {
      var compositionUnit = compositionUnitMapper.createCompositionUnitForRecipient(policyPeriod, forms, recipient)
      formsRequestsForRecipientType.add(hpxRequestMapper.createFormsRequest(policyPeriod, compositionUnit))
    }
    return formsRequestsForRecipientType
  }

  function createRecipient(recipientId : String, recipientCode : String, recipientName : String, address : Address, emailAddress : String, communicationMethod : int)
                                  : wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType {
    var recipient = new wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType()
    recipient.RecipientID = recipientId
    recipient.RecipientCode = recipientCode
    recipient.RecipientName = recipientName
    recipient.PostalAddress.AddressLine1 = address.AddressLine1
    recipient.PostalAddress.AddressLine2 = address.AddressLine2
    recipient.PostalAddress.City = address.City
    recipient.PostalAddress.State = address.State
    recipient.EmailAddress.EmailAddr = emailAddress
    recipient.CommunicationMethodCode = communicationMethod
    recipient.CommunicationMethodDesc =  communicationMethod == 1 ? "Post" : "Email"
    return recipient
  }

  private function createFormsRequestForInsuredRecipientType(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var isInsuredForms = forms.hasMatch( \ elt1 -> elt1.Pattern.InsuredRecType == true)
    return createFormsForRecipientType(policyPeriod, forms, new HPXInsuredCompositionUnitMapper())
  }

  private function createFormsRequestForAddlInsuredRecipientType(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var isInsuredForms = forms.hasMatch( \ elt1 -> elt1.Pattern.AddnlInsuredRecType == true)
    return createFormsForRecipientType(policyPeriod, forms, new HPXInsuredCompositionUnitMapper())
  }

  private function createFormsRequestForAddlIntLeinHolderRecipientType(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var isInsuredForms = forms.hasMatch( \ elt1 -> elt1.Pattern.AddnlIntLienholderRecType == true)
    return createFormsForRecipientType(policyPeriod, forms, new HPXInsuredCompositionUnitMapper())
  }

  private function createFormsRequestForAddlIntMortgageeRecipientType(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var isInsuredForms = forms.hasMatch( \ elt1 -> elt1.Pattern.AddnlIntMortgageeRecType == true)
    return createFormsForRecipientType(policyPeriod, forms, new HPXInsuredCompositionUnitMapper())
  }

  private function createFormsRequestForAgentRecipientType(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var isInsuredForms = forms.hasMatch( \ elt1 -> elt1.Pattern.AgentRecType == true)
    return createFormsForRecipientType(policyPeriod, forms, new HPXInsuredCompositionUnitMapper())
  }

  private function createFormsRequestForMasterAgentRecipientType(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var isInsuredForms = forms.hasMatch( \ elt1 -> elt1.Pattern.MasterAgentRecType == true)
    return createFormsForRecipientType(policyPeriod, forms, new HPXInsuredCompositionUnitMapper())
  }
}