package una.rating.ho.common
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 1/23/17
 */
class HOWatercraftLiabilityCovRatingInfo {

  var _watercraftType : WatercraftType_Ext as WatercraftType
  var _overallLength : OverallLength_Ext as OverallLength
  var _totalHorsePower : Horsepower_Ext as TotalHorsePower
  var _speedRating : SpeedRating_Ext as SpeedRating
  var _medPayLimit: int as MedPayLimit
  var _personalLiabilityLimit: int as PersonalLiabilityLimit

  construct(item: HOscheduleItem_HOE_Ext, lineCov: HomeownersLineCov_HOE) {
    _personalLiabilityLimit = lineCov?.HOLine?.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value?.intValue()
    _medPayLimit = lineCov?.HOLine?.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value?.intValue()
    _watercraftType = item.watercraftType
    _overallLength = item.overallLength
    _totalHorsePower = item.horsepower
    _speedRating = item.speedRating
  }

}