package una.integration.mapping.hpx

uses gw.api.util.MonetaryAmounts
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/8/16
 * Time: 11:03 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXJobMapper {

  function createJobCreationUser(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.MiscParty {
    var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
    var miscParty = new wsi.schema.una.hpx.hpx_application_request.MiscParty()
    var user = policyPeriod.Job.CreateUser
    var userRole = user.Roles.where( \ elt1 -> elt1.Role.RoleType == typekey.RoleType.TC_USER).first()
    miscParty.addChild(generalPartyInfoMapper.createMiscPartyInfo(userRole.Role))
    var jobCreationUserPartyInfo = generalPartyInfoMapper.createUserGeneralPartyInfo(user)
    miscParty.addChild(jobCreationUserPartyInfo)
    return miscParty
  }

  function createJobStatus(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.PolicySummaryInfo {
    var policySummaryInfo = new wsi.schema.una.hpx.hpx_application_request.PolicySummaryInfo()
    var policyStatusCd = new wsi.schema.una.hpx.hpx_application_request.PolicyStatusCd()
    switch (policyPeriod.Job.Subtype) {
      case typekey.Job.TC_ISSUANCE :
      case typekey.Job.TC_SUBMISSION :
          policyStatusCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.PolicyStatus.Issued)
          break
      case typekey.Job.TC_CANCELLATION :
          policyStatusCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.PolicyStatus.XLC)
          break
      case typekey.Job.TC_AUDIT :
          policyStatusCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.PolicyStatus.Audit)
          break
      case typekey.Job.TC_POLICYCHANGE :
          policyStatusCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.PolicyStatus.XLC)
          break
    }
    var policyStatusDesc = new wsi.schema.una.hpx.hpx_application_request.PolicyStatusDesc()
    policyStatusDesc.setText(policyPeriod.Job.Subtype.Description)
    var policyTransactionDate = new wsi.schema.una.hpx.hpx_application_request.TransactionTypeDt()
    policyTransactionDate.setText(policyPeriod.Job.getJobDate())
    policySummaryInfo.addChild(policyStatusCd)
    policySummaryInfo.addChild(policyStatusDesc)
    if(policyPeriod.Cancellation != null) {
      policySummaryInfo.addChild(createCancellationInfo(policyPeriod))
    } else if (policyPeriod.Job != null) {
      policySummaryInfo.addChild(createEndorsementInfo(policyPeriod))
    }
    return policySummaryInfo
  }

  function createCancellationInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.CancellationInfo {
    var cancellationInfo = new wsi.schema.una.hpx.hpx_application_request.CancellationInfo()
    var cancellationTypeCd = new wsi.schema.una.hpx.hpx_application_request.CancellationTypeCd()
    var cancellationTypeDesc = new wsi.schema.una.hpx.hpx_application_request.CancellationTypeDesc()
    if (policyPeriod.Cancellation != null) {
      switch (policyPeriod.Cancellation.Source) {
        case typekey.CancellationSource.TC_CARRIER :
            cancellationTypeCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.CancellationType.FE)
            cancellationTypeDesc.setText("Carrier Cancellation")
            break
        case typekey.CancellationSource.TC_INSURED :
            cancellationTypeCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.CancellationType.AbInitio)
            cancellationTypeCd.setText("User Cancellation")
            break
      }
      var cancellationDate = policyPeriod.Cancellation.CloseDate
      var cancelEffectiveDate = new wsi.schema.una.hpx.hpx_application_request.EffectiveDt()
      cancelEffectiveDate.setText(cancellationDate)
      cancellationInfo.addChild(cancelEffectiveDate)
      var cancelReasonCd = new wsi.schema.una.hpx.hpx_application_request.CancelReasonCd()
      cancelReasonCd.setText(policyPeriod.Cancellation.CancelReasonCode)
      cancellationInfo.addChild(cancelReasonCd)
      var cancelReasonDesc = new wsi.schema.una.hpx.hpx_application_request.CancelReasonDesc()
      cancelReasonDesc.setText(policyPeriod.Cancellation.CancelReasonCode.Description)
      cancellationInfo.addChild(cancelReasonDesc)
      var prorateFactor = new wsi.schema.una.hpx.hpx_application_request.ProRateFactor()
      prorateFactor.setText(1.0)     //setText(policyPeriod.Cancellation.calculateRefundCalcMethod(policyPeriod))
      // policyPeriod.Cancellation.
      cancellationInfo.addChild(prorateFactor)
    }
    return cancellationInfo
  }

  function createEndorsementInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.EndorsementInfo {
    var premiumMapper = new HPXPremiumMapper()
    var endorsementInfo = new wsi.schema.una.hpx.hpx_application_request.EndorsementInfo()
    var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.PremiumInfo()
    var sequenceNumber = new wsi.schema.una.hpx.hpx_application_request.SequenceNumber()
    sequenceNumber.setText(policyPeriod.Job.JobNumber.substring(2))
    endorsementInfo.addChild(sequenceNumber)
    var effectiveDate = new wsi.schema.una.hpx.hpx_application_request.EffectiveDt()
    effectiveDate.setText(policyPeriod.EffectiveDatedFields.EffectiveDate)
    endorsementInfo.addChild(effectiveDate)
    var expirationDate = new wsi.schema.una.hpx.hpx_application_request.ExpirationDt()
    expirationDate.setText(policyPeriod.EffectiveDatedFields.expirationDate)
    endorsementInfo.addChild(expirationDate)
    var prorateFactor = new wsi.schema.una.hpx.hpx_application_request.ProRateFactor()
    prorateFactor.setText(1.0)     //setText(policyPeriod.Cancellation.calculateRefundCalcMethod(policyPeriod))
    // policyPeriod.Cancellation.
    endorsementInfo.addChild(prorateFactor)
    var previousPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.PreviousPremiumAmt()
    var previousAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var previousPremiumMonetaryAmt = policyPeriod.getOriginalValue("TotalPremiumRPT") as gw.pl.currency.MonetaryAmount
    previousAmt.setText(previousPremiumMonetaryAmt.Amount)
    previousPremiumAmt.addChild(previousAmt)
    endorsementInfo.addChild(previousPremiumAmt)
    var newPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.NewPremiumAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    amt.setText(policyPeriod.TotalPremiumRPT.Amount)
    newPremiumAmt.addChild(amt)
    endorsementInfo.addChild(newPremiumAmt)
    var premiumDifference = policyPeriod.TotalPremiumRPT.Amount - previousPremiumMonetaryAmt.Amount
    if (premiumDifference >= 0) {
      // Additional Premium amt
      var additionalPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.AdditionalPremiumAmt()
      var additionalAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      additionalAmt.setText(premiumDifference)
      additionalPremiumAmt.addChild(additionalAmt)
      endorsementInfo.addChild(additionalPremiumAmt)
    } else {
      var returnPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.ReturnPremiumAmt()
      var returnAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      returnAmt.setText(premiumDifference)
      returnPremiumAmt.addChild(returnAmt)
      endorsementInfo.addChild(returnPremiumAmt)
    }
    var netPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.NetPremiumAmt()
    var netAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    netAmt.setText(premiumDifference)
    netPremiumAmt.addChild(netAmt)
    endorsementInfo.addChild(netPremiumAmt)
    var premiumChanges = premiumMapper.createPremiumInfo(policyPeriod)
    for (premiumChange in premiumChanges) {
      endorsementInfo.addChild(premiumChange)
    }
    return endorsementInfo
  }
}