package una.rating.ho
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

  construct(){}

  construct(lineCov : HomeownersLineCov_HOE){
    MedPayLimit = (lineCov.HOLine.HOLI_Med_Pay_HOEExists)? lineCov.HOLine.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value?.intValue() : 0
    PersonalLiabilityLimit = (lineCov.HOLine.HOLI_Personal_Liability_HOEExists)? lineCov.HOLine.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value?.intValue() : 0
  }
}