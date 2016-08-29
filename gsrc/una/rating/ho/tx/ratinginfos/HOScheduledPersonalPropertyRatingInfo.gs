package una.rating.ho.tx.ratinginfos
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
    if(scheduleType.Description.startsWith("Silverware")){
      _itemType = "Silverware"
    } else{
      var scheduleTypeDescription = scheduleType.Description.split("-")
      _itemType = scheduleTypeDescription[0].trim()
      if(scheduleTypeDescription.length > 1)
        _usage = scheduleTypeDescription.last().trim()
    }

  }
}