package una.rating.ho.group1.ratinginfos

uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/11/16
 * Time: 12:06 PM
 */
class HOGroup1LineRatingInfo{
  var _animalLiabilityLimit: int as AnimalLiabilityLimit
  var _medPayLimit: int as MedPayLimit
  var _personalLiabilityLimit: int as PersonalLiabilityLimit
  var _limitedFungiWetOrDryRotOrBacteriaSectionIILimit: int as LimitedFungiWetOrDryRotOrBacteriaSectionIILimit
  var _personalInjuryLimit: int as PersonalInjuryLimit
  var _residenceType: String as ResidenceType
  var _numberOfAddtlResidences : int as NumberOfAddtlResidences
  var _totalBasePremium: BigDecimal as TotalBasePremium


  construct(line: HomeownersLine_HOE) {
    _animalLiabilityLimit = ((line.HOLI_AnimalLiabilityCov_HOE_ExtExists) ? line.HOLI_AnimalLiabilityCov_HOE_Ext?.HOLI_AnimalLiabLimit_HOETerm?.Value : 0) as int
    _medPayLimit = (line.HOLI_Med_Pay_HOEExists) ? line.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value?.intValue() : 0
    _personalLiabilityLimit = (line.HOLI_Personal_Liability_HOEExists) ? line.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value?.intValue() : 0
    if (line?.HOLI_FungiCov_HOEExists){
      _limitedFungiWetOrDryRotOrBacteriaSectionIILimit = line?.HOLI_FungiCov_HOE?.HOLI_AggLimit_HOETerm?.Value.intValue()
    }
    _personalInjuryLimit = (line.HOLI_PersonalInjury_HOEExists) ? line.HOLI_PersonalInjury_HOE?.HOLI_PersonalInjuryLimit_HOE_ExtTerm?.Value?.intValue() : 0

  }
}