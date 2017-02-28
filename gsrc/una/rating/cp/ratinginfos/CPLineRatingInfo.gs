package una.rating.cp.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 */
class CPLineRatingInfo {

  var _totalBuildingLimit : BigDecimal as TotalBuildingLimit = 0.0
  var _totalPersonalPropertyLimit : BigDecimal as TotalPersonalPropertyLimit = 0.0

  construct(line : CPLine){
    var allBuildings = line.CPLocations*.Buildings
    for(building in allBuildings){
      if(building.CPBldgCovExists)
        _totalBuildingLimit += building?.CPBldgCov?.CPBldgCovLimitTerm?.Value
      if(building.CPBPPCovExists)
        _totalPersonalPropertyLimit += building?.CPBPPCov?.CPBPPCovLimitTerm?.Value
    }
  }
}