package una.forms.formsevents
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 1/30/17
 * Time: 1:49 PM
 * To change this template use File | Settings | File Templates.
 */
class AlarmDiscountRemovalLetter extends EventTriggeredAvailability {
  override property get CustomEventType(): FormsEventType {
    return TC_SendAlarmCreditRemovalLetter
  }
}