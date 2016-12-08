package una.pageprocess.coverages

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 12/6/16
 * Time: 7:52 PM
 *
   note:: ho extension did not set up schedules like BP7.  They are just normal coverages with scheduled items that are not coverables.
   per Anil, PC data is denormalized when mapped to CC, so CC doesn't actually care if a scheduled item is a coverable underneath a coverage or not
   Also, schedule entities were set up for HO Line using a different ScheduledItem  entity.  In able to use one list for scheduled items whether they
   belong to an HOLine cov or Dwelling cov, I've wrapped them into a single POGO called ScheduledAdditionalInsured
 */
class HOScheduledAdditionalInsuredPCFController {
  private var _schedule : Coverage

  construct(schedule : Coverage){
    _schedule = schedule
  }

  /**
  *  returns additional insureds not yet added to the schedule
  */
  property get ExistingAdditionalInsureds() : AccountContactView[]{
    var results : AccountContactView[]

    if(_schedule typeis DwellingCov_HOE){
      results = _schedule.OwningCoverable.PolicyLine.ExistingAdditionalInsureds
               .where( \ ai -> !_schedule.ScheduledItems.hasMatch( \ scheduledItem -> scheduledItem.AdditionalInsured.PolicyAddlInsured.ContactDenorm == ai.Contact))
               .asViews()
    }else if(_schedule typeis HomeownersLineCov_HOE){
      results = _schedule.OwningCoverable.PolicyLine.ExistingAdditionalInsureds
                .where( \ ai -> !_schedule.scheduledItem_Ext.hasMatch( \ scheduledItem -> scheduledItem.AdditionalInsured.PolicyAddlInsured.ContactDenorm == ai.Contact))
                .asViews()
    }

    return results
  }

  public function addScheduledAdditionalInsured(additionalInsured : PolicyAddlInsuredDetail) : ScheduledAdditionalInsured {
    var result : ScheduledAdditionalInsured
    var scheduledItem : KeyableBean

    if(_schedule typeis DwellingCov_HOE){
      scheduledItem = _schedule.addScheduledAdditionalInsured(additionalInsured)
    }else if(_schedule typeis HomeownersLineCov_HOE){
      scheduledItem = _schedule.addScheduledAdditionalInsured(additionalInsured)
    }

    result = new ScheduledAdditionalInsured (_schedule, scheduledItem)

    ScheduledItems.add(result)

    return result
  }

  public function removeScheduledAdditionalInsured(scheduledItem : ScheduledAdditionalInsured){
    if(_schedule typeis DwellingCov_HOE){
      _schedule.ScheduledItems.atMostOneWhere( \ item -> item.AdditionalInsured.PolicyAddlInsured == scheduledItem.AdditionalInsured).remove()
    }else if(_schedule typeis HomeownersLineCov_HOE){
      _schedule.scheduledItem_Ext.atMostOneWhere( \ item -> item.AdditionalInsured.PolicyAddlInsured == scheduledItem.AdditionalInsured).remove()
    }

    ScheduledItems.remove(scheduledItem)
  }

  property get ScheduledItems() : List< ScheduledAdditionalInsured >{
    var results : List< ScheduledAdditionalInsured > = {}

    if(_schedule typeis DwellingCov_HOE){
      _schedule.ScheduledItems.each( \ item -> {
        results.add(new ScheduledAdditionalInsured (_schedule, item))
      })
    }else if(_schedule typeis HomeownersLineCov_HOE){
      _schedule.scheduledItem_Ext.each( \ item -> {
        results.add(new ScheduledAdditionalInsured (_schedule, item))
      })
    }

    return results
  }

  public function validateSchedule() : String{
    var result : String
    var showException : boolean

    if(_schedule typeis DwellingCov_HOE){
      showException = _schedule.ScheduledItems.IsEmpty
    }else if(_schedule typeis HomeownersLineCov_HOE){
      showException = _schedule.scheduledItem_Ext.IsEmpty
    }

    if(showException){
      result = displaykey.una.coverages.validation.ScheduledItems("Additional Insured", _schedule.DisplayName)
    }

    return result
  }

  public function isInterestFieldAvailable() : boolean{
    return _schedule.PatternCode != "HOLI_AdditionalInsuredSchedPropertyManager"
  }

  public function isSectionFieldAvailable() : boolean {
    return _schedule.PatternCode == "HODW_AdditionalInsuredSchedProp"
  }
}