package una.rating.ho.group1.ratinginfos

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/11/16
 * Time: 12:06 PM
 */
class HOGroup1LineRatingInfo {

  var _animalLiabilityLimit: int as AnimalLiabilityLimit
  var _medPayLimit: int as MedPayLimit
  var _personalLiabilityLimit: int as PersonalLiabilityLimit
  var _limitedFungiWetOrDryRotOrBacteriaSectionIILimit: int as LimitedFungiWetOrDryRotOrBacteriaSectionIILimit
  var _personalInjuryLimit: int as PersonalInjuryLimit
  var _residenceType: String as ResidenceType

  construct(lineCov: HomeownersLineCov_HOE) {
    _animalLiabilityLimit = ((lineCov.HOLine.HOLI_AnimalLiabilityCov_HOE_ExtExists) ? lineCov.HOLine.HOLI_AnimalLiabilityCov_HOE_Ext?.HOLI_AnimalLiabLimit_HOETerm?.Value : 0) as int
    _medPayLimit = (lineCov.HOLine.HOLI_Med_Pay_HOEExists) ? lineCov.HOLine.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value?.intValue() : 0
    _personalLiabilityLimit = (lineCov.HOLine.HOLI_Personal_Liability_HOEExists) ? lineCov.HOLine.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value?.intValue() : 0
    if (lineCov typeis HOLI_FungiCov_HOE){
      _limitedFungiWetOrDryRotOrBacteriaSectionIILimit = lineCov.HOLI_AggLimit_HOETerm?.Value.intValue()
    }
    _personalInjuryLimit = (lineCov.HOLine.HOLI_PersonalInjury_HOEExists) ? lineCov.HOLine.HOLI_PersonalInjury_HOE?.HOLI_PersonalInjuryLimit_HOE_ExtTerm?.Value?.intValue() : 0
    _residenceType = (lineCov.HOLine.Dwelling.ResidenceType.Code)
  }
}