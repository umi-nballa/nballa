package edge.capabilities.quote.binding

uses edge.di.annotations.ForAllGwNodes
uses edge.capabilities.address.IAddressPlugin
uses edge.capabilities.quote.binding.dto.BindingDataDTO
uses java.lang.IllegalArgumentException

/**
 * Created with IntelliJ IDEA.
 * User: tvang
 * Date: 8/7/17
 * Time: 11:04 AM
 * To change this template use File | Settings | File Templates.
 */
class UNABindingPlugin extends DefaultBindingPlugin{
  private var _paymentPlugin : IPolicyPaymentPlugin
  private var _paymentPlanPlugin : IPaymentPlanPlugin
  private var _addressPlugin : IAddressPlugin

  @ForAllGwNodes
  @Param("paymentPlugin", "Policy payment processing plugin. It is invoked during bind phase inside binding bundle.")
  @Param("paymentPlanPlugin", "Plugin used to deal with payment plan selection and conversion.")
  construct(paymentPlugin : IPolicyPaymentPlugin, paymentPlanPlugin : IPaymentPlanPlugin, addressPlugin:IAddressPlugin) {
    super(paymentPlugin, paymentPlanPlugin, addressPlugin)
    _paymentPlugin = paymentPlugin
    _paymentPlanPlugin = paymentPlanPlugin
    _addressPlugin = addressPlugin
  }

  override function preBind(submission : Submission, data : BindingDataDTO){
    if (data.ChosenQuote == null) {
      throw new IllegalArgumentException("Missing quote id")
    }

    _paymentPlanPlugin.selectPaymentPlan(submission.SelectedVersion, data.SelectedPaymentPlan)
    submission.SelectedVersion.BillingMethod = BillingMethod.TC_DIRECTBILL
  }

  override function bind(submission : Submission, data : BindingDataDTO) {
    _paymentPlugin.pay (
        submission,
            submission.SelectedVersion,
            data.PaymentDetails)
    submission.SelectedVersion.SubmissionProcess.bindOnly()
  }
}