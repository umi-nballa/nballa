package una.rating.ho.group3.ratinginfos
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * rating info for the dwelling level coverages for group 3 states
 */
class HOGroup3DwellingRatingInfo {

  var _businessPropertyIncreasedLimit : int as BusinessPropertyIncreasedLimit

  construct(dwellingCov : DwellingCov_HOE){

    if(dwellingCov typeis HODW_BusinessProperty_HOE_Ext){
      _businessPropertyIncreasedLimit = (dwellingCov.HODW_OnPremises_Limit_HOETerm.Value.intValue())
    }
  }
}