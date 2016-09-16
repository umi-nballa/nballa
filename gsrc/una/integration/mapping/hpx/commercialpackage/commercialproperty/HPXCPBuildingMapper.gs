package una.integration.mapping.hpx.commercialpackage.commercialproperty



/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/14/16
 * Time: 12:18 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCPBuildingMapper {

  function createBuilding(bldg : CPBuilding) : wsi.schema.una.hpx.hpx_application_request.Dwell {
    var buildingConstructionMapper = new HPXCPBuildingConstructionMapper ()
    var buildingMapper = new HPXCPBuildingMapper()
    var buildingProtectionMapper = new HPXCPBuildingProtectionMapper ()
    var dwell = new wsi.schema.una.hpx.hpx_application_request.Dwell()
    dwell.addChild(buildingMapper.createDwellRating(bldg))
//    dwell.addChild(buildingMapper.createDwellInspectionValuation(bldg))
//    dwell.addChild(buildingMapper.createDwellOccupancy(bldg))
    dwell.addChild(buildingProtectionMapper.createBuildingProtection(bldg))
    dwell.addChild(buildingConstructionMapper.createBuildingConstructionInfo(bldg))
    return dwell
  }

  function createDwellRating(bldg : CPBuilding) : wsi.schema.una.hpx.hpx_application_request.DwellRating {
    var dwellRating = new wsi.schema.una.hpx.hpx_application_request.DwellRating()
    if (bldg.PolicyLocations[0].TerritoryCodes[0] != null) {
      var territoryCd = new wsi.schema.una.hpx.hpx_application_request.TerritoryCd()
      territoryCd.setText(bldg.PolicyLocations[0].TerritoryCodes[0].Code)
      dwellRating.addChild(territoryCd)
    }
    return dwellRating
  }

  function createMasterPolicyInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.MasterPolicyInfo {
    var masterPolicyInfo = new wsi.schema.una.hpx.hpx_application_request.MasterPolicyInfo()
    var policyNumber = new wsi.schema.una.hpx.hpx_application_request.PolicyNumber()
    if(policyPeriod.PolicyTerm.PolicyNumber != null) {
      policyNumber.setText(policyPeriod.PolicyTerm.PolicyNumber)
      masterPolicyInfo.addChild(policyNumber)
    }
    return masterPolicyInfo
  }

  function createOutboardMotorsAndWatercraft(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.Watercraft> {
    var watercrafts = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Watercraft>()
    var outboardMotorsAndWatercrafts = policyPeriod.HomeownersLine_HOE.HOSL_OutboardMotorsWatercraft_HOE_Ext.scheduledItem_Ext
    for (item in outboardMotorsAndWatercrafts) {
      var watercraft = new wsi.schema.una.hpx.hpx_application_request.Watercraft()
      var watercraftName = new wsi.schema.una.hpx.hpx_application_request.WatercraftName()
      if (item.watercraftName != null) {
        watercraftName.setText(item.watercraftName)
        watercraft.addChild(watercraftName)
      }
      var watercraftType = new wsi.schema.una.hpx.hpx_application_request.WatercraftType()
      if (item.watercraftType != null) {
        watercraftType.setText(item.watercraftType)
        watercraft.addChild(watercraftType)
      }
      var watercraftDescription = new wsi.schema.una.hpx.hpx_application_request.Description()
      if (item.watercraftDescription != null) {
        watercraftDescription.setText(item.watercraftDescription)
        watercraft.addChild(watercraftDescription)
      }
      var length = new wsi.schema.una.hpx.hpx_application_request.Length()
      if (item.overallLength != null) {
        length.setText(item.overallLength)
      }
      var horsepower = new wsi.schema.una.hpx.hpx_application_request.Horsepower()
      var numUnits = new wsi.schema.una.hpx.hpx_application_request.NumUnits()
      var unitMeasurementCd = new wsi.schema.una.hpx.hpx_application_request.UnitMeasurementCd()
      if (item.horsepower != null) {
        numUnits.setText(item.horsepower.DisplayName)
        horsepower.addChild(numUnits)
        unitMeasurementCd.setText("Horsepower")
        horsepower.addChild(unitMeasurementCd)
        watercraft.addChild(horsepower)
      }
      var speedRating = new wsi.schema.una.hpx.hpx_application_request.SpeedRating()
      if (item.speedRating != null) {
        speedRating.setText(item.speedRating)
        watercraft.addChild(speedRating)
      }
      var navigationPeriod = new wsi.schema.una.hpx.hpx_application_request.NavigationPeriod()
      if (item.navPeriodEachYear != null) {
        navigationPeriod.setText(item.navPeriodEachYear)
        watercraft.addChild(navigationPeriod)
      }
      var navigationFromDate = new wsi.schema.una.hpx.hpx_application_request.NavigationFromDt()
      if (item.fromDate != null) {
        navigationFromDate.setText(item.fromDate)
        watercraft.addChild(navigationFromDate)
      }
      var navigationToDate = new wsi.schema.una.hpx.hpx_application_request.NavigationToDate()
      if (item.toDate != null) {
        navigationToDate.setText(item.toDate)
        watercraft.addChild(navigationToDate)
      }
      watercrafts.add(watercraft)
    }
    return watercrafts
  }
}