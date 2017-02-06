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

    var formsEvents = context.Period.Job.FormsEvents.where(\ formsEvent -> formsEvent.EventType == CustomEventType
                                                                      and !formsEvent.Processed)

    if(formsEvents.HasElements){
      result = true
      context.Period.addEvent(CustomEventType.Code)  // trigger for event messaging to HPX
      formsEvents?.each( \ formsEvent -> {formsEvent.Processed = true}) //marking to true disables from accidentally processing twice
    }

    return result
  }

  abstract property get CustomEventType() : FormsEventType
}