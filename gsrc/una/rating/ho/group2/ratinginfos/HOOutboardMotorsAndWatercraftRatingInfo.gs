package una.rating.ho.group2.ratinginfos
/**
 * Created with IntelliJ IDEA.
 * User: ABrown
 * Date: 2/8/17
 */
class HOOutboardMotorsAndWatercraftRatingInfo {
  var _waterCraftName: String as WaterCraftName
  var _waterCraftType: String as WaterCraftType
  var _overallLength: String as OverallLength
  var _medPayLimit: int as MedPayLimit
  var _personalLiabilityLimit: int as PersonalLiabilityLimit
  var _horsePower: String as HorsePower

  construct(item: HOscheduleItem_HOE_Ext, lineCov: HomeownersLineCov_HOE) {
    _waterCraftName = item.watercraftName
    _waterCraftType = item.watercraftType.DisplayName
    _overallLength = item.overallLength.DisplayName

    _medPayLimit = (lineCov.HOLine.HOLI_Med_Pay_HOEExists) ? lineCov.HOLine.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value?.intValue() : 0
    _personalLiabilityLimit = (lineCov.HOLine.HOLI_Personal_Liability_HOEExists) ? lineCov.HOLine.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value?.intValue() : 0


      _horsePower = item.horsepower.DisplayName
    }
  }
