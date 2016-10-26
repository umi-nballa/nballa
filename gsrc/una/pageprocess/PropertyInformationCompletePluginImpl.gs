package una.pageprocess

uses una.integration.service.gateway.plugin.GatewayPlugin
uses una.integration.service.gateway.tuna.TunaInterface
uses una.logging.UnaLoggerCategory
uses una.model.AddressDTO
uses java.lang.Exception
uses java.lang.Integer

/**
 * This Class is  for calling  one of the TUNA Service GetPropertyInformationComplete
 * Created By: ptheegala
 * Created On: 6/1/16
 *
 */
class PropertyInformationCompletePluginImpl {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  private static final var CLASS_NAME = PropertyInformationCompletePluginImpl.Type.DisplayName
  final static var HO_LOB = "Homeowners"
  final static var YEAR_BUILT = "YearBuilt"
  final static var STORIES_NUMBER = "NumberOfStories"
  final static var CONSTRUCTION_TYPE = "TypeOfConstruction"
  final static var SQUARE_FOOTAGE = "TotalSquareFootage"
  final static var ROOF_TYPE = "RoofType"
  final static var ROOF_COVER = "RoofCover"
  final static var WIND_POOL = "WindPool"
  final static var BCEG = "BCEG"
  final static var FIRE_LINE_MATCH_LEVEL = "FirelineMatchLevel"
  final static var DISTANCE_TO_COAST = "DistanceToCoast"
  final static var PROTECTION_CLASS = "ProtectionClass"
  final static var EXTERIOR_WALL_FINISH = "ExteriorWallFinish"
  private var _TUNAGateway = GatewayPlugin.makeTunaGateway()
  var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
  var baseState = {"CA", "FL", "NV", "NC", "HI", "TX"}
  construct() {
  }

  //Instance call for TUNAGATEWAY

  property get TUNAGateway(): TunaInterface {
    return _TUNAGateway
  }

  public function getPropertyInformationComplete(productSelection: ProductSelection, account: Account, policyPeriod: PolicyPeriod, producerSelection: ProducerSelection)
  {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getPropertyInformationComplete" + "For DwellingLocation ", this.IntrinsicType)
      if (productSelection.ProductCode == HO_LOB){
        var _address = new AddressDTO()
        logger.info("Account Number..." + account.AccountNumber)
        for (location in account.AccountLocations) {
          logger.info("Primary Location:" + location.Primary + "Address Scrubbed: " + location.AddressScrub_Ext)
          if (location.Primary && location.AddressScrub_Ext){
            logger.info("Address.." + location.AddressLine1 + ".. " + location.City + " .." + location.State.DisplayName + " .." + location.PostalCode + " ...." + location.Primary)
            _address.AddressLine1 = location.AddressLine1
            _address.State = location.State.DisplayName
            _address.City = location.City
            _address.PostalCode = location.PostalCode
            _address.Country = location.Country.DisplayName

            var dwellingDetails = TUNAGateway.fetchPropertyInformationComplete(_address)

            gw.transaction.Transaction.runWithNewBundle(\bun -> {

              policyPeriod = bun.add(policyPeriod)
              if (null != dwellingDetails.Datums && dwellingDetails.Datums.size() > 0) {
                for (dwell in dwellingDetails.Datums) {

                  if (dwell.ID == YEAR_BUILT)
                    policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt = (dwell.Value) as Integer

                  else if (dwell.ID == STORIES_NUMBER)
                    policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber = typecodeMapper.getInternalCodeByAlias("NumberOfStories_HOE", "tuna" + "_" + producerSelection.State.Code, dwell.Value)

                  else if (dwell.ID == CONSTRUCTION_TYPE) {
                      if (baseState.contains(producerSelection.State.Code))
                        policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = typecodeMapper.getInternalCodeByAlias("ConstructionType_HOE", "tuna" + "_" + producerSelection.State.Code, dwell.Value)
                      else
                        policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = typecodeMapper.getInternalCodeByAlias("ConstructionType_HOE", "tuna", dwell.Value)
                    }
                    else if (dwell.ID == EXTERIOR_WALL_FINISH) {
                        if (baseState.contains(producerSelection.State.Code))
                          policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = typecodeMapper.getInternalCodeByAlias("ExteriorWallFinish_Ext", "tuna" + "_" + producerSelection.State.Code, dwell.Value)
                        else
                          policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = typecodeMapper.getInternalCodeByAlias("ExteriorWallFinish_Ext", "tuna", dwell.Value)
                      }

                      else if (dwell.ID == SQUARE_FOOTAGE)
                          policyPeriod.HomeownersLine_HOE.Dwelling.SquareFootage_Ext = (dwell.Value) as Integer


                        else if (dwell.ID == ROOF_TYPE) {
                            if (baseState.contains(producerSelection.State.Code))
                              policyPeriod.HomeownersLine_HOE.Dwelling.RoofShape_Ext = typecodeMapper.getInternalCodeByAlias("RoofShape_Ext", "tuna" + "_" + producerSelection.State.Code, dwell.Value)
                            else
                              policyPeriod.HomeownersLine_HOE.Dwelling.RoofShape_Ext = typecodeMapper.getInternalCodeByAlias("RoofShape_Ext", "tuna", dwell.Value)
                          }
                          else if (dwell.ID == ROOF_COVER) {
                              //mapping to material
                              if (baseState.contains(producerSelection.State.Code))
                                policyPeriod.HomeownersLine_HOE.Dwelling.RoofType = typecodeMapper.getInternalCodeByAlias("RoofType", "tuna" + "_" + producerSelection.State.Code, dwell.Value)
                              else
                                policyPeriod.HomeownersLine_HOE.Dwelling.RoofType = typecodeMapper.getInternalCodeByAlias("RoofType", "tuna", dwell.Value)
                            }
                            else if (dwell.ID == WIND_POOL)
                                policyPeriod.HomeownersLine_HOE.Dwelling.PropertyCovByStateWndstorm_Ext = (dwell.Value) as Boolean

                              else if (dwell.ID == PROTECTION_CLASS)
                                  policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode = dwell.Value
                }
              }
            })
          }
        }
      }
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " getPropertyInformationComplete" + "For DwellingLocation ", this.IntrinsicType)
    } catch (exp: Exception)
    {
      logger.error("TunaGateway : Dwelling Construction Information " + " : StackTrace = ", exp)
      //throw new gw.api.util.DisplayableException ("Scrubb the address Properly")
    }
  }

  public function getBOPInformation(policyPeriod: PolicyPeriod, building: BP7Building) {
    var _address = new AddressDTO()
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getBOPInformation" + "For BuildingLocation ", this.IntrinsicType)
      logger.info("Location Details..." + policyPeriod.BP7Line.BP7Locations.sortBy(\loc -> loc.PolicyLocation.LocationNum))
      _address.AddressLine1 = policyPeriod.BP7Line.BP7Locations.PolicyLocation.AddressLine1.first()
      _address.City = policyPeriod.BP7Line.BP7Locations.PolicyLocation.City.first()
      _address.State = policyPeriod.BP7Line.BP7Locations.PolicyLocation.State.first()
      _address.PostalCode = policyPeriod.BP7Line.BP7Locations.PolicyLocation.PostalCode.first()
      _address.YearBuilt = building.YearBuilt_Ext
      var propertyInformation = TUNAGateway.fetchPropertyInformation(_address)
      logger.info("Response Print:" + propertyInformation.ScrubStatus)
      if (null != propertyInformation.Datums && propertyInformation.Datums.size() > 0) {
        for (buildingDetails in propertyInformation.Datums) {
          if (buildingDetails.ID == FIRE_LINE_MATCH_LEVEL) {
            building.FireDepartmentDistance_Ext = buildingDetails.Value
            building.Location.FireDepartment_Ext = buildingDetails.Value
          }
          else if (buildingDetails.ID == BCEG)
            building.BldgCodeEffGrade = typecodeMapper.getInternalCodeByAlias("BP7BldgCodeEffectivenessGrade", "tuna", buildingDetails.Value)
          else if (buildingDetails.ID == PROTECTION_CLASS)
              building.Location.FireProtectionClassPPC = typecodeMapper.getInternalCodeByAlias("BP7FireProtectionClassPPC", "tuna", buildingDetails.Value)
                /*else if (buildingDetails.ID == FIRE_LINE_MATCH_LEVEL)
                    building.Location.FireDepartment_Ext = false */
            else  if (buildingDetails.ID == WIND_POOL)
                building.Location.WindpoolEligibility_Ext = (buildingDetails.Value) as Boolean
        }
      }
      if (propertyInformation.TerritoryDetails != null){
        for (territoryCodes in propertyInformation.TerritoryDetails) {
          logger.info("territoryCodes value:" + territoryCodes.Code)
          building.Location.TerritoryCode.Code = territoryCodes.Code
        }
      }
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getBOPInformation" + "For BuildingLocation ", this.IntrinsicType)
    } catch (exp: Exception)
    {
      logger.error("TunaGateway : Dwelling getBOPInformation  " + " : StackTrace = ", exp)
      throw exp
    }
  }
}