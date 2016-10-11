package una.integration.mapping.hpx.common

uses gw.xml.XmlElement


/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/9/16
 * Time: 4:23 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXPremiumMapper {
  function createTransactionPremiumInfo(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType> {
    var premiumInfos = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType>()
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    var transactions = policyPeriod.AllTransactions
    for (transaction in transactions) {
      var premiumInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumInfoType()
      if (transaction.Cost != null) {
        premiumInfo.ChangeDisplayNameDesc = transaction.Cost.ChargePattern
        premiumInfo.ChangeTypeDesc = transaction.Cost.RateAmountType != null ? transaction.Cost.RateAmountType : ""
        premiumInfo.SequenceNumber = transaction.Cost.ID != null ? transaction.Cost.ID.toString().Bytes[0] : ""
        // previous amount
        var previousMonetaryAmt = previousPeriod != null ? previousPeriod.AllTransactions.firstWhere( \ elt -> elt.Cost.RateAmountType.equals(transaction.Cost.RateAmountType)) : null
        var previousPremiumDoubleValue = 0.00
        previousPremiumDoubleValue = previousMonetaryAmt != null ? previousMonetaryAmt.Amount : 0.00
        premiumInfo.PreviousPremiumAmt.Amt = previousPremiumDoubleValue
        // premium amount
        premiumInfo.PremiumAmt.Amt = transaction.Amount != null ? transaction.Amount.Amount : 0.00
        premiumInfo.ProRateFactor = transaction.Cost.Proration != null ? transaction.Cost.Proration : 0
        var amountDifference = transaction.Amount.Amount - previousPremiumDoubleValue
        premiumInfo.AdditionalPremiumAmt.Amt = amountDifference >= 0 ?  amountDifference : 0.00
        premiumInfo.ReturnPremiumAmt.Amt = amountDifference < 0 ? amountDifference : 0.00
        premiumInfo.RiskDesc = transaction.Cost.NameOfCoverable != null ? transaction.Cost.NameOfCoverable : ""
        premiumInfos.add(premiumInfo)
      }
    }
    return premiumInfos
  }

  function createEndorsementPremiumInfo(policyPeriod: PolicyPeriod): wsi.schema.una.hpx.hpx_application_request.types.complex.EndorsementInfoType {
    var endorsementInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.EndorsementInfoType()
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    endorsementInfo.ProRateFactor = 1.0 // TODO revisit
    endorsementInfo.NewPremiumAmt.Amt = policyPeriod.TotalPremiumRPT.Amount != null ? policyPeriod.TotalPremiumRPT.Amount : 0.00
    // any previous period premiums
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    endorsementInfo.PreviousPremiumAmt.Amt = previousPeriod != null and previousPeriod.TotalPremiumRPT != null ? previousPeriod.TotalPremiumRPT.Amount : 0.00
    var currentPremiumAmount = policyPeriod.TotalPremiumRPT != null ? policyPeriod.TotalPremiumRPT.Amount : 0.00
    // change in total premiums
    var premiumDifference = previousPeriod.TotalPremiumRPT.Amount != null ? currentPremiumAmount - previousPeriod.TotalPremiumRPT.Amount : 0.00
    endorsementInfo.AdditionalPremiumAmt.Amt = premiumDifference >= 0 ? premiumDifference : 0.00
    endorsementInfo.ReturnPremiumAmt.Amt = premiumDifference < 0 ? premiumDifference : 0.00
    endorsementInfo.NetPremiumAmt.Amt = premiumDifference
    var premiumChanges = createTransactionPremiumInfo(policyPeriod)
    for (premiumChange in premiumChanges) {
      endorsementInfo.addChild(new XmlElement("PremiumInfo", premiumChange))
    }
    return endorsementInfo
  }
}