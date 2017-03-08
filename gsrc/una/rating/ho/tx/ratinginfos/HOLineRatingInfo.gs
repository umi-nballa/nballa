package una.rating.ho.tx.ratinginfos

uses java.math.BigDecimal



/**
 * User: bduraiswamy
 * Date: 6/16/16
 * Time: 10:18 AM
 * custom implementation of a gosu class which populates the parameters for the routines for the line level coverages
 * for the homeowners policies.
 */
class HOLineRatingInfo {
  var _medPayLimit: int as MedPayLimit = 0
  var _personalLiabilityLimit: int as PersonalLiabilityLimit = 0
  var _personalInjuryLimit: int as PersonalInjuryLimit = 0
  var _animalLiabilityLimit: int as AnimalLiabilityLimit = 0
  var _totalBasePremium: BigDecimal as TotalBasePremium
  var _numberOfLocations : int as NumberOfLocations
  construct() {
  }

  construct(line: HomeownersLine_HOE) {
    if(line.HOLI_Med_Pay_HOEExists)
      _medPayLimit = line.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value?.intValue()
    if(line.HOLI_Personal_Liability_HOEExists)
    _personalLiabilityLimit = line.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value?.intValue()
    if(line.HOLI_PersonalInjury_HOEExists)
    _personalInjuryLimit = line.HOLI_PersonalInjury_HOE?.HOLI_PersonalInjuryLimit_HOE_ExtTerm?.Value?.intValue()
    if(line.HOLI_AnimalLiabilityCov_HOE_ExtExists)
    _animalLiabilityLimit = line.HOLI_AnimalLiabilityCov_HOE_Ext?.HOLI_AnimalLiabLimit_HOETerm?.Value.intValue()

    if(line.HOLI_AddResidenceRentedtoOthers_HOEExists)
      _numberOfLocations = line.HOLI_AddResidenceRentedtoOthers_HOE?.CoveredLocations?.Count
  }
}