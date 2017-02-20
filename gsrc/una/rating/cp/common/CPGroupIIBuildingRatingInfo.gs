package una.rating.cp.common

uses java.math.BigDecimal
uses una.rating.cp.util.CPRatingUtil

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswam007
 * Date: 2/14/17
 */
class CPGroupIIBuildingRatingInfo {

  var _equipmentBreakdownEndorsementLimit : BigDecimal as EquipmentBreakdownEndorsementLimit
  var _scheduledRatingModifier : BigDecimal as ScheduledRatingModifier
  var _consentToRateFactor : BigDecimal as ConsentToRateFactor = 1.0
  var _aopDeductible : int as AOPDeductible

  construct(building : CPBuilding){
    _scheduledRatingModifier = CPRatingUtil.ScheduledRatingModifier
    _aopDeductible = building.CPLocation.CPLine.allotherperilded.Code.toInt()
    if(building.CPEquipmentBreakdownEnhance_EXTExists){
      _equipmentBreakdownEndorsementLimit = totalInsuredValueLimit(building)
    }
  }

  private function totalInsuredValueLimit(building : CPBuilding) : BigDecimal {
    var insuredValueLimit : BigDecimal = 0.0
    if(building.CPBldgCovExists)
      insuredValueLimit += building.CPBldgCov?.CPBldgCovLimitTerm?.Value
    if(building.CPBPPCovExists)
      insuredValueLimit += building.CPBPPCov?.CPBPPCovLimitTerm?.Value
    return insuredValueLimit
  }
}