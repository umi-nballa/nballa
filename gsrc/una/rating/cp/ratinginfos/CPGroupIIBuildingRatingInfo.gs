package una.rating.cp.ratinginfos

uses java.math.BigDecimal
uses una.rating.cp.common.CPCommonBuildingRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswam007
 * Date: 2/14/17
 */
class CPGroupIIBuildingRatingInfo extends CPCommonBuildingRatingInfo{

  var _equipmentBreakdownEndorsementLimit : BigDecimal as EquipmentBreakdownEndorsementLimit


  construct(building : CPBuilding){
    super(building)
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