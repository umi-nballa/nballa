package una.integration.mapping.hpx
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/17/16
 * Time: 9:41 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXPriorPolicyMapper {
  function createPriorPoliclies(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.OtherOrPriorPolicy> {
    var priorPolicies = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.OtherOrPriorPolicy>()
    var priorPols = policyPeriod.Policy.PriorPolicies
    for (priorPol in priorPols) {
      var otherOrPriorPolicy = new wsi.schema.una.hpx.hpx_application_request.OtherOrPriorPolicy()
      var contractTerm = new wsi.schema.una.hpx.hpx_application_request.ContractTerm()
      if (priorPol.Carrier != null) {
        var nameInfo = new wsi.schema.una.hpx.hpx_application_request.NameInfo()
        var commlName = new wsi.schema.una.hpx.hpx_application_request.CommlName()
        var commercialName = new wsi.schema.una.hpx.hpx_application_request.CommercialName()
        commercialName.setText(priorPol.Carrier)
        commlName.addChild(commercialName)
        nameInfo.addChild(commlName)
        otherOrPriorPolicy.addChild(nameInfo)
      }
      if (priorPol.PolicyNumber != null) {
        var policyNumber = new wsi.schema.una.hpx.hpx_application_request.PolicyNumber()
        policyNumber.setText(priorPol.PolicyNumber)
        otherOrPriorPolicy.addChild(policyNumber)
      }
      if (priorPol.EffectiveDate != null) {
        var effectiveDate = new wsi.schema.una.hpx.hpx_application_request.EffectiveDt()
        effectiveDate.setText(priorPol.EffectiveDate)
        otherOrPriorPolicy.addChild(effectiveDate)
      }
      if (priorPol.ExpirationDate != null) {
        var expriationDate = new wsi.schema.una.hpx.hpx_application_request.ExpirationDt()
        expriationDate.setText(priorPol.ExpirationDate)
        otherOrPriorPolicy.addChild(expriationDate)
      }
      if (priorPol.TotalPremium_amt != null) {
        var policyAmt = new wsi.schema.una.hpx.hpx_application_request.PolicyAmt()
        var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
        amt.setText(priorPol.TotalPremium_amt)
        policyAmt.addChild(amt)
        otherOrPriorPolicy.addChild(policyAmt)
      }
      if (priorPol.NumLosses != null) {
        var numLosses = new wsi.schema.una.hpx.hpx_application_request.NumLosses()
        numLosses.setText(priorPol.NumLosses)
        otherOrPriorPolicy.addChild(numLosses)
      }
      if (priorPol.TotalLosses_amt != null) {
        var totalPaidLossesAmt = new wsi.schema.una.hpx.hpx_application_request.TotalPaidLossesAmt()
        var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
        amt.setText(priorPol.TotalLosses_amt)
        totalPaidLossesAmt.addChild(amt)
        otherOrPriorPolicy.addChild(totalPaidLossesAmt)
      }
      priorPolicies.add(otherOrPriorPolicy)
    }
    return priorPolicies
  }
}