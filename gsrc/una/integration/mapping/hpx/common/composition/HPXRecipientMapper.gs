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
    formsRequests.addAll(createFormsRequestForOnBaseOnly(policyPeriod, forms))
    formsRequests.addAll(createFormsRequestForCLUEReport(policyPeriod, forms))
    formsRequests.addAll(createFormsRequestForCreditReport(policyPeriod, forms))
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
    recipient.CommunicationMethodDesc =  communicationMethod == 1 ? "Print" : "Email"
    return recipient
  }

  private function createFormsRequestForInsuredRecipientType(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var hasInsuredForms = forms.hasMatch( \ elt1 -> elt1.Pattern.InsuredRecType == true)
    return hasInsuredForms ? createFormsForRecipientType(policyPeriod, forms, new HPXInsuredCompositionUnitMapper()) : new List<String>()
  }

  private function createFormsRequestForAddlInsuredRecipientType(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var hasAddlInsuredForms = forms.hasMatch( \ elt1 -> elt1.Pattern.AddnlInsuredRecType == true)
    return hasAddlInsuredForms ? createFormsForRecipientType(policyPeriod, forms, new HPXAddlInsuredCompositionUnitMapper()) : new List<String>()
  }

  private function createFormsRequestForAddlIntLeinHolderRecipientType(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var hasAddlIntLienHolderForms = forms.hasMatch( \ elt1 -> elt1.Pattern.AddnlIntLienholderRecType == true)
    return hasAddlIntLienHolderForms ? createFormsForRecipientType(policyPeriod, forms, new HPXAddlIntLienHolderCompositionUnitMapper()) : new List<String>()
  }

  private function createFormsRequestForAddlIntMortgageeRecipientType(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var hasAddlIntLienHolderMortgagee = forms.hasMatch( \ elt1 -> elt1.Pattern.AddnlIntMortgageeRecType == true)
    return hasAddlIntLienHolderMortgagee ? createFormsForRecipientType(policyPeriod, forms, new HPXAddlIntMortgageeCompositionUnitMapper()) : new List<String>()
  }

  private function createFormsRequestForAgentRecipientType(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var hasAgentForms = forms.hasMatch( \ elt1 -> elt1.Pattern.AgentRecType == true)
   return hasAgentForms ? createFormsForRecipientType(policyPeriod, forms, new HPXAgentCompositionUnitMapper()) : new List<String>()
  }

  private function createFormsRequestForMasterAgentRecipientType(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var hasMasterAgentForms = forms.hasMatch( \ elt1 -> elt1.Pattern.MasterAgentRecType == true)
   return hasMasterAgentForms ? createFormsForRecipientType(policyPeriod, forms, new HPXMasterAgentCompositionUnitMapper()) : new List<String>()
  }

  private function createFormsRequestForOnBaseOnly(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    var onbaseOnlyForms = forms.hasMatch( \ elt1 -> elt1.Pattern.InsuredRecType == false and
                                                    elt1.Pattern.AddnlInsuredRecType == false and
                                                    elt1.Pattern.AddnlIntLienholderRecType == false and
                                                    elt1.Pattern.AddnlIntMortgageeRecType == false and
                                                    elt1.Pattern.AgentRecType == false and
                                                    elt1.Pattern.MasterAgentRecType == false)
    return onbaseOnlyForms ? createFormsForRecipientType(policyPeriod, forms, new HPXOnBaseOnlyCompositionUnitMapper()) : new List<String>()
  }

  private function createFormsRequestForCLUEReport(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    if (policyPeriod.HomeownersLine_HOEExists and (policyPeriod.HomeownersLine_HOE?.HOPriorLosses_Ext.where( \ elt -> elt.ClueReport != null).length > 0 or
        policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured).CreditReportsExt?.length > 0)) {
        var hpxRequestMapper = new HPXRequestMapper()
        var formsRequestsForRecipientType : List<String> = new()
        var compositionUnitMapper = new HPXCLUEReportCompositionUnitMapper()
        var compositionUnit = compositionUnitMapper.createCompositionUnitForRecipient(policyPeriod, forms, new wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType())
        formsRequestsForRecipientType.add(hpxRequestMapper.createFormsRequest(policyPeriod, compositionUnit))
        return formsRequestsForRecipientType
    } else   {
         return new List<String>()
    }
  }

  private function createFormsRequestForCreditReport(policyPeriod : PolicyPeriod, forms : Form []) : List<String> {
    if (policyPeriod.PolicyContactRoles.whereTypeIs(PolicyPriNamedInsured).CreditReportsExt?.length > 0 or
        policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured).CreditReportsExt?.length > 0) {
      var hpxRequestMapper = new HPXRequestMapper()
      var formsRequestsForRecipientType : List<String> = new()
      var compositionUnitMapper = new HPXCreditReportCompositionUnitMapper()
      var compositionUnit = compositionUnitMapper.createCompositionUnitForRecipient(policyPeriod, forms, new wsi.schema.una.hpx.hpx_application_request.types.complex.RecipientType())
      formsRequestsForRecipientType.add(hpxRequestMapper.createFormsRequest(policyPeriod, compositionUnit))
      return formsRequestsForRecipientType
    } else   {
      return new List<String>()
    }
  }

  function getAdditionalInterests(policyPeriod : PolicyPeriod) : AddlInterestDetail [] {
    var additionalInterests : AddlInterestDetail []
    if (policyPeriod.HomeownersLine_HOEExists) {
      additionalInterests = policyPeriod.HomeownersLine_HOE.Dwelling.AdditionalInterests
    } else if (policyPeriod.BP7LineExists) {
      var coverables = policyPeriod.AllCoverables
      for (coverable in coverables) {
        if (coverable typeis BP7Building) {
          var addInts = ((coverable as BP7Building).AdditionalInterests)
          additionalInterests?.union(addInts)
        }
      }
    } else if (policyPeriod.CPLineExists or policyPeriod.GLLineExists) {
      var coverables = policyPeriod.AllCoverables
      for (coverable in coverables) {
        if (coverable typeis CPBuilding) {
          var addInts = ((coverable as CPBuilding).AdditionalInterests)
          additionalInterests?.union(addInts)
        }
      }
    }
    return additionalInterests
  }
}