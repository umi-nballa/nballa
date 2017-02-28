package una.rating.ho.hawaii.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo



/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/26/16
 * rating info for the dwelling level coverages for group 2 states
 */
class HOHIDwellingRatingInfo extends HOCommonDwellingRatingInfo {


  construct(dwelling: Dwelling_HOE){
    super(dwelling)

    PersonalPropertyIncreasedLimit = dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value

  }

}