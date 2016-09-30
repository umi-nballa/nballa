package una.rating.ho.group3.ratinginfos
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/26/16
 * Rating info for all HO line coverages for group 3 states
 */
class HOGroup3LineRatingInfo {

  var _animalLiabilityLimit : int as AnimalLiabilityLimit

  construct(lineCov : HomeownersLineCov_HOE){
    if(lineCov typeis HOLI_AnimalLiabilityCov_HOE_Ext){
      _animalLiabilityLimit = lineCov.HOLI_AnimalLiabLimit_HOETerm?.Value.intValue()
    }
  }

}