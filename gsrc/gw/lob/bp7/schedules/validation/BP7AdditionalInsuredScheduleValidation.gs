package gw.lob.bp7.schedules.validation

uses gw.validation.PCValidationResult
uses gw.api.productmodel.Schedule
uses java.util.HashSet

class BP7AdditionalInsuredScheduleValidation implements BP7SpecificScheduleValidation {
  private var _schedule : Schedule
  private var _result : PCValidationResult

  construct(schedule : Schedule, result : PCValidationResult) {
    _schedule = schedule
    _result = result
  }

  override function validate() {
    additionalInsuredAndTypeUnique()
    atLeastOneAdditionalInsured()
  }

  private function additionalInsuredAndTypeUnique() {

    var addlInsureds = _schedule.ScheduledItems*.getAdditionalInsuredColumn()*.PolicyAddlInsured

    var seen : HashSet<PolicyAddlInsured> = {}
    for(var addlIns in addlInsureds) {
      if(seen.contains(addlIns)) {
        _result.addError(_schedule as KeyableBean, "default", displaykey.Web.Policy.BP7.Validation.AdditionalInsuredUnique(addlIns, _schedule), "BP7")
      } else {
        seen.add(addlIns)
      }
    }
  }

  private function atLeastOneAdditionalInsured() {
    if(_schedule.ScheduledItems.IsEmpty) {
      _result.addError(_schedule as KeyableBean, "default", displaykey.Web.Policy.BP7.Validation.AdditionalInsuredMustContainAtLeastOneItem(_schedule), "BP7")
    }
  }

}