package una.integration.mapping.hpx.common

uses gw.xml.date.XmlDate
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
      otherOrPriorPolicy.OriginalInceptionDt = new XmlDate(priorPol.EffectiveDate)
      otherOrPriorPolicy.CancelDeclineDt = new XmlDate(priorPol.ExpirationDate)
      otherOrPriorPolicy.PolicyAmt.Amt = priorPol.TotalPremium_amt != null ? priorPol.TotalPremium_amt : 0.00
      otherOrPriorPolicy.NumLosses = priorPol.NumLosses != null ? priorPol.NumLosses : 0
      otherOrPriorPolicy.TotalPaidLossesAmt.Amt = priorPol.TotalLosses_amt != null ? priorPol.TotalLosses_amt : 0.00
      priorPolicies.add(otherOrPriorPolicy)
    }
    return priorPolicies
  }
}