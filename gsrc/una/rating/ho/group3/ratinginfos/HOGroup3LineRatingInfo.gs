package una.rating.ho.group3.ratinginfos

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/26/16
 * Rating info for all HO line coverages for group 3 states
 */
class HOGroup3LineRatingInfo {
  var _animalLiabilityLimit: int as AnimalLiabilityLimit
  var _medPayLimit: int as MedPayLimit
  var _personalLiabilityLimit: int as PersonalLiabilityLimit
  construct(lineCov: HomeownersLineCov_HOE) {
    if (lineCov typeis HOLI_AnimalLiabilityCov_HOE_Ext){
      _animalLiabilityLimit = lineCov.HOLI_AnimalLiabLimit_HOETerm?.Value.intValue()
    }
    if ((lineCov typeis HOPS_GolfCartPD_HOE_Ext) || (lineCov typeis HOLI_Personal_Liability_HOE)){
      _medPayLimit = (lineCov.HOLine.HOLI_Med_Pay_HOEExists) ? lineCov.HOLine.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value?.intValue() : 0
      _personalLiabilityLimit = (lineCov.HOLine.HOLI_Personal_Liability_HOEExists) ? lineCov.HOLine.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value?.intValue() : 0
    }
  }
}