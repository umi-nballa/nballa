package una.forms.formsevents

uses gw.forms.generic.AbstractSimpleAvailabilityForm
uses gw.forms.FormInferenceContext
uses java.util.Set

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 1/6/17
 * Time: 2:38 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class EventTriggeredAvailability extends AbstractSimpleAvailabilityForm{

  override function isAvailable(context: FormInferenceContext, availableStates: Set<Jurisdiction>): boolean{
    var result : boolean

    var formsEvents = context.Period.Job.FormsEvents.where(\ formsEvent -> formsEvent.EventType == CustomEventType)

    if(formsEvents.HasElements){
      result = true
      context.Period.addEvent(CustomEventType.Code)
      formsEvents?.each( \ formsEvent -> formsEvent.remove()) //clear the events to disable accidentally triggering on the next inference event
    }

    return result
  }

  abstract property get CustomEventType() : FormsEventType
}