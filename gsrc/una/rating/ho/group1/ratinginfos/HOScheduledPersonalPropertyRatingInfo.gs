package una.rating.ho.group1.ratinginfos
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/23/16
 * Time: 3:11 PM
 */
class HOScheduledPersonalPropertyRatingInfo {

  var _itemType : String as ItemType
  var _exposureValue : int as ExposureValue
  var _usage : String as Usage = ""

  construct(item : ScheduledItem_HOE){

    _exposureValue = item.ExposureValue
    var scheduleType = item.ScheduleType
    var scheduleTypeDescription = scheduleType.Description.split("-")
    if(scheduleType.Description.startsWith("Fine")){
      _itemType = scheduleTypeDescription[0].trim() + " - " + scheduleTypeDescription[1].trim()
      _usage = scheduleTypeDescription.last().trim()
    } else{
      _itemType = scheduleTypeDescription[0].trim()
      if(scheduleTypeDescription.length > 1)
        _usage = scheduleTypeDescription.last().trim()
    }

  }
}