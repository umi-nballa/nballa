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
  function createScheduleList(currentCoverage : Coverage, previousCoverage : Coverage,  transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.Limit> {
    // Businessowners Line does not have Scheduled Items
    return null
  }

  override function createCoverableInfo(currentCoverage: Coverage, previousCoverage: Coverage): wsi.schema.una.hpx.hpx_application_request.Coverable {
    var coverable = new wsi.schema.una.hpx.hpx_application_request.Coverable()
    var buildingNo = new wsi.schema.una.hpx.hpx_application_request.BuildingNo()
    if (currentCoverage.OwningCoverable typeis CPBuilding) {
      var building = currentCoverage.OwningCoverable as CPBuilding
      if (building?.Building?.BuildingNum != null) {
        buildingNo.setText(building.Building.BuildingNum)
        coverable.addChild(buildingNo)
      }
    }
    var locationNo = new wsi.schema.una.hpx.hpx_application_request.LocationNo()
    if (currentCoverage.OwningCoverable typeis CPLocation) {
      var location = currentCoverage.OwningCoverable as CPLocation
      if (location?.Location?.LocationNum != null) {
        locationNo.setText(location.Location.LocationNum)
        coverable.addChild(locationNo)
      }
    }
    return coverable
  }

}