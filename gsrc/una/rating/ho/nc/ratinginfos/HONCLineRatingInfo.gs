package una.rating.ho.nc.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:16 PM
 * To change this template use File | Settings | File Templates.
 */
class HONCLineRatingInfo {
  var _personalInjuryAgg : boolean as PersonalInjuryAggregate
  var _personalInjuryPer : boolean as PersonalInjuryPerOffense
  var _numberOfResidenceFamily : int as NumberOfResidenceFamily
  var _totalBasePremium: BigDecimal as TotalBasePremium
  var _firePersonalLiabilityLimit : BigDecimal as FirePersonalLiabilityLimit
  var _fireMedicalPaymentsLimit : BigDecimal as FireMedicalPaymentsLimit
  var _additionalResidencesRentedToOthers: int as AdditionalResidencesRentedToOthers

  construct(line: HomeownersLine_HOE){
    _personalInjuryAgg = line.HOLI_PersonalInjuryAggregate_NC_HOE_ExtExists
    _personalInjuryPer = line.HOLI_PersonalInjury_NC_HOE_ExtExists
    if(line.DPLI_Med_Pay_HOEExists)
      _fireMedicalPaymentsLimit = line.DPLI_Med_Pay_HOE?.DPLI_MedPay_Limit_HOETerm?.Value
    if(line.DPLI_Personal_Liability_HOEExists)
      _firePersonalLiabilityLimit = line.DPLI_Personal_Liability_HOE?.DPLI_LiabilityLimit_HOETerm?.Value


  _numberOfResidenceFamily = line?.HOLI_AddResidenceRentedtoOthers_HOE?.CoveredLocations*.NumberOfFamilies?.atMostOne()


  }
}