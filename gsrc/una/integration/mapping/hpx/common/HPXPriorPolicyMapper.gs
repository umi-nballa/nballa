package una.integration.mapping.hpx.common
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/17/16
 * Time: 9:41 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXPriorPolicyMapper {
  function createPriorPolicies(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.OtherOrPriorPolicyType> {
    var priorPolicies = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.OtherOrPriorPolicyType>()
    var priorPols = policyPeriod.Policy.PriorPolicies
    for (priorPol in priorPols) {
      var otherOrPriorPolicy = new wsi.schema.una.hpx.hpx_application_request.types.complex.OtherOrPriorPolicyType()
      otherOrPriorPolicy.NameInfo.CommlName.CommercialName = priorPol.Carrier != null ? priorPol.Carrier : ""
      otherOrPriorPolicy.PolicyNumber = priorPol.PolicyNumber != null ? priorPol.PolicyNumber : ""
      if (priorPol.EffectiveDate != null) {
        otherOrPriorPolicy.OriginalInceptionDt.Day = priorPol.EffectiveDate.DayOfMonth
        otherOrPriorPolicy.OriginalInceptionDt.Month = priorPol.EffectiveDate.MonthOfYear
        otherOrPriorPolicy.OriginalInceptionDt.Year = priorPol.EffectiveDate.YearOfDate
      }
      if (priorPol.ExpirationDate != null) {
        otherOrPriorPolicy.CancelDeclineDt.Day = priorPol.ExpirationDate.DayOfMonth
        otherOrPriorPolicy.CancelDeclineDt.Month = priorPol.ExpirationDate.MonthOfYear
        otherOrPriorPolicy.CancelDeclineDt.Year = priorPol.ExpirationDate.YearOfDate
      }

      otherOrPriorPolicy.PolicyAmt.Amt = priorPol.TotalPremium_amt != null ? priorPol.TotalPremium_amt : 0.00
      otherOrPriorPolicy.NumLosses = priorPol.NumLosses != null ? priorPol.NumLosses : 0
      otherOrPriorPolicy.TotalPaidLossesAmt.Amt = priorPol.TotalLosses_amt != null ? priorPol.TotalLosses_amt : 0.00
      priorPolicies.add(otherOrPriorPolicy)
    }
    return priorPolicies
  }
}