package una.rating.ho.common

uses java.math.BigDecimal


/**
 * Created with IntelliJ IDEA.
 * Date: 03/07/17
 */
class HOAddResidenceRentedToOthersCovRatingInfo {

  var _medPayLimit : BigDecimal as MedPayLimit
  var _personalLiabilityLimit : BigDecimal as PersonalLiabilityLimit
  var _numberOfFamilies : int as NumberOfFamilies

  construct(item: CoveredLocation_HOE) {
    _numberOfFamilies = item.NumberOfFamilies
    _medPayLimit = item.HOLineCov?.HOLine?.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value
    _personalLiabilityLimit = item?.HOLineCov?.HOLine?.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value

  }
}