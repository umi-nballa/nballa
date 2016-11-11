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
  final static var ISO_360_VALUE = "ISO360ValuationId"
  final static var ESTIMATED_REPLACEMENT_COST = "CondoReplacementCost"
  final static var FIRE_DEPT_MATCH_LEVEL ="DistanceToMajorBOW"
  final static var FIRE_LINE_ADJUSTED_HAZARD ="FirelineAdjustedHazardScore"
  final static var FIRE_LINE_FUEL ="FirelineFuel"
  final static var FIRE_LINE_ACCESS ="FirelineAccess"
  final static var FIRE_LINE_SLOPE ="FirelineSlope"
  final static var FIRE_LINE_SHIA= "FirelineSHIA"
  private var _TUNAGateway = GatewayPlugin.makeTunaGateway()
  var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
  var baseState = {"CA", "FL", "NV", "NC", "HI", "TX"}
  var exteriorWallFinish_HI = {"AL","ASB","BAB","BPIN","BRED","CMP","COP","CTG","FCEM","FCEMS","LOG","RC","RMP","SHN","STU_FRM","T111","TPIN","TRED","VL","VLS","W","WSS"}
  var exteriorWallFinish_TX = {"FCEM","FCEMS","SBC","SBR","STU_FRM"}
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

              policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.Longitude_Ext = dwellingDetails.Longitude
              policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.Latitude_Ext = dwellingDetails.Latitude

              if (null != dwellingDetails.Datums && dwellingDetails.Datums.size() > 0) {
                for (dwell in dwellingDetails.Datums) {

                  if (dwell.ID == YEAR_BUILT && ("" != dwell.Value && null != dwell.Value ))
                    policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt = (dwell.Value) as Integer
                  else if (dwell.ID == STORIES_NUMBER && ("" != dwell.Value && null != dwell.Value )  )
                    policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber = typecodeMapper.getInternalCodeByAlias("NumberOfStories_HOE", "tuna", dwell.Value)
                  else if (dwell.ID == CONSTRUCTION_TYPE && ("" != dwell.Value && null != dwell.Value ) ) {
                      if (producerSelection.State.Code == "HI" && (dwell.Value =="FRP" || dwell.Value == "FRW" || dwell.Value =="SIP"))
                        policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = typecodeMapper.getInternalCodeByAlias("ConstructionType_HOE", "tuna" + "_" + producerSelection.State.Code, dwell.Value)
                      else
                        policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = typecodeMapper.getInternalCodeByAlias("ConstructionType_HOE", "tuna", dwell.Value)
                  }
                  else if (dwell.ID == EXTERIOR_WALL_FINISH && ("" != dwell.Value && null != dwell.Value ) ) {
                    if (producerSelection.State.Code == "HI"  && exteriorWallFinish_HI.contains(dwell.Value))
                       policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWallFinish_Ext = typecodeMapper.getInternalCodeByAlias("ExteriorWallFinish_Ext", "tuna" + "_" + producerSelection.State.Code, dwell.Value)
                    else if(producerSelection.State.Code == "TX"  && exteriorWallFinish_TX.contains(dwell.Value))
                      policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWallFinish_Ext = typecodeMapper.getInternalCodeByAlias("ExteriorWallFinish_Ext", "tuna" + "_" + producerSelection.State.Code, dwell.Value)
                    else
                       policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWallFinish_Ext = typecodeMapper.getInternalCodeByAlias("ExteriorWallFinish_Ext", "tuna", dwell.Value)
                   }
                  else if (dwell.ID == SQUARE_FOOTAGE && ("" != dwell.Value && null != dwell.Value )  )
                     policyPeriod.HomeownersLine_HOE.Dwelling.SquareFootage_Ext = (dwell.Value) as Integer
                  else if (dwell.ID == ROOF_TYPE && ("" != dwell.Value && null != dwell.Value )) {
                    if (producerSelection.State.Code == "CA" && dwell.Value == "G")
                      policyPeriod.HomeownersLine_HOE.Dwelling.RoofShape_Ext = typecodeMapper.getInternalCodeByAlias("RoofShape_Ext", "tuna" + "_" + producerSelection.State.Code, dwell.Value)
                    else
                      policyPeriod.HomeownersLine_HOE.Dwelling.RoofShape_Ext = typecodeMapper.getInternalCodeByAlias("RoofShape_Ext", "tuna", dwell.Value)
                  }
                  else if (dwell.ID == ROOF_COVER && ("" != dwell.Value && null != dwell.Value )  ) {    //mapping to material
                    if (baseState.contains(producerSelection.State.Code))
                      policyPeriod.HomeownersLine_HOE.Dwelling.RoofType = typecodeMapper.getInternalCodeByAlias("RoofType", "tuna" + "_" + producerSelection.State.Code, dwell.Value)
                    else
                       policyPeriod.HomeownersLine_HOE.Dwelling.RoofType = typecodeMapper.getInternalCodeByAlias("RoofType", "tuna", dwell.Value)
                  }
                  else if (dwell.ID == WIND_POOL && ("" != dwell.Value && null != dwell.Value )  )
                     policyPeriod.HomeownersLine_HOE.Dwelling.PropertyCovByStateWndstorm_Ext = (dwell.Value) as Boolean

                  else if (dwell.ID == PROTECTION_CLASS && ("" != dwell.Value && null != dwell.Value )  )
                     policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode = dwell.Value
                  else if (dwell.ID == ISO_360_VALUE && ("" != dwell.Value && null != dwell.Value )  )
                     policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ISO360ValueID_Ext = dwell.Value
                  else if (dwell.ID == ESTIMATED_REPLACEMENT_COST && ("" != dwell.Value && null != dwell.Value ) )
                     policyPeriod.HomeownersLine_HOE.Dwelling.ReplacementCost = dwell.Value
                  else if (dwell.ID == DISTANCE_TO_COAST &&  ("" != dwell.Value && null != dwell.Value )  )
                      policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistanceToCoast_Ext = dwell.Value
                  else if (dwell.ID == BCEG && ("" != dwell.Value && null != dwell.Value ) )
                     policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.BCEG_Ext = dwell.Value
                  else if(dwell.ID ==  FIRE_DEPT_MATCH_LEVEL && ("" != dwell.Value && null != dwell.Value )  )
                      policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FireDeptMatchLevel_Ext = typekey.FireDeptMatchLevel_Ext.TC_EXACT
                  else if(dwell.ID ==  FIRE_LINE_ADJUSTED_HAZARD && ("" != dwell.Value && null != dwell.Value )  )
                      policyPeriod.HomeownersLine_HOE.Dwelling.CAFirelineInfo.AdjustedHazardScore = dwell.Value
                  else if(dwell.ID ==  FIRE_LINE_FUEL && ("" != dwell.Value && null != dwell.Value )  )
                      policyPeriod.HomeownersLine_HOE.Dwelling.CAFirelineInfo.Fuel = dwell.Value
                  else if(dwell.ID ==  FIRE_LINE_ACCESS && ("" != dwell.Value && null != dwell.Value )  )
                      policyPeriod.HomeownersLine_HOE.Dwelling.CAFirelineInfo.Slope = dwell.Value
                  else if(dwell.ID ==  FIRE_LINE_SLOPE && ("" != dwell.Value && null != dwell.Value )  )
                      policyPeriod.HomeownersLine_HOE.Dwelling.CAFirelineInfo.Access = dwell.Value
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
      //throw exp
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
          if (buildingDetails.ID == FIRE_LINE_MATCH_LEVEL && ("" != buildingDetails.Value && null != buildingDetails.Value )) {
            building.FireDepartmentDistance_Ext = buildingDetails.Value
            building.Location.FireDepartment_Ext = buildingDetails.Value
          }
          else if (buildingDetails.ID == BCEG && ("" != buildingDetails.Value && null != buildingDetails.Value ))
            building.BldgCodeEffGrade = typecodeMapper.getInternalCodeByAlias("BP7BldgCodeEffectivenessGrade", "tuna", buildingDetails.Value)
          else if (buildingDetails.ID == PROTECTION_CLASS && ("" != buildingDetails.Value && null != buildingDetails.Value ))
              building.Location.FireProtectionClassPPC = typecodeMapper.getInternalCodeByAlias("BP7FireProtectionClassPPC", "tuna", buildingDetails.Value)
                /*else if (buildingDetails.ID == FIRE_LINE_MATCH_LEVEL)
                    building.Location.FireDepartment_Ext = false */
            else  if (buildingDetails.ID == WIND_POOL && ("" != buildingDetails.Value && null != buildingDetails.Value ))
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