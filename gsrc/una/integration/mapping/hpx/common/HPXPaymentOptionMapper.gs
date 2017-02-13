package una.integration.mapping.hpx.common

uses java.lang.Throwable
uses gw.web.policy.BillingAdjustmentsUIHelper

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
    var paymntOptions = policyPeriod.retrievePaymentPlans()    //retrievePaymentPlansWithoutSettingBillingAmounts()
    var installmentOptions = paymntOptions.InstallmentPlans
    for (installmentOption in installmentOptions) {
      var paymentOption = new wsi.schema.una.hpx.hpx_application_request.types.complex.PaymentOptionType()
      paymentOption.InstallmentInfo.InstallmentDesc = installmentOption.Name
      var numberOfInstallments = 0
      if (!installmentOption.Name.equals("Annual")) {
        numberOfInstallments = installmentOption.Name.substring(0,2)
      }
      paymentOption.InstallmentInfo.InstallmentNumber = numberOfInstallments
      paymentOption.InstallmentInfo.InstallmentDownPaymentAmt.Amt = installmentOption.DownPayment
      paymentOption.InstallmentInfo.InstallmentAmt.Amt = installmentOption.Installment
      var fee = installmentOption.Notes != null and installmentOption.Notes.contains("Installment Fee:") ? installmentOption.Notes.substring(17) : 0
      paymentOption.InstallmentFeeAmt.Amt = fee
      paymentOptions.add(paymentOption)
    }
    return paymentOptions
  }
}