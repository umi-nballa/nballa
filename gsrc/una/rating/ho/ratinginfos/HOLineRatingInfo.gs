package una.rating.ho.ratinginfos

uses java.math.BigDecimal






/**
 * User: bduraiswamy
 * Date: 6/16/16
 * Time: 10:18 AM
 * custom implementation of a gosu class which populates the parameters for the routines for the line level coverages
 * for the homeowners policies.
 */
class HOLineRatingInfo {

  var _medPayLimit : int as MedPayLimit
  var _personalLiabilityLimit : int as PersonalLiabilityLimit
  var _personalInjuryLimit : int as PersonalInjuryLimit
  var _animalLiabilityLimit : int as AnimalLiabilityLimit
  var _totalBasePremium : BigDecimal as TotalBasePremium

  construct(){}

  construct(lineCov : HomeownersLineCov_HOE){
    _medPayLimit = (lineCov.HOLine.HOLI_Med_Pay_HOEExists)? lineCov.HOLine.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value?.intValue() : 0
    _personalLiabilityLimit = (lineCov.HOLine.HOLI_Personal_Liability_HOEExists)? lineCov.HOLine.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value?.intValue() : 0
    _personalInjuryLimit = (lineCov.HOLine.HOLI_PersonalInjury_HOEExists)? lineCov.HOLine.HOLI_PersonalInjury_HOE?.HOLI_PersonalInjuryLimit_HOE_ExtTerm?.Value?.intValue() : 0
    _animalLiabilityLimit = ((lineCov.HOLine.HOLI_AnimalLiabilityCov_HOE_ExtExists)? lineCov.HOLine.HOLI_AnimalLiabilityCov_HOE_Ext?.HOLI_AnimalLiabLimit_HOETerm?.Value : 0) as int
  }
}