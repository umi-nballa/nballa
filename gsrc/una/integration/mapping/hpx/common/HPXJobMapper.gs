package una.integration.mapping.hpx.common

uses gw.xml.XmlElement
uses wsi.schema.una.hpx.hpx_application_request.types.complex.ItemIdInfoType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.FullTermAmtType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.RecoveryAssessmentAmtType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.ChangeRecoveryAssessmentAmtType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumChangeAmtType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.NetChangeAmtType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.WrittenAmtType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.BillingInfoType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.OtherOrPriorPolicyType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.ReinstateInfoType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.RenewalInfoType
uses gw.xml.date.XmlDate
uses java.lang.Exception

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/8/16
 * Time: 11:03 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXJobMapper {

  function createJobCreationUser(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.MiscPartyType {
    var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
    var miscParty = new wsi.schema.una.hpx.hpx_application_request.types.complex.MiscPartyType()
    var user = policyPeriod.Job.CreateUser
    var userRole = user.Roles.where( \ elt1 -> elt1.Role.RoleType == typekey.RoleType.TC_USER).first()
    miscParty.addChild(new XmlElement("MiscPartyInfo", generalPartyInfoMapper.createMiscPartyInfo(userRole.Role)))
    miscParty.addChild(new XmlElement("GeneralPartyInfo", generalPartyInfoMapper.createUserGeneralPartyInfo(user)))
    return miscParty
  }

  function createJobStatus(policyPeriod : PolicyPeriod, policyMapper : HPXPolicyMapper) : wsi.schema.una.hpx.hpx_application_request.types.complex.PolicySummaryInfoType {
    var policySummaryInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PolicySummaryInfoType()
    policySummaryInfo.PolicyStatusCd = policyPeriod.Job.Subtype
    policySummaryInfo.PolicyStatusDesc = policyPeriod.Job.Subtype.Description
    policySummaryInfo.TransactionTypeDt = policySummaryInfo.TransactionTypeDt != null ? new XmlDate(policyPeriod.Job.getJobDate()) : null
    if(policyPeriod.Cancellation != null) {
      policySummaryInfo.addChild(new XmlElement("CancellationInfo", createCancellationInfo(policyPeriod)))
    } else if (policyPeriod.Job != null) {
      policySummaryInfo.addChild(new XmlElement("EndorsementInfo", createEndorsementInfo(policyPeriod, policyMapper)))
    }
    policySummaryInfo.PolicyNumber = policyPeriod.PolicyNumber != null ? policyPeriod.PolicyNumber : ""
    policySummaryInfo.TransactionTypeDt = policyPeriod.ModelDate != null ? new XmlDate(policyPeriod.ModelDate) : null
    return policySummaryInfo
  }

  function createCancellationInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.CancellationInfoType {
    var cancellationInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.CancellationInfoType()
    if (policyPeriod.Cancellation != null) {
      cancellationInfo.CancellationTypeCd = policyPeriod.Cancellation.Source
      cancellationInfo.CancellationTypeDesc = policyPeriod.Cancellation.Source.Description
      cancellationInfo.EffectiveDt = policyPeriod.Cancellation.CloseDate != null ? new XmlDate(policyPeriod.Cancellation.CloseDate) : null
      cancellationInfo.CancelReasonCd = policyPeriod.Cancellation.CloseDate != null ? policyPeriod.Cancellation.CancelReasonCode : null
      cancellationInfo.CancellationTypeDesc = policyPeriod.Cancellation.CancelReasonCode.Description
      cancellationInfo.ProRateFactor = 1.0 // TODO revisit
    }
    return cancellationInfo
  }

  function createEndorsementInfo(policyPeriod : PolicyPeriod, policyMapper : HPXPolicyMapper) : wsi.schema.una.hpx.hpx_application_request.types.complex.EndorsementInfoType {
    var premiumMapper = new HPXPremiumMapper()
    var endorsementInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.EndorsementInfoType()
    endorsementInfo.SequenceNumber = policyPeriod.Job.JobNumber.substring(2)
    endorsementInfo.ChangeDesc = createEndorsementDescription(policyPeriod, policyMapper)
    endorsementInfo.EffectiveDt = policyPeriod.EffectiveDatedFields.EffectiveDate != null ? new XmlDate(policyPeriod.EffectiveDatedFields.EffectiveDate) : null
    endorsementInfo.ExpirationDt = policyPeriod.EffectiveDatedFields.ExpirationDate != null ? new XmlDate(policyPeriod.EffectiveDatedFields.ExpirationDate) : null
    // premiums
    var endorsementPremiumInfo = premiumMapper.createEndorsementPremiumInfo(policyPeriod)
    for (child in endorsementPremiumInfo.$Children) {
      endorsementInfo.addChild(child)
    }
    return endorsementInfo
  }

  function createEndorsementDescription(policyPeriod : PolicyPeriod, policyMapper : HPXPolicyMapper) : String {
    var endorsementDescription = createInsuredNameChange(policyPeriod) +
                                 createInsuredMailingAddressChange(policyPeriod) +
                                 createPolicyNumberChange(policyPeriod) +
                                 createCompanyChange(policyPeriod) +
                                 createEffectivePeriodChange(policyPeriod) +
                                 createLegalStatusChange(policyPeriod) +
                                 createPaymentPlanChange(policyPeriod) +
                                 createAdditionalInterestedParties(policyPeriod, policyMapper)
    return endorsementDescription
  }

  private function createInsuredNameChange(policyPeriod : PolicyPeriod) : String {
    var insured = policyPeriod.PrimaryNamedInsured
    var insuredNameCurrent = insured.DisplayName
    var insuredNamePrevious = policyPeriod.BasedOn.PrimaryNamedInsured.DisplayName
    var insuredNameChanged = !insuredNameCurrent.equals(insuredNamePrevious)  and (insured.AccountContactRole.AccountContact.Contact typeis Person)
    var insuredName = insuredNameChanged ? "Insured_Name:" + insuredNameCurrent + "#" + insuredNamePrevious + "|"  : ""
    return insuredName
  }

  private function createInsuredMailingAddressChange(policyPeriod : PolicyPeriod) : String {
    var insured = policyPeriod.PrimaryNamedInsured
    var insuredMailingAddressCurrent = insured.AccountContactRole.AccountContact.Contact.AllAddresses.firstWhere( \ elt -> elt.AddressType == typekey.AddressType.TC_BILLING)
    var insuredMailingAddressPrevious = policyPeriod?.BasedOn?.PrimaryNamedInsured?.AccountContactRole?.AccountContact?.Contact?.AllAddresses?.firstWhere( \ elt -> elt.AddressType == typekey.AddressType.TC_BILLING)
    var insuredMailingAddressChanged = !insuredMailingAddressCurrent.equals(insuredMailingAddressPrevious)
    var insuredMailingAddress = insuredMailingAddressChanged ? "Insured_Mailing_Address:" + insuredMailingAddressCurrent + "#" + insuredMailingAddressPrevious + "|"  : ""
    return insuredMailingAddress
  }

  private function createPolicyNumberChange(policyPeriod : PolicyPeriod) : String {
    var policyNumberCurrent = policyPeriod.PolicyNumber
    var policyNumberPrevious = policyPeriod.BasedOn.PolicyNumber
    var policyNumberChanged = !policyNumberCurrent?.equals(policyNumberPrevious)
    var policyNumber = policyNumberChanged ? "Policy_Number:" + policyNumberCurrent + "#" + policyNumberPrevious + "|"  : ""
    return policyNumber
  }

  private function createCompanyChange(policyPeriod : PolicyPeriod) : String {
    var insured = policyPeriod.PrimaryNamedInsured
    var insuredNameCurrent = insured.DisplayName
    var insuredNamePrevious = policyPeriod.BasedOn.PrimaryNamedInsured.DisplayName
    var insuredNameChanged = !insuredNameCurrent.equals(insuredNamePrevious) and (insured.AccountContactRole.AccountContact.Contact typeis Company)
    var insuredName = insuredNameChanged ? "Company:" + insuredNameCurrent + "#" + insuredNamePrevious + "|"  : ""
    return insuredName
  }

  private function createEffectivePeriodChange(policyPeriod : PolicyPeriod) : String {
    var effectiveDateCurrent = policyPeriod.EffectiveDatedFields.EffectiveDate
    var effectiveDatePrevious = policyPeriod.BasedOn.EffectiveDatedFields.EffectiveDate
    var expirationDateCurrent = policyPeriod.EffectiveDatedFields.ExpirationDate
    var expirationDatePrevious = policyPeriod.BasedOn.EffectiveDatedFields.ExpirationDate
    var effectivePeriodChanged = !(effectiveDateCurrent.equals(effectiveDatePrevious) and expirationDateCurrent.equals(expirationDatePrevious))
    var effectivePeriod = effectivePeriodChanged ? "Effective-Expiration Date:" + effectiveDateCurrent + "-" + expirationDateCurrent + "#" + effectiveDatePrevious + "-" + expirationDatePrevious + "|"  : ""
    return effectivePeriod
  }

  private function createLegalStatusChange(policyPeriod : PolicyPeriod) : String {
    var entityTypeCurrent = policyPeriod.Policy.Account.AccountOrgType
    var entityTypePrevious = policyPeriod.BasedOn.Policy.Account.AccountOrgType
    var entityTypeChanged = !entityTypeCurrent.equals(entityTypePrevious)
    var entityType = entityTypeChanged ? "Legal_Status:" + entityTypeCurrent + "#" + entityTypePrevious + "|"  : ""
    return entityType
  }

  private function createPaymentPlanChange(policyPeriod : PolicyPeriod) : String {
    var paymentPlan = ""
    try {
      var paymentOptionMapper = new HPXPaymentOptionMapper()
      var paymentPlanCurrent = policyPeriod.SelectedPaymentPlan.PaymentPlanName != null ? policyPeriod.SelectedPaymentPlan.PaymentPlanName : null
      var paymentPlanPrevious = policyPeriod.BasedOn.SelectedPaymentPlan.PaymentPlanName != null ? policyPeriod.BasedOn.SelectedPaymentPlan.PaymentPlanName : null
      var paymentPlanChanged = !paymentPlanCurrent?.equals(paymentPlanPrevious)
      paymentPlan = paymentPlanChanged ? "Payment_Plan:" + paymentPlanCurrent + "#" + paymentPlanPrevious + "|"  : ""
    } catch (e : Exception) {}
    return paymentPlan
  }

  private function createAdditionalInterestedParties(policyPeriod : PolicyPeriod, policyMapper : HPXPolicyMapper) : String {
    var additionalInterestChanges = ""
    var structuresCurrent = policyMapper.getStructures(policyPeriod)
    var structuresPrevious = policyMapper.getStructures(policyPeriod.BasedOn)
    for (struct in structuresCurrent) {
      var additionalInterestsCurrent = policyMapper.getAdditionalInterests(struct)
      var structureInPreviousPeriod = structuresPrevious?.firstWhere( \ elt -> elt == struct)
      var additionalInterestsPrevious = policyMapper.getAdditionalInterests(structureInPreviousPeriod)
      var addedInterests = additionalInterestsCurrent?.where( \ elt -> !additionalInterestsPrevious?.contains(elt))
      var structMsg = struct.DisplayName
      for (add in addedInterests) {
        structMsg = structMsg + "~" + "New" + "~" + add.PolicyAddlInterest.DisplayName
        structMsg = structMsg + "~" + add.PolicyAddlInterest.AccountContactRole.AccountContact.Contact.PrimaryAddress.DisplayName
      }
      var removedInterests = additionalInterestsPrevious?.where( \ elt -> !additionalInterestsCurrent?.contains(elt))
      for (add in removedInterests) {
        structMsg = structMsg + "~" + "Old" + "~" + add.PolicyAddlInterest.DisplayName
        structMsg = structMsg + "~" + add.PolicyAddlInterest.AccountContactRole.AccountContact.Contact.PrimaryAddress.DisplayName
      }
      additionalInterestChanges = additionalInterestChanges + structMsg
    }
    return additionalInterestChanges
  }
}