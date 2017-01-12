package una.forms.formsevents


/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 1/6/17
 * Time: 2:35 PM
 * To change this template use File | Settings | File Templates.
 */
class NonRenewalForms extends EventTriggeredAvailability {
  override property get CustomEventType(): FormsEventType {
    return TC_SendNonRenewalDocuments
  }
}