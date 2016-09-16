package una.integration.mapping.hpx.commercialpackage.commercialproperty
/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/14/16
 * Time: 1:30 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCPBuildingProtectionMapper {

  function createBuildingProtection(bldg : CPBuilding) : wsi.schema.una.hpx.hpx_application_request.BldgProtection {
    var bldgProtection = new wsi.schema.una.hpx.hpx_application_request.BldgProtection()

    if (bldg.Building.BurglarySafeguard != null) {
      var protectionDeviceBurglarInd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceBurglarInd()
      protectionDeviceBurglarInd.setText(1)
      bldgProtection.addChild(protectionDeviceBurglarInd)
      var protectionDeviceBurglarCd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceBurglarCd()
      protectionDeviceBurglarCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ProtectionDevice.CEN)
      bldgProtection.addChild(protectionDeviceBurglarCd)

    }

    if (bldg.Building.SprinklerCoverage != null) {
      var protectionDeviceSprinklerInd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceSprinklerInd()
      if(bldg.Building.SprinklerCoverage.Code != "0") { // has sprinkler coverage... might need to add the percentage
        protectionDeviceSprinklerInd.setText(1)
      } else {
        protectionDeviceSprinklerInd.setText(0)
      }
    }
    return bldgProtection
  }
}