package una.integration.mapping.hpx.commercialpackage.commercialproperty

uses una.integration.mapping.hpx.common.HPXCoverageMapper



/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/13/16
 * Time: 2:52 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCPCoverageMapper extends HPXCoverageMapper{
  override function createScheduleList(currentCoverage : Coverage, previousCoverage : Coverage,  transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    switch (currentCoverage.PatternCode) {
      case "CPWindstormProtectiveDevices_EXT" :
          var cpWindstormProtectiveDevices = createCPWindstormProtectiveDevices(currentCoverage, previousCoverage, transactions)
          for (item in cpWindstormProtectiveDevices) { limits.add(item)}
          break
    }
    return limits
  }

  override function createDeductibleScheduleList(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType> {
    return null
  }

  override function createCoverableInfo(currentCoverage: Coverage, previousCoverage: Coverage): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    var coverable = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType()
    if (currentCoverage.OwningCoverable typeis CPBuilding) {
      var building = currentCoverage.OwningCoverable as CPBuilding
      coverable.BuildingNo = building?.Building?.BuildingNum != null ? building.Building.BuildingNum : ""
      coverable.LocationNo = building?.CPLocation?.Location?.LocationNum
    }
    else if (currentCoverage.OwningCoverable typeis CPLocation) {
      var location = currentCoverage.OwningCoverable as CPLocation
      coverable.LocationNo = location?.Location?.LocationNum != null ? location.Location.LocationNum : ""
    }
    return coverable
  }

  override function getCostCoverage(cost : Cost) : Coverage {
    var result : Coverage

    switch(typeof cost){
      case CPCost:
          result = cost.Coverage
          break
      case CPBuildingCovCost:
          result = cost.Coverage
          break
      case CPBuildingCovGrp1Cost:
          result = cost.Coverage
          break
      case CPBuildingCovGrp2Cost:
          result = cost.Coverage
          break
    }
    return result
  }

  function createCPWindstormProtectiveDevices(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.CoverageCd = currentCoverage.PatternCode
    limit.CoverageSubCd = ""
    limit.CurrentTermAmt.Amt = 0.00
    limit.NetChangeAmt.Amt = 0.00
    limit.FormatPct = 0
    limit.FormatText = ""
    limit.LimitDesc = "PropertyDescription:" + (currentCoverage.OwningCoverable as CPBuilding).Building.Description +
                      "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) + " |"
    limit.WrittenAmt.Amt = 0.00
    limits.add(limit)
    return limits
  }
}