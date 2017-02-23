package una.rating.ho.dwellingfire.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo



/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/26/16
 * rating info for the dwelling level coverages for group 2 states
 */
class HODPDwellingRatingInfo extends HOCommonDwellingRatingInfo {


  construct(lineVersion: HomeownersLine_HOE) {
    super(lineVersion)
  }

  construct(dwellingCov: DwellingCov_HOE){
    super(dwellingCov)

    PersonalPropertyIncreasedLimit = dwellingCov.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value

  }

}