package una.integration.mapping.hpx.common
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/10/16
 * Time: 4:50 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXPaymentOptionMapper {

  function createPaymentOptions(policyPeriod : PolicyPeriod) : java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.PaymentOption> {
    var paymentOptions = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.PaymentOption>()
    var invoiceNumber = new wsi.schema.una.hpx.hpx_application_request.InvoiceNumber()
    var billingSummaryPlugin = gw.plugin.Plugins.get( gw.plugin.billing.IBillingSummaryPlugin )
    var billingSummary = billingSummaryPlugin.retrievePolicyBillingSummary(policyPeriod.PolicyNumber, policyPeriod.PolicyTerm.MostRecentTerm)
    var sortedInvoices = billingSummary.Invoices.sort( \ elt1, elt2 -> elt1.InvoiceDueDate.before(elt2.InvoiceDueDate))
    for (invoice in sortedInvoices) {
      var paymentOption = new wsi.schema.una.hpx.hpx_application_request.PaymentOption()
      var installmentInfo = new wsi.schema.una.hpx.hpx_application_request.InstallmentInfo()
      var installmentDesc = new wsi.schema.una.hpx.hpx_application_request.InstallmentDesc()
      installmentDesc.setText(billingSummary.PaymentPlanName)
      installmentInfo.addChild(installmentDesc)
      var installmentDownpaymentAmount = new wsi.schema.una.hpx.hpx_application_request.InstallmentDownPaymentAmt()
      var downpaymentAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      downpaymentAmt.setText(sortedInvoices.first().Amount.Amount)
      installmentDownpaymentAmount.addChild(downpaymentAmt)
      installmentInfo.addChild(installmentDownpaymentAmount)
      var installmentAmount = new wsi.schema.una.hpx.hpx_application_request.InstallmentAmt()
      var amount = new wsi.schema.una.hpx.hpx_application_request.Amt()
      amount.setText(invoice.Amount.Amount)
      installmentAmount.addChild(amount)
      installmentInfo.addChild(installmentAmount)
      var installmentTotalAmount = new wsi.schema.una.hpx.hpx_application_request.InstallmentTotalAmt()
      var totalAmount = new wsi.schema.una.hpx.hpx_application_request.Amt()
      totalAmount.setText(billingSummary.TotalCharges.Amount)
      installmentTotalAmount.addChild(totalAmount)
      installmentInfo.addChild(installmentTotalAmount)
      paymentOption.addChild(installmentInfo)
      paymentOptions.add(paymentOption)
    }
    return paymentOptions
  }
}