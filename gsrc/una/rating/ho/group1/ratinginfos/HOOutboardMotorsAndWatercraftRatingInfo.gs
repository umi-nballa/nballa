package una.rating.ho.group1.ratinginfos
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/23/16
 * Time: 3:11 PM
 */
class HOOutboardMotorsAndWatercraftRatingInfo {

  var _waterCraftName : String as WaterCraftName
  var _waterCraftType : String as WaterCraftType
  var _overallLength : String as OverallLength
  var _medPayLimit : int as MedPayLimit
  var _personalLiabilityLimit : int as PersonalLiabilityLimit
  var _horsePower : String as HorsePower

  construct(item : HOscheduleItem_HOE_Ext, lineCov : HomeownersLineCov_HOE){
    _waterCraftName = item.watercraftName
    _waterCraftType = item.watercraftType.DisplayName
    _overallLength = item.overallLength.DisplayName

    _medPayLimit = (lineCov.HOLine.HOLI_Med_Pay_HOEExists)? lineCov.HOLine.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value?.intValue() : 0
    _personalLiabilityLimit = (lineCov.HOLine.HOLI_Personal_Liability_HOEExists)? lineCov.HOLine.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value?.intValue() : 0

    if(item.horsepower == typekey.Horsepower_Ext.TC_UNDER25 || item.horsepower == typekey.Horsepower_Ext.TC_26TO49 ||
       item.horsepower == typekey.Horsepower_Ext.TC_26TO50){
      _horsePower = "Up to 50"
    }
  }
}