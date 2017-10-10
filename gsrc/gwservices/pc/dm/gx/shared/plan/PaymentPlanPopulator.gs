package gwservices.pc.dm.gx.shared.plan

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_SelectedPaymentPlan

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 9/19/17
 * Time: 4:25 PM
 * To change this template use File | Settings | File Templates.
 */
class PaymentPlanPopulator extends BaseEntityPopulator<PaymentPlanSummary, PolicyPeriod> {

  override function create(model: XmlElement, parent: PolicyPeriod, bundle: Bundle): PaymentPlanSummary {
    if (model typeis PolicyPeriod_SelectedPaymentPlan) {
      var paymentPlanSummary = new PaymentPlanSummary()
      paymentPlanSummary.BillingId = model.BillingId
      paymentPlanSummary.InvoiceFrequency = typekey.BillingPeriodicity.get(model.InvoiceFrequency)
      paymentPlanSummary.addAllowedPaymentMethods(model.AllowedPaymentMethods.Entry)
      return paymentPlanSummary
    }
    return null
  }

  override function findEntity(model: XmlElement, parent: PolicyPeriod, bundle: Bundle): PaymentPlanSummary {
    return null
  }


}