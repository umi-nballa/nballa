package una.integration.mapping.hpx.commercialpackage.commercialproperty

uses gw.xml.XmlElement



/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/14/16
 * Time: 12:18 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCPBuildingMapper {

  function createBuilding(bldg : CPBuilding) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType {
    var buildingConstructionMapper = new HPXCPBuildingConstructionMapper ()
    var buildingMapper = new HPXCPBuildingMapper()
    var buildingProtectionMapper = new HPXCPBuildingProtectionMapper ()
    var dwell = new wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType()
    dwell.addChild(new XmlElement("DwellRating", buildingMapper.createDwellRating(bldg)))
//    dwell.addChild(buildingMapper.createDwellInspectionValuation(bldg))
//    dwell.addChild(buildingMapper.createDwellOccupancy(bldg))
    dwell.addChild(new XmlElement("BldgProtection", buildingProtectionMapper.createBuildingProtection(bldg)))
    dwell.addChild(new XmlElement("Construction", buildingConstructionMapper.createBuildingConstructionInfo(bldg)))
    return dwell
  }

  function createDwellRating(bldg : CPBuilding) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellRatingType {
    var dwellRating = new wsi.schema.una.hpx.hpx_application_request.types.complex.DwellRatingType()
    dwellRating.TerritoryCd = bldg.PolicyLocations[0].TerritoryCodes[0] != null ? bldg.PolicyLocations[0].TerritoryCodes[0].Code : ""
    return dwellRating
  }

  function createMasterPolicyInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.MasterPolicyInfoType {
    var masterPolicyInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.MasterPolicyInfoType()
    masterPolicyInfo.PolicyNumber = policyPeriod.PolicyTerm.PolicyNumber != null ? policyPeriod.PolicyTerm.PolicyNumber : ""
    return masterPolicyInfo
  }
}