package una.rating.ho.group2.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/26/16
 * rating info for the dwelling level coverages for group 2 states
 */
class HOGroup2DwellingRatingInfo extends HOCommonDwellingRatingInfo {
  var _limitedFungiWetOrDryRotOrBacteriaSectionILimit : int as LimitedFungiWetOrDryRotOrBacteriaSectionILimit
  var buildingAdditionsAndAlterationsIncreasedLimit : BigDecimal as BuildingAdditionsAndAlterationsLimit
  construct(lineVersion: HomeownersLine_HOE) {
    super(lineVersion)
  }

  construct(dwellingCov: DwellingCov_HOE){
    super(dwellingCov)
    if(dwellingCov typeis HODW_FungiCov_HOE){
      _limitedFungiWetOrDryRotOrBacteriaSectionILimit = dwellingCov.HODW_FungiSectionILimit_HOETerm?.Value.intValue()
    }
  }

}