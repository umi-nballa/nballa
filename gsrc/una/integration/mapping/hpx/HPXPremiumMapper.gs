package una.integration.mapping.hpx
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/9/16
 * Time: 4:23 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXPremiumMapper {
  function createPremiumInfo(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.PremiumInfo> {
    var premiumInfos = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.PremiumInfo>()
    var transactions = policyPeriod.HOTransactions
    for (transaction in transactions) {
      var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.PremiumInfo()
      var changeDisplayName = new wsi.schema.una.hpx.hpx_application_request.ChangeDisplayNameDesc()
      changeDisplayName.setText(transaction.HomeownersCost.ChargePattern)
      premiumInfo.addChild(changeDisplayName)
      var changeTypeDesc = new wsi.schema.una.hpx.hpx_application_request.ChangeTypeDesc()
      changeTypeDesc.setText(transaction.HomeownersCost.RateAmountType)
      premiumInfo.addChild(changeTypeDesc)
      var sequence = new wsi.schema.una.hpx.hpx_application_request.SequenceNumber()
      sequence.setText(transaction.ID)
      premiumInfo.addChild(sequence)
      // previous amount
      var previousPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.PreviousPremiumAmt()
      var previousAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      var previousMonetaryAmt = transaction.getOriginalValue("Amount") as gw.pl.currency.MonetaryAmount
      previousAmt.setText(previousMonetaryAmt.Amount)
      previousPremiumAmt.addChild(previousAmt)
      premiumInfo.addChild(previousPremiumAmt)
      // premium amount
      var premiumAmt = new wsi.schema.una.hpx.hpx_application_request.PremiumAmt()
      var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      amt.setText(transaction.Amount.Amount)
      premiumAmt.addChild(amt)
      premiumInfo.addChild(premiumAmt)
      var prorateFactor = new wsi.schema.una.hpx.hpx_application_request.ProRateFactor()
      prorateFactor.setText(transaction.HomeownersCost.Proration)
      premiumInfo.addChild(prorateFactor)
      var amountDifference = (transaction.Amount - previousMonetaryAmt).Amount
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
      var riskDesc = new wsi.schema.una.hpx.hpx_application_request.RiskDesc()
      riskDesc.setText(transaction.HomeownersCost.NameOfCoverable)
      premiumInfo.addChild(riskDesc)
      premiumInfos.add(premiumInfo)
    }
    return premiumInfos
  }
}