package una.integration.mapping.hpx.common

uses gw.xml.XmlElement
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/10/16
 * Time: 9:39 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXBillingInfoMapper {

  function createBillingInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.BillingInfoType {
    var billingInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.BillingInfoType()
    var billingSummaryPlugin = gw.plugin.Plugins.get( gw.plugin.billing.IBillingSummaryPlugin )
    var billingSummary = billingSummaryPlugin.retrievePolicyBillingSummary(policyPeriod.PolicyNumber, policyPeriod.PolicyTerm.MostRecentTerm)
    var sortedInvoices = billingSummary.Invoices.sort( \ elt1, elt2 -> elt1.InvoiceDueDate.before(elt2.InvoiceDueDate))
    var firstUnpaidInvoice = sortedInvoices.firstWhere( \ elt -> elt.Unpaid.Amount > 0)
    var invoiceNum = firstUnpaidInvoice.InvoiceNumber
    billingInfo.InvoiceNumber = invoiceNum != null ? invoiceNum : ""
    var accountBillingPolicies = billingSummaryPlugin.retrieveBillingPolicies(policyPeriod.BillingAccountNumber)
    billingInfo.BillingPeriod.EffectiveDt.Day = accountBillingPolicies.last().EffectiveDate.DayOfMonth
    billingInfo.BillingPeriod.EffectiveDt.Month = accountBillingPolicies.last().EffectiveDate.MonthOfYear
    billingInfo.BillingPeriod.EffectiveDt.Year = accountBillingPolicies.last().EffectiveDate.YearOfDate
    billingInfo.BillingPeriod.ExpirationDt.Day = accountBillingPolicies.last().ExpirationDate.DayOfMonth
    billingInfo.BillingPeriod.ExpirationDt.Month = accountBillingPolicies.last().ExpirationDate.MonthOfYear
    billingInfo.BillingPeriod.ExpirationDt.Year = accountBillingPolicies.last().ExpirationDate.YearOfDate
    billingInfo.BalanceInfo.TotalPaidAmt.Amt = billingSummary.Paid.Amount != null ? billingSummary.Paid.Amount : 0.00   // paid
    billingInfo.BalanceInfo.PreviousBilledAmt.Amt = billingSummary.TotalBilled.Amount != null ? billingSummary.TotalBilled.Amount : 0.00  // billed amount
    billingInfo.BalanceInfo.TotalDueAmt.Amt = billingSummary.CurrentOutstanding.Amount != null ? billingSummary.CurrentOutstanding.Amount : 0.00  // total due
    billingInfo.BalanceInfo.NumPayments = billingSummary.Invoices.Count != null ? billingSummary.Invoices.Count : 0  // num payments
    return billingInfo
  }

  function createBillingMethodInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyInfoType {
    var policyInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyInfoType()
    var billingSummaryPlugin = gw.plugin.Plugins.get( gw.plugin.billing.IBillingSummaryPlugin )
    var billingSummary = billingSummaryPlugin.retrievePolicyBillingSummary(policyPeriod.PolicyNumber, policyPeriod.PolicyTerm.MostRecentTerm)
    policyInfo.BillingMethodCd = billingSummary.BillingMethod
    policyInfo.BillingMethodDesc = billingSummary.BillingMethod.Description
    return policyInfo
  }
}