package una.integration.mapping.hpx.common


/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/9/16
 * Time: 4:23 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXPremiumMapper {
  function createTransactionPremiumInfo(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.PremiumInfo> {
    var premiumInfos = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.PremiumInfo>()
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    //var transactions = policyPeriod.HOTransactions
    var transactions = policyPeriod.AllTransactions
    for (transaction in transactions) {
      var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.PremiumInfo()
      var changeDisplayName = new wsi.schema.una.hpx.hpx_application_request.ChangeDisplayNameDesc()
      //changeDisplayName.setText(transaction.HomeownersCost.ChargePattern)
      if (transaction.Cost != null) {
        changeDisplayName.setText(transaction.Cost.ChargePattern)
        premiumInfo.addChild(changeDisplayName)
        var changeTypeDesc = new wsi.schema.una.hpx.hpx_application_request.ChangeTypeDesc()
        //changeTypeDesc.setText(transaction.HomeownersCost.RateAmountType)
        if (transaction.Cost.RateAmountType != null) {
          changeTypeDesc.setText(transaction.Cost.RateAmountType)
          premiumInfo.addChild(changeTypeDesc)
        }
        var sequence = new wsi.schema.una.hpx.hpx_application_request.SequenceNumber()
        //sequence.setText(transaction.ID)
        if (transaction.Cost.ID != null) {
          sequence.setText(transaction.Cost.ID)
          premiumInfo.addChild(sequence)
        }
        // previous amount
        var previousPremiumDoubleValue = 0.00
        var previousPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.PreviousPremiumAmt()
        var previousAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
        if (previousPeriod != null) {
          var previousMonetaryAmt = previousPeriod.AllTransactions.firstWhere( \ elt -> elt.Cost.RateAmountType.equals(transaction.Cost.RateAmountType))
          if (previousMonetaryAmt != null) {
            previousPremiumDoubleValue = previousMonetaryAmt.Amount
            previousAmt.setText(previousPremiumDoubleValue)
          }  else {
            previousAmt.setText(0.00)
          }
        } else {
          previousAmt.setText(0.00)
        }
        previousPremiumAmt.addChild(previousAmt)
        premiumInfo.addChild(previousPremiumAmt)
        // premium amount
        if (transaction.Amount != null) {
          var premiumAmt = new wsi.schema.una.hpx.hpx_application_request.PremiumAmt()
          var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
          amt.setText(transaction.Amount.Amount)
          premiumAmt.addChild(amt)
          premiumInfo.addChild(premiumAmt)
        }
        if (transaction.Cost.Proration != null) {
          var prorateFactor = new wsi.schema.una.hpx.hpx_application_request.ProRateFactor()
          //prorateFactor.setText(transaction.HomeownersCost.Proration)
          prorateFactor.setText(transaction.Cost.Proration)
          premiumInfo.addChild(prorateFactor)
        }
        var amountDifference = transaction.Amount.Amount - previousPremiumDoubleValue
        if (amountDifference != null) {
          if (amountDifference >= 0) {
            var additionalPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.AdditionalPremiumAmt()
            var additionalAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
            additionalAmt.setText(amountDifference)
            additionalPremiumAmt.addChild(additionalAmt)
            premiumInfo.addChild(additionalPremiumAmt)
          } else {
            var returnPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.AdditionalPremiumAmt()
            var returnAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
            returnAmt.setText(amountDifference)
            returnPremiumAmt.addChild(returnAmt)
            premiumInfo.addChild(returnPremiumAmt)
          }
        }
        if (transaction.Cost.NameOfCoverable != null) {
          var riskDesc = new wsi.schema.una.hpx.hpx_application_request.RiskDesc()
          riskDesc.setText(transaction.Cost.NameOfCoverable)
          premiumInfo.addChild(riskDesc)
        }
        premiumInfos.add(premiumInfo)
      }
    }
    return premiumInfos
  }

  function createEndorsementPremiumInfo(policyPeriod: PolicyPeriod): wsi.schema.una.hpx.hpx_application_request.EndorsementInfo {
    var endorsementInfo = new wsi.schema.una.hpx.hpx_application_request.EndorsementInfo()
    var prorateFactor = new wsi.schema.una.hpx.hpx_application_request.ProRateFactor()
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    prorateFactor.setText(1.0)
    //setText(policyPeriod.Cancellation.calculateRefundCalcMethod(policyPeriod))
    // policyPeriod.Cancellation.
    endorsementInfo.addChild(prorateFactor)
    var newPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.NewPremiumAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    if (policyPeriod.TotalPremiumRPT.Amount != null) {
      amt.setText(policyPeriod.TotalPremiumRPT.Amount)
      newPremiumAmt.addChild(amt)
      endorsementInfo.addChild(newPremiumAmt)
    }
    // any previous period premiums
    var previousPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.PreviousPremiumAmt()
    var previousAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    if (previousPeriod != null) {
      var previousPremiumMonetaryAmt = previousPeriod.TotalPremiumRPT
      if (previousPremiumMonetaryAmt != null) {
        previousAmt.setText(previousPremiumMonetaryAmt.Amount)
        previousPremiumAmt.addChild(previousAmt)
        endorsementInfo.addChild(previousPremiumAmt)
      } else {
        previousAmt.setText(0.00)
        previousPremiumAmt.addChild(previousAmt)
        endorsementInfo.addChild(previousPremiumAmt)
      }
    } else {
      previousAmt.setText(0.00)
      previousPremiumAmt.addChild(previousAmt)
      endorsementInfo.addChild(previousPremiumAmt)
    }
    var currentPremiumAmount = 0.00
    if(policyPeriod.TotalPremiumRPT != null) {
      currentPremiumAmount = policyPeriod.TotalPremiumRPT.Amount
    }
    // change in total premiums
    var premiumDifference = currentPremiumAmount - previousPremiumAmt.Amt.doubleValue()
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

    var premiumChanges = createTransactionPremiumInfo(policyPeriod)
    for (premiumChange in premiumChanges) {
      endorsementInfo.addChild(premiumChange)
    }
    return endorsementInfo
  }
}