package una.rating.cp.common

uses java.math.BigDecimal
uses una.rating.cp.util.CPRatingUtil

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswam007
 * Date: 2/14/17
 */
class CPBuildingRatingInfo {

  var _equipmentBreakdownEndorsementLimit : BigDecimal as EquipmentBreakdownEndorsementLimit
  var _scheduledRatingModifier : BigDecimal as ScheduledRatingModifier
  var _consentToRateFactor : BigDecimal as ConsentToRateFactor = 1.0
  var _aopDeductible : int as AOPDeductible

  construct(building : CPBuilding){
    _scheduledRatingModifier = CPRatingUtil.ScheduledRatingModifier
    _aopDeductible = building.CPLocation.CPLine.allotherperilded.Code.toInt()
    if(building.CPEquipmentBreakdownEnhance_EXTExists){
      //TODO : Need to update the limit
      _equipmentBreakdownEndorsementLimit = 100.0
    }
  }
}