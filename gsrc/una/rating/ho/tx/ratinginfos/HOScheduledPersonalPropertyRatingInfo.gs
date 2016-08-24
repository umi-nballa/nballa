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
    var scheduleType = item.ScheduleType.Description.split("-")
    _itemType = scheduleType[0].trim()
    if(scheduleType.length > 1)
      _usage = scheduleType.last().trim()
  }
}