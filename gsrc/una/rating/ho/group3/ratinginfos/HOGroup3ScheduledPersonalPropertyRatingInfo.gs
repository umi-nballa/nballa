package una.rating.ho.group3.ratinginfos

uses una.rating.ho.common.HOScheduledPersonalPropertyRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/23/16
 * Time: 3:11 PM
 */
class HOGroup3ScheduledPersonalPropertyRatingInfo extends HOScheduledPersonalPropertyRatingInfo {
  var _rateZone: int as RateZone
  construct(item: ScheduledItem_HOE, county: String) {
    super(item)
    if (item.ScheduleType == ScheduleType_HOE.TC_PERSONALJEWELRY_EXT){
      if (county.compareToIgnoreCase("Broward") || county.compareToIgnoreCase("Dade") || county.compareToIgnoreCase("Palm Beach")
          || county.compareToIgnoreCase("Monroe"))
        _rateZone = 1
      else if (county.compareToIgnoreCase("Alachua") || county.compareToIgnoreCase("Charlotte") || county.compareToIgnoreCase("Collier") ||
          county.compareToIgnoreCase("Hillsborough") || county.compareToIgnoreCase("Indian River") || county.compareToIgnoreCase("Lee") ||
          county.compareToIgnoreCase("Martin") || county.compareToIgnoreCase("Manatee") || county.compareToIgnoreCase("Orange"))
        _rateZone = 2
      else
        _rateZone = 3
    }
  }
}