package gw.lob.bp7.schedules.validation

uses gw.validation.PCValidationResult
uses gw.api.productmodel.Schedule
uses java.util.HashSet

/**
 * Created with IntelliJ IDEA.
 * User: TManickam
 * Date: 1/6/17
 * Time: 12:27 PM
 * To change this template use File | Settings | File Templates.
 */
class BP7AdditionalInterestScheduleValidation implements BP7SpecificScheduleValidation {
  private var _schedule : Schedule
  private var _result : PCValidationResult

  construct(schedule : Schedule, result : PCValidationResult) {
    _schedule = schedule
    _result = result
  }

  override function validate() {
    additionalInterestAndTypeUnique()
    atLeastOneAdditionalInterest()
  }

  private function additionalInterestAndTypeUnique() {

    var addlInterests = _schedule.ScheduledItems*.getAdditionalInterestColumn()*.PolicyAddlInterest

    var seen : HashSet<PolicyAddlInterest> = {}
    for(var addlInt in addlInterests) {
      if(seen.contains(addlInt)) {
        _result.addError(_schedule as KeyableBean, "default", displaykey.Web.Policy.BP7.Validation.AdditionalInterestUnique(addlInt, _schedule), "BP7")
      } else {
        seen.add(addlInt)
      }
    }
  }

  private function atLeastOneAdditionalInterest() {
    if(_schedule.ScheduledItems.IsEmpty) {
      print("Inside _schedule.ScheduledItems.IsEmpty")
      _result.addError(_schedule as KeyableBean, "default", displaykey.Web.Policy.BP7.Validation.AdditionalInterestMustContainAtLeastOneItem(_schedule), "BP7")
    }
  }
}