package una.pageprocess.coverages
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 12/7/16
 * Time: 12:34 PM
    note:: ho extension did not set up schedules like BP7.  They are just normal coverages with scheduled items that are not coverables.
    per Anil, PC data is denormalized when mapped to CC, so CC doesn't actually care if a scheduled item is a coverable underneath a coverage or not
    Also, schedule entities were set up for HO Line using a different ScheduledItem  entity.  In able to use one list for scheduled items whether they
    belong to an HOLine cov or Dwelling cov, I've wrapped them into a single POGO called ScheduledAdditionalInsured
 */
class ScheduledAdditionalInsured {
  var _schedule : Coverage
  var lineScheduledItem : HOscheduleItem_HOE_Ext
  var dwellingScheduledItem : ScheduledItem_HOE

  construct(schedule : Coverage, item : Object){
    _schedule = schedule

    if(_schedule typeis DwellingCov_HOE){
      dwellingScheduledItem = item as ScheduledItem_HOE
    }else if(_schedule typeis HomeownersLineCov_HOE){
      lineScheduledItem = item as HOscheduleItem_HOE_Ext
    }
  }

  public property get AdditionalInsured() : PolicyAddlInsured{
    var result : PolicyAddlInsured

    if(IsDwellingCov){
      result = dwellingScheduledItem.AdditionalInsured.PolicyAddlInsured
    }else if(IsHOLineCov){
      result = lineScheduledItem.AdditionalInsured.PolicyAddlInsured
    }

    return result
  }

  public property get AdditionalInsuredName() : String{
    return AdditionalInsured.DisplayName
  }

  public property get AdditionalInsuredAddress() : String{
    return AdditionalInsured.AccountContactRole.AccountContact.Contact.PrimaryAddressDisplayValue
  }

  public property get Interest() : String{
    var result : String

    if(IsDwellingCov){
      result = dwellingScheduledItem.Interest
    }else if(IsHOLineCov){
      result = lineScheduledItem.Interest
    }

    return result
  }

  public property set Interest(interest : String){
    if(IsDwellingCov){
      dwellingScheduledItem.Interest = interest
    }else if(IsHOLineCov){
      lineScheduledItem.Interest = interest
    }
  }

  public property get ItemNumber() : int{
    var result : int

    if(IsDwellingCov){
      result = dwellingScheduledItem.ItemNumber
    }else if(IsHOLineCov){
      result = lineScheduledItem.ItemNum
    }

    return result
  }

  public property get IsSectionIPropertyCov() : Boolean{
    var result : Boolean

    if(IsDwellingCov){
      result = dwellingScheduledItem.IsSectionIPropertyCoverage
    }

    return result
  }

  public property set IsSectionIPropertyCov(value : Boolean){
    if(IsDwellingCov){
      dwellingScheduledItem.IsSectionIPropertyCoverage = value
    }
  }

  public property get IsSectionIILiabilityCov() : typekey.HOSchedAddlInsOccType{
    var result : typekey.HOSchedAddlInsOccType

    if(IsDwellingCov){
      result = dwellingScheduledItem.SectionIILiabilityOccType
    }

    return result
  }

  public property set IsSectionIILiabilityCov(value : typekey.HOSchedAddlInsOccType){
    if(IsDwellingCov){
      dwellingScheduledItem.SectionIILiabilityOccType = value
    }
  }

  private property get IsDwellingCov() : Boolean{
    return _schedule typeis DwellingCov_HOE
  }

  private property get IsHOLineCov() : boolean{
    return _schedule typeis HomeownersLineCov_HOE
  }
}