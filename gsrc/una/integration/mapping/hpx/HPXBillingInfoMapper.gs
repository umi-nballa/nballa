package una.integration.mapping.hpx
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/10/16
 * Time: 9:39 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXBillingInfoMapper {

  function createBillingInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.BillingInfo {
    var billingInfo = new wsi.schema.una.hpx.hpx_application_request.BillingInfo()
    var invoiceNumber = new wsi.schema.una.hpx.hpx_application_request.InvoiceNumber()
    var billingSummaryPlugin = gw.plugin.Plugins.get( gw.plugin.billing.IBillingSummaryPlugin )
    var billingSummary = billingSummaryPlugin.retrievePolicyBillingSummary(policyPeriod.PolicyNumber, policyPeriod.PolicyTerm.MostRecentTerm)
    var sortedInvoices = billingSummary.Invoices.sort( \ elt1, elt2 -> elt1.InvoiceDueDate.before(elt2.InvoiceDueDate))
    var firstUnpaidInvoice = sortedInvoices.firstWhere( \ elt -> elt.Unpaid.Amount > 0)
    var invoiceNum = firstUnpaidInvoice.InvoiceNumber
    if(invoiceNum != null) {
      invoiceNumber.setText(invoiceNum)
      billingInfo.addChild(invoiceNumber)
    }
    var accountBillingPolicies = billingSummaryPlugin.retrieveBillingPolicies(policyPeriod.BillingAccountNumber)
    var billingPeriod = new wsi.schema.una.hpx.hpx_application_request.BillingPeriod()
    var effectiveDate = new wsi.schema.una.hpx.hpx_application_request.EffectiveDt()
    effectiveDate.setText(accountBillingPolicies.last().EffectiveDate)
    billingPeriod.addChild(effectiveDate)
    var expiryDate = new wsi.schema.una.hpx.hpx_application_request.ExpirationDt()
    expiryDate.setText(accountBillingPolicies.last().ExpirationDate)
    billingPeriod.addChild(expiryDate)
    billingInfo.addChild(billingPeriod)
    var balanceInfo = new wsi.schema.una.hpx.hpx_application_request.BalanceInfo()
    // paid
    var totalPaidAmt = new wsi.schema.una.hpx.hpx_application_request.TotalPaidAmt()
    var paidAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    paidAmt.setText(billingSummary.Paid.Amount)
    totalPaidAmt.addChild(paidAmt)
    balanceInfo.addChild(totalPaidAmt)
    // billed amount
    var previousBilledAmt = new wsi.schema.una.hpx.hpx_application_request.PreviousBilledAmt()
    var billedAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    billedAmt.setText(billingSummary.TotalBilled.Amount)
    previousBilledAmt.addChild(billedAmt)
    balanceInfo.addChild(previousBilledAmt)
    // total due
    var totalDue = new wsi.schema.una.hpx.hpx_application_request.TotalDueAmt()
    var dueAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    dueAmt.setText(billingSummary.CurrentOutstanding.Amount)
    totalDue.addChild(dueAmt)
    balanceInfo.addChild(totalDue)
    // num payments
    var numPayments = new wsi.schema.una.hpx.hpx_application_request.NumPayments()
    numPayments.setText(billingSummary.Invoices.Count)
    balanceInfo.addChild(numPayments)
    billingInfo.addChild(balanceInfo)
    return billingInfo
  }

  function createBillingMethodInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.PolicyInfo {
    var policyInfo = new wsi.schema.una.hpx.hpx_application_request.PolicyInfo()
    var billingSummaryPlugin = gw.plugin.Plugins.get( gw.plugin.billing.IBillingSummaryPlugin )
    var billingSummary = billingSummaryPlugin.retrievePolicyBillingSummary(policyPeriod.PolicyNumber, policyPeriod.PolicyTerm.MostRecentTerm)
    var billingMethodCd = new wsi.schema.una.hpx.hpx_application_request.BillingMethodCd()
    switch (billingSummary.BillingMethod) {
      case typekey.BillingMethod.TC_DIRECTBILL :
          billingMethodCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.BillingMethod.DB)
          break
      case typekey.BillingMethod.TC_LISTBILL :
          billingMethodCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.BillingMethod.LB)
          break
      case typekey.BillingMethod.TC_AGENCYBILL :
          billingMethodCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.BillingMethod.AB)
          break
    }
    policyInfo.addChild(billingMethodCd)
    var billingMethodDesc = new wsi.schema.una.hpx.hpx_application_request.BillingMethodDesc()
    billingMethodDesc.setText(billingSummary.BillingMethod.Description)
    policyInfo.addChild(billingMethodDesc)
    return policyInfo
  }
}