package una.integration.mapping.hpx.businessowners

uses una.integration.mapping.hpx.businessowners.HPXBP7BuildingProtectionMapper
uses gw.xml.XmlElement
uses una.integration.mapping.hpx.common.HPXStructureMapper
uses una.integration.mapping.hpx.helper.HPXJobHelper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/25/16
 * Time: 4:57 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXBP7BuildingMapper implements HPXStructureMapper {

  override function createStructure(coverable : Coverable) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType {
    return createBuilding(coverable as BP7Building)
  }

  function createBuilding(bldg : BP7Building) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType {
    var buildingConstructionMapper = new HPXBP7BuildingConstructionMapper ()
    var buildingMapper = new HPXBP7BuildingMapper()
    var buildingProtectionMapper = new HPXBP7BuildingProtectionMapper ()
    var dwell = new wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType()
    dwell.addChild(new XmlElement("DwellRating", buildingMapper.createDwellRating(bldg)))
    dwell.addChild(new XmlElement("DwellInspectionValuation", buildingMapper.createDwellInspectionValuation(bldg)))
    dwell.addChild(new XmlElement("DwellOccupancy", buildingMapper.createDwellOccupancy(bldg)))
    dwell.addChild(new XmlElement("BldgProtection", buildingProtectionMapper.createBuildingProtection(bldg)))
    dwell.addChild(new XmlElement("Construction", buildingConstructionMapper.createBuildingConstructionInfo(bldg)))
    dwell.addChild(new XmlElement("BuildingKey", createCoverableInfo(bldg)))
    return dwell
  }

  function createCoverableInfo(bldg : Coverable) : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    var coverable = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType()
    if (bldg typeis BP7Building) {
      var building = bldg as BP7Building
      coverable.BuildingNo = building?.Building?.BuildingNum != null ? building.Building.BuildingNum : ""
      coverable.LocationNo = building?.Location?.Location.LocationNum != null ? building?.Location?.Location.LocationNum : ""
      coverable.Description = building?.Building?.Description
      var jobHelper = new HPXJobHelper()
      coverable.NewlyAdded = jobHelper.isNewlyAddedBuilding(building.PolicyLine.AssociatedPolicyPeriod, building.Building)
    }
    return coverable
  }

  function createDwellRating(bldg : BP7Building) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellRatingType {
    var dwellRating = new wsi.schema.una.hpx.hpx_application_request.types.complex.DwellRatingType()
    dwellRating.TerritoryCd = bldg.PolicyLocations[0].TerritoryCodes[0] != null ? bldg.PolicyLocations[0].TerritoryCodes[0].Code : ""
    return dwellRating
  }

  function createDwellInspectionValuation(bldg : BP7Building) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellInspectionValuationType {
    var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    var dwellingInspectionValuation = new wsi.schema.una.hpx.hpx_application_request.types.complex.DwellInspectionValuationType()
    dwellingInspectionValuation.NumStoriesInDwellingCd = bldg.UnitNumber != null ? typecodeMapper.getAliasByInternalCode("NumUnits_HOE", "hpx", bldg.UnitNumber) : 0
    return dwellingInspectionValuation
  }

  function createDwellOccupancy(bldg : BP7Building) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellOccupancyType{
    var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    var dwellOccupancy = new wsi.schema.una.hpx.hpx_application_request.types.complex.DwellOccupancyType()
    dwellOccupancy.OccupancyTypeCd = bldg.PredominentOccType_Ext != null ?
                                            typecodeMapper.getAliasByInternalCode("BP7PredominentOccType_Ext", "hpx", bldg.PredominentOccType_Ext.Code) : ""
    dwellOccupancy.OccupancyTypeDesc = bldg.PredominentOccType_Ext != null ? bldg.PredominentOccType_Ext.Description : ""
    return dwellOccupancy
  }

  function createMasterPolicyInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.MasterPolicyInfoType {
    var masterPolicyInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.MasterPolicyInfoType()
    masterPolicyInfo.PolicyNumber = policyPeriod.PolicyTerm.PolicyNumber != null ? policyPeriod.PolicyTerm.PolicyNumber : ""
    return masterPolicyInfo
  }
}