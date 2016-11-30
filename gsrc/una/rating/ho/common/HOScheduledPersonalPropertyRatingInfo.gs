package una.rating.ho.common

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/23/16
 * Time: 3:11 PM
 */
class HOScheduledPersonalPropertyRatingInfo {

  var _itemType: typekey.ScheduleType_HOE as ItemType
  var _exposureValue: int as ExposureValue


  construct(item: ScheduledItem_HOE) {
    _exposureValue = item.ExposureValue
    _itemType = item.ScheduleType
  }
}