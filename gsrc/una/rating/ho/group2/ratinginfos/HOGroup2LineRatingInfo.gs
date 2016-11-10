package una.rating.ho.group2.ratinginfos

uses una.rating.ho.group1.ratinginfos.HOGroup1LineRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/26/16
 * Rating info for all HO line coverages for group 2 states
 */
class HOGroup2LineRatingInfo  {
  var _medPayLimit: int as MedPayLimit
  var _personalLiabilityLimit: int as PersonalLiabilityLimit
  var _limitedFungiWetOrDryRotOrBacteriaSectionIILimit : int as LimitedFungiWetOrDryRotOrBacteriaSectionIILimit
  var _animalLiabilityLimit: int as AnimalLiabilityLimit

  construct(line: HomeownersLine_HOE) {
    if(line?.HOLI_FungiCov_HOEExists){
      _limitedFungiWetOrDryRotOrBacteriaSectionIILimit = line?.HOLI_FungiCov_HOE?.HOLI_AggLimit_HOETerm?.Value?.intValue()
    }
    _medPayLimit = (line.HOLI_Med_Pay_HOEExists) ? line.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value?.intValue() : 0
    _personalLiabilityLimit = (line.HOLI_Personal_Liability_HOEExists) ? line.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value?.intValue() : 0
    _animalLiabilityLimit = ((line.HOLI_AnimalLiabilityCov_HOE_ExtExists) ? line.HOLI_AnimalLiabilityCov_HOE_Ext?.HOLI_AnimalLiabLimit_HOETerm?.Value : 0) as int

  }
}