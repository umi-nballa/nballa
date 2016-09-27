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

  function createJobStatus(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PolicySummaryInfoType {
    var policySummaryInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PolicySummaryInfoType()
    policySummaryInfo.PolicyStatusCd = policyPeriod.Job.Subtype
    policySummaryInfo.PolicyStatusDesc = policyPeriod.Job.Subtype.Description
    if (policySummaryInfo.TransactionTypeDt != null) {
      policySummaryInfo.TransactionTypeDt.Day = policyPeriod.Job.getJobDate().DayOfMonth
      policySummaryInfo.TransactionTypeDt.Month = policyPeriod.Job.getJobDate().MonthOfYear
      policySummaryInfo.TransactionTypeDt.Year = policyPeriod.Job.getJobDate().YearOfDate
    }
    if(policyPeriod.Cancellation != null) {
      policySummaryInfo.addChild(new XmlElement("CancellationInfo", createCancellationInfo(policyPeriod)))
    } else if (policyPeriod.Job != null) {
      policySummaryInfo.addChild(new XmlElement("EndorsementInfo", createEndorsementInfo(policyPeriod)))
    }
    policySummaryInfo.PolicyNumber = policyPeriod.PolicyNumber != null ? policyPeriod.PolicyNumber : ""
    if (policyPeriod.ModelDate != null) {
      policySummaryInfo.TransactionTypeDt.Day = policyPeriod.ModelDate.DayOfMonth
      policySummaryInfo.TransactionTypeDt.Month = policyPeriod.ModelDate.MonthOfYear
      policySummaryInfo.TransactionTypeDt.Year = policyPeriod.ModelDate.YearOfDate
    }
    return policySummaryInfo
  }

  function createCancellationInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.CancellationInfoType {
    var cancellationInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.CancellationInfoType()
    if (policyPeriod.Cancellation != null) {
      cancellationInfo.CancellationTypeCd = policyPeriod.Cancellation.Source
      cancellationInfo.CancellationTypeDesc = policyPeriod.Cancellation.Source.Description
      if (policyPeriod.Cancellation.CloseDate != null) {
        cancellationInfo.EffectiveDt.Day = policyPeriod.Cancellation.CloseDate.DayOfMonth
        cancellationInfo.EffectiveDt.Month = policyPeriod.Cancellation.CloseDate.MonthOfYear
        cancellationInfo.EffectiveDt.Year = policyPeriod.Cancellation.CloseDate.YearOfDate
        cancellationInfo.CancelReasonCd = policyPeriod.Cancellation.CancelReasonCode
      }
      cancellationInfo.CancellationTypeDesc = policyPeriod.Cancellation.CancelReasonCode.Description
      cancellationInfo.ProRateFactor = 1.0 // TODO revisit
    }
    return cancellationInfo
  }

  function createEndorsementInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.EndorsementInfoType {
    var premiumMapper = new HPXPremiumMapper()
    var endorsementInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.EndorsementInfoType()
    endorsementInfo.SequenceNumber = policyPeriod.Job.JobNumber.substring(2)
    if (policyPeriod.EffectiveDatedFields.EffectiveDate != null) {
      endorsementInfo.EffectiveDt.Day = policyPeriod.EffectiveDatedFields.EffectiveDate.DayOfMonth
      endorsementInfo.EffectiveDt.Month = policyPeriod.EffectiveDatedFields.EffectiveDate.MonthOfYear
      endorsementInfo.EffectiveDt.Year = policyPeriod.EffectiveDatedFields.EffectiveDate.YearOfDate
    }
    if (policyPeriod.EffectiveDatedFields.ExpirationDate != null) {
      endorsementInfo.ExpirationDt.Day = policyPeriod.EffectiveDatedFields.ExpirationDate.DayOfMonth
      endorsementInfo.ExpirationDt.Month = policyPeriod.EffectiveDatedFields.ExpirationDate.MonthOfYear
      endorsementInfo.ExpirationDt.Year = policyPeriod.EffectiveDatedFields.ExpirationDate.YearOfDate
    }
    // premiums
    var endorsementPremiumInfo = premiumMapper.createEndorsementPremiumInfo(policyPeriod)
    for (child in endorsementPremiumInfo.$Children) {
      endorsementInfo.addChild(child)
    }
    return endorsementInfo
  }
}