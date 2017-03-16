package una.rating.ho.hawaii.ratinginfos

uses java.math.BigDecimal


/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:16 PM
 * To change this template use File | Settings | File Templates.
 */
class HOLineRatingInfo {

  var _totalBasePremium: BigDecimal as TotalBasePremium
  var _personalInjuryLimit: int as PersonalInjuryLimit
  var _animalLiabilityLimit: int as AnimalLiabilityLimit
  var _personalLiabilityLimit: int as PersonalLiabilityLimit
  var _medPayLimit : int as MedPayLimit

  construct(line: HomeownersLine_HOE){
    _personalInjuryLimit = (line?.HOLI_PersonalInjury_HOEExists) ? line?.HOLI_PersonalInjury_HOE?.HOLI_PersonalInjuryLimit_HOE_ExtTerm?.Value?.intValue() : 0
    _animalLiabilityLimit = ((line.HOLI_AnimalLiabilityCov_HOE_ExtExists) ? line.HOLI_AnimalLiabilityCov_HOE_Ext?.HOLI_AnimalLiabLimit_HOETerm?.Value : 0) as int
    _personalLiabilityLimit = (line.HOLI_Personal_Liability_HOEExists) ? line.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value?.intValue() : 0
    _medPayLimit = (line.HOLI_Med_Pay_HOEExists)? line.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value?.intValue() : 0
  }
}