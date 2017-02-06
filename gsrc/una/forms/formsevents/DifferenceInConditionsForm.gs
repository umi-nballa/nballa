package una.forms.formsevents
/**
 * Created with IntelliJ IDEA.
 * User: akhovyev
 * Date: 1/26/17
 * Time: 10:26 AM
 * To change this template use File | Settings | File Templates.
 */
class DifferenceInConditionsForm extends EventTriggeredAvailability {

  override property get CustomEventType(): FormsEventType {
    return tc_SendDifferenceInConditions
  }
}