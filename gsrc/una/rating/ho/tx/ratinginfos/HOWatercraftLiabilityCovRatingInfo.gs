package una.rating.ho.tx.ratinginfos
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 1/23/17
 */

class HOWatercraftLiabilityCovRatingInfo {

  var _watercraftType : WatercraftType_Ext as WatercraftType
  var _overallLength : OverallLengthWC_Ext as OverallLength
  var _totalHorsePower : HorsePowerWC_Ext as TotalHorsePower
  var _speedRating : SpeedRatingNew_Ext as SpeedRating
  var _medPayLimit: int as MedPayLimit
  var _personalLiabilityLimit: int as PersonalLiabilityLimit

  construct(item: HOscheduleItem_HOE_Ext, lineCov: HomeownersLineCov_HOE) {
    _personalLiabilityLimit = lineCov?.HOLine?.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value?.intValue()
    _medPayLimit = lineCov?.HOLine?.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value?.intValue()
    _watercraftType = item.watercraftType1
    _overallLength = item.overallLengthWC
    _totalHorsePower = item.WCHPA
    _speedRating = item.speedRating1
  }

}