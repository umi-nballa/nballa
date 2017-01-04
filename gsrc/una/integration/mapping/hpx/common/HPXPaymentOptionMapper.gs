package una.integration.mapping.hpx.common

uses java.lang.Throwable
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/10/16
 * Time: 4:50 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXPaymentOptionMapper {

  function createPaymentOptions(policyPeriod : PolicyPeriod) : java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.PaymentOptionType> {
    var paymentOptions = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.PaymentOptionType>()
    try {
      var billingSummaryPlugin = gw.plugin.Plugins.get( gw.plugin.billing.IBillingSummaryPlugin )
      var billingSummary = billingSummaryPlugin.retrievePolicyBillingSummary(policyPeriod.PolicyNumber, policyPeriod.PolicyTerm.MostRecentTerm)
      var sortedInvoices = billingSummary.Invoices.sort( \ elt1, elt2 -> elt1.InvoiceDueDate.before(elt2.InvoiceDueDate))
      for (invoice in sortedInvoices) {
        var paymentOption = new wsi.schema.una.hpx.hpx_application_request.types.complex.PaymentOptionType()
        paymentOption.InstallmentInfo.InstallmentDesc = billingSummary.PaymentPlanName
        paymentOption.InstallmentInfo.InstallmentDownPaymentAmt.Amt = sortedInvoices.first().Amount.Amount
        paymentOption.InstallmentInfo.InstallmentAmt.Amt = invoice.Amount.Amount
        paymentOption.InstallmentInfo.InstallmentTotalAmt.Amt = billingSummary.TotalCharges.Amount
        paymentOptions.add(paymentOption)
      }
    } catch (e : Throwable) {}
    return paymentOptions
  }
}