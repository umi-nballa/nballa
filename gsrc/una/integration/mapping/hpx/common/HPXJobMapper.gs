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
    if (policyPeriod.Job typeis PolicyChange) {
      endorsementInfo.ChangeReasonDescription = (policyPeriod.Job as PolicyChange).ReasonforChange_Ext.DisplayName
      endorsementInfo.ChangeReason1 = (policyPeriod.Job as PolicyChange).Reason1_Ext.DisplayName
      endorsementInfo.ChangeReason2 = (policyPeriod.Job as PolicyChange).Reason2_Ext.DisplayName
      endorsementInfo.ChangeReason3 = (policyPeriod.Job as PolicyChange).Reason3_Ext.DisplayName
      endorsementInfo.ChangeReasonFreeform = (policyPeriod.Job as PolicyChange).ReasonFreeForm_Ext
    }
    endorsementInfo.EffectiveDt = policyPeriod.EffectiveDatedFields.EffectiveDate != null ? new XmlDate(policyPeriod.EffectiveDatedFields.EffectiveDate) : null
    endorsementInfo.ExpirationDt = policyPeriod.EffectiveDatedFields.ExpirationDate != null ? new XmlDate(policyPeriod.EffectiveDatedFields.ExpirationDate) : null
    // premiums
    var endorsementPremiumInfo = premiumMapper.createEndorsementPremiumInfo(policyPeriod)
    for (child in endorsementPremiumInfo.$Children) {
      endorsementInfo.addChild(child)
    }
    var insuredNameChange = createInsuredNameChangeInfo(policyPeriod)
    var mailingAddressChange = createInsuredMailingAddressChangeInfo(policyPeriod)
    var companyChange = createCompanyChangeInfo(policyPeriod)
    var effectivePeriodChange = createEffectivePeriodChangeInfo(policyPeriod)
    var policyNumberChange = createPolicyNumberChangeInfo(policyPeriod)
    var createPolicyNumberChangeInfo(policyPeriod)
    if(insuredNameChange != null) endorsementInfo.addChild(new XmlElement("PremiumInfo", insuredNameChange))
    if(mailingAddressChange != null) endorsementInfo.addChild(new XmlElement("PremiumInfo", mailingAddressChange))
    if(companyChange != null) endorsementInfo.addChild(new XmlElement("PremiumInfo", companyChange))
    if(effectivePeriodChange != null) endorsementInfo.addChild(new XmlElement("PremiumInfo", effectivePeriodChange))
    if(policyNumberChange != null) endorsementInfo.addChild(new XmlElement("PremiumInfo", policyNumberChange))
    var additionalInterestsAdded = createAdditionalInterestedPartiesAddedInfo(policyPeriod, policyMapper)
    for (additionalInterest in additionalInterestsAdded) {
      endorsementInfo.addChild(new XmlElement("PremiumInfo", additionalInterest))
    }
    var additionalInterestsRemoved = createAdditionalInterestedPartiesRemovedInfo(policyPeriod, policyMapper)
    for (additionalInterest in additionalInterestsRemoved) {
      endorsementInfo.addChild(new XmlElement("PremiumInfo", additionalInterest))
    }
    return endorsementInfo
  }

  function createInsuredNameChangeInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType {
    var insured = policyPeriod.PrimaryNamedInsured
    var insuredNameCurrent = insured.DisplayName
    var insuredNamePrevious = policyPeriod.BasedOn.PrimaryNamedInsured.DisplayName
    var insuredNameChanged = !insuredNameCurrent.equals(insuredNamePrevious) and (insured.AccountContactRole.AccountContact.Contact typeis Person)
    if (insuredNameChanged) {
      var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType()
      premiumInfo.ChangeDisplayNameDesc = "Insured Name Change"
      premiumInfo.ChangeTypeDesc = "InsuredNameChange"
      premiumInfo.SequenceNumber = 0
      premiumInfo.PreviousPremiumAmt.Amt = 0.00
      premiumInfo.PremiumAmt.Amt = 0.00
      premiumInfo.ProRateFactor = 0
      premiumInfo.AdditionalPremiumAmt.Amt = 0.00
      premiumInfo.ReturnPremiumAmt.Amt = 0.00
      premiumInfo.RiskDesc = "Insured Name Changed"
      premiumInfo.PreviousValueDesc = insuredNamePrevious
      premiumInfo.NewValueDesc = insuredNameCurrent
      return premiumInfo
    } else {
      return null
    }
  }

  function createInsuredMailingAddressChangeInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType {
    var insured = policyPeriod.PrimaryNamedInsured
    var insuredMailingAddressCurrent = insured.AccountContactRole.AccountContact.Contact.AllAddresses.firstWhere( \ elt -> elt.AddressType == typekey.AddressType.TC_BILLING)
    var insuredMailingAddressPrevious = policyPeriod?.BasedOn?.PrimaryNamedInsured?.AccountContactRole?.AccountContact?.Contact?.AllAddresses?.firstWhere( \ elt -> elt.AddressType == typekey.AddressType.TC_BILLING)
    var insuredMailingAddressChanged = !insuredMailingAddressCurrent?.equals(insuredMailingAddressPrevious)
    if (insuredMailingAddressChanged) {
      var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType()
      premiumInfo.ChangeDisplayNameDesc = "Insured Mailing Address Change"
      premiumInfo.ChangeTypeDesc = "InsuredMailingAddressChange"
      premiumInfo.SequenceNumber = 0
      premiumInfo.PreviousPremiumAmt.Amt = 0.00
      premiumInfo.PremiumAmt.Amt = 0.00
      premiumInfo.ProRateFactor = 0
      premiumInfo.AdditionalPremiumAmt.Amt = 0.00
      premiumInfo.ReturnPremiumAmt.Amt = 0.00
      premiumInfo.RiskDesc = "Insured Mailing Address Changed"
      premiumInfo.PreviousValueDesc = insuredMailingAddressPrevious
      premiumInfo.NewValueDesc = insuredMailingAddressCurrent
      return premiumInfo
    } else {
      return null
    }
  }

  function createPolicyNumberChangeInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType {
    var policyNumberCurrent = policyPeriod.PolicyNumber
    var policyNumberPrevious = policyPeriod.BasedOn.PolicyNumber
    var policyNumberChanged = !policyNumberCurrent?.equals(policyNumberPrevious)
    if (policyNumberChanged) {
      var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType()
      premiumInfo.ChangeDisplayNameDesc = "Policy Number Change"
      premiumInfo.ChangeTypeDesc = "PolicyNumberChange"
      premiumInfo.SequenceNumber = 0
      premiumInfo.PreviousPremiumAmt.Amt = 0.00
      premiumInfo.PremiumAmt.Amt = 0.00
      premiumInfo.ProRateFactor = 0
      premiumInfo.AdditionalPremiumAmt.Amt = 0.00
      premiumInfo.ReturnPremiumAmt.Amt = 0.00
      premiumInfo.RiskDesc = "Policy Number Changed"
      premiumInfo.PreviousValueDesc = policyNumberPrevious
      premiumInfo.NewValueDesc = policyNumberCurrent
      return premiumInfo
    } else {
      return null
    }
  }

  function createCompanyChangeInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType {
    var insured = policyPeriod.PrimaryNamedInsured
    var insuredNameCurrent = insured.DisplayName
    var insuredNamePrevious = policyPeriod.BasedOn.PrimaryNamedInsured.DisplayName
    var insuredCompanyChanged = !insuredNameCurrent.equals(insuredNamePrevious) and (insured.AccountContactRole.AccountContact.Contact typeis Company)
    if (insuredCompanyChanged) {
      var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType()
      premiumInfo.ChangeDisplayNameDesc = "Insured Company Change"
      premiumInfo.ChangeTypeDesc = "InsuredCompanyChange"
      premiumInfo.SequenceNumber = 0
      premiumInfo.PreviousPremiumAmt.Amt = 0.00
      premiumInfo.PremiumAmt.Amt = 0.00
      premiumInfo.ProRateFactor = 0
      premiumInfo.AdditionalPremiumAmt.Amt = 0.00
      premiumInfo.ReturnPremiumAmt.Amt = 0.00
      premiumInfo.RiskDesc = "Insured Company Changed"
      premiumInfo.PreviousValueDesc = insuredNamePrevious
      premiumInfo.NewValueDesc = insuredNameCurrent
      return premiumInfo
    } else {
      return null
    }
  }

  function createEffectivePeriodChangeInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType {
    var effectiveDateCurrent = policyPeriod.EffectiveDatedFields.EffectiveDate
    var effectiveDatePrevious = policyPeriod.BasedOn.EffectiveDatedFields.EffectiveDate
    var expirationDateCurrent = policyPeriod.EffectiveDatedFields.ExpirationDate
    var expirationDatePrevious = policyPeriod.BasedOn.EffectiveDatedFields.ExpirationDate
    var effectivePeriodChanged = !(effectiveDateCurrent.equals(effectiveDatePrevious) and expirationDateCurrent.equals(expirationDatePrevious))
    if (effectivePeriodChanged) {
      var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType()
      premiumInfo.ChangeDisplayNameDesc = "Effective Period Change"
      premiumInfo.ChangeTypeDesc = "EffectivePeriodChange"
      premiumInfo.SequenceNumber = 0
      premiumInfo.PreviousPremiumAmt.Amt = 0.00
      premiumInfo.PremiumAmt.Amt = 0.00
      premiumInfo.ProRateFactor = 0
      premiumInfo.AdditionalPremiumAmt.Amt = 0.00
      premiumInfo.ReturnPremiumAmt.Amt = 0.00
      premiumInfo.RiskDesc = "Effective Period Changed"
      premiumInfo.PreviousValueDesc = effectiveDatePrevious + " - " + expirationDatePrevious
      premiumInfo.NewValueDesc = effectiveDateCurrent + " - " + expirationDateCurrent
      return premiumInfo
    } else {
      return null
    }
  }

  function createLegalStatusChangeInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType {
    var entityTypeCurrent = policyPeriod.Policy.Account.AccountOrgType
    var entityTypePrevious = policyPeriod.BasedOn.Policy.Account.AccountOrgType
    var entityTypeChanged = !entityTypeCurrent.equals(entityTypePrevious)
    if (entityTypeChanged) {
      var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType()
      premiumInfo.ChangeDisplayNameDesc = "Legal Status Change"
      premiumInfo.ChangeTypeDesc = "LegalStatusChange"
      premiumInfo.SequenceNumber = 0
      premiumInfo.PreviousPremiumAmt.Amt = 0.00
      premiumInfo.PremiumAmt.Amt = 0.00
      premiumInfo.ProRateFactor = 0
      premiumInfo.AdditionalPremiumAmt.Amt = 0.00
      premiumInfo.ReturnPremiumAmt.Amt = 0.00
      premiumInfo.RiskDesc = "Legal Status Changed"
      premiumInfo.PreviousValueDesc = entityTypePrevious
      premiumInfo.NewValueDesc = entityTypeCurrent
      return premiumInfo
    } else {
      return null
    }
  }

  function createPaymentPlanChangeInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType {
    var paymentPlanCurrent = policyPeriod.SelectedPaymentPlan.PaymentPlanName != null ? policyPeriod.SelectedPaymentPlan.PaymentPlanName : null
    var paymentPlanPrevious = policyPeriod.BasedOn.SelectedPaymentPlan.PaymentPlanName != null ? policyPeriod.BasedOn.SelectedPaymentPlan.PaymentPlanName : null
    var paymentPlanChanged = !paymentPlanCurrent?.equals(paymentPlanPrevious)
    if (paymentPlanChanged) {
      var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType()
      premiumInfo.ChangeDisplayNameDesc = "Payment Plan Change"
      premiumInfo.ChangeTypeDesc = "PaymentPlanChange"
      premiumInfo.SequenceNumber = 0
      premiumInfo.PreviousPremiumAmt.Amt = 0.00
      premiumInfo.PremiumAmt.Amt = 0.00
      premiumInfo.ProRateFactor = 0
      premiumInfo.AdditionalPremiumAmt.Amt = 0.00
      premiumInfo.ReturnPremiumAmt.Amt = 0.00
      premiumInfo.RiskDesc = "Payment Plan Changed"
      premiumInfo.PreviousValueDesc = paymentPlanPrevious
      premiumInfo.NewValueDesc = paymentPlanCurrent
      return premiumInfo
    } else {
      return null
    }
  }

  function createAdditionalInterestedPartiesAddedInfo(policyPeriod : PolicyPeriod, policyMapper : HPXPolicyMapper) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType> {
    var premiumInfos = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType>()
    var structuresCurrent = policyMapper.getStructures(policyPeriod)
    var structuresPrevious = policyMapper.getStructures(policyPeriod.BasedOn)
    for (struct in structuresCurrent) {
      var additionalInterestsCurrent = policyMapper.getAdditionalInterests(struct)
      var structureInPreviousPeriod = structuresPrevious?.firstWhere( \ elt -> elt == struct)
      var additionalInterestsPrevious = policyMapper.getAdditionalInterests(structureInPreviousPeriod)
      var addedInterests = additionalInterestsCurrent?.where( \ elt -> !additionalInterestsPrevious?.contains(elt))
      var structMsg = struct.DisplayName
      for (add in addedInterests) {
        var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType()
        premiumInfo.ChangeDisplayNameDesc = "Additional Interest Added for " + structMsg
        premiumInfo.ChangeTypeDesc = "AdditionalInterestAdded"
        premiumInfo.SequenceNumber = 0
        premiumInfo.PreviousPremiumAmt.Amt = 0.00
        premiumInfo.PremiumAmt.Amt = 0.00
        premiumInfo.ProRateFactor = 0
        premiumInfo.AdditionalPremiumAmt.Amt = 0.00
        premiumInfo.ReturnPremiumAmt.Amt = 0.00
        premiumInfo.RiskDesc = "Additional interest Added - " + structMsg + " - " + add.PolicyAddlInterest.DisplayName
        premiumInfo.PreviousValueDesc = ""
        premiumInfo.NewValueDesc = structMsg + " - " +
                                   add.PolicyAddlInterest.DisplayName + " - " +
                                   add.PolicyAddlInterest.AccountContactRole.AccountContact.Contact.PrimaryAddress.DisplayName
        premiumInfos.add(premiumInfo)
      }
    }
    return premiumInfos
  }

  function createAdditionalInterestedPartiesRemovedInfo(policyPeriod : PolicyPeriod, policyMapper : HPXPolicyMapper) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType> {
    var premiumInfos = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType>()
    var structuresCurrent = policyMapper.getStructures(policyPeriod)
    var structuresPrevious = policyMapper.getStructures(policyPeriod.BasedOn)
    for (struct in structuresCurrent) {
      var additionalInterestsCurrent = policyMapper.getAdditionalInterests(struct)
      var structureInPreviousPeriod = structuresPrevious?.firstWhere( \ elt -> elt == struct)
      var additionalInterestsPrevious = policyMapper.getAdditionalInterests(structureInPreviousPeriod)
      var removedInterests = additionalInterestsPrevious?.where( \ elt -> !additionalInterestsCurrent?.contains(elt))
      var structMsg = struct.DisplayName
      for (add in removedInterests) {
        var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType()
        premiumInfo.ChangeDisplayNameDesc = "Additional Interest Removed for " + structMsg
        premiumInfo.ChangeTypeDesc = "AdditionalInterestRemoved"
        premiumInfo.SequenceNumber = 0
        premiumInfo.PreviousPremiumAmt.Amt = 0.00
        premiumInfo.PremiumAmt.Amt = 0.00
        premiumInfo.ProRateFactor = 0
        premiumInfo.AdditionalPremiumAmt.Amt = 0.00
        premiumInfo.ReturnPremiumAmt.Amt = 0.00
        premiumInfo.RiskDesc = "Additional interest Removed - " + structMsg + " - " + add.PolicyAddlInterest.DisplayName
        premiumInfo.PreviousValueDesc = ""
        premiumInfo.NewValueDesc = structMsg + " - " +
            add.PolicyAddlInterest.DisplayName + " - " +
            add.PolicyAddlInterest.AccountContactRole.AccountContact.Contact.PrimaryAddress.DisplayName
        premiumInfos.add(premiumInfo)
      }
    }
    return premiumInfos
  }
}