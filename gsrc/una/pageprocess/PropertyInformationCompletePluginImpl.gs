package una.pageprocess

uses una.integration.mapping.tuna.TunaAppResponse
uses una.integration.service.gateway.plugin.GatewayPlugin
uses una.integration.service.gateway.tuna.TunaInterface
uses una.logging.UnaLoggerCategory
uses una.model.AddressDTO
uses una.model.PropertyDataModel

uses java.lang.Exception
uses java.lang.Integer
uses gw.xsd.w3c.soap11_encoding.anonymous.attributes.Boolean_Href

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
  var constructionType_HI ={"FRP","FRW","SIP"}



  //Instance call for TUNAGATEWAY

  property get TUNAGateway(): TunaInterface {
    return _TUNAGateway
  }



  /**
   * This function is to call getDwellingInformation Service to map dwelling screen
   */
  public function getDwellingInformation(policyPeriod: PolicyPeriod) {

    logger.debug(" Entering  " + CLASS_NAME + " :: " + " getDwellingInformation" + "For Dwelling ", this.IntrinsicType)
    var _address = new AddressDTO()
    logger.info("Account Number..." + policyPeriod.BaseState.Code)
    var producerSelection = policyPeriod.BaseState.Code
    for (location in policyPeriod.Policy.Account.AccountLocations) {
      logger.info("Primary Location:" + location.Primary + "Address Scrubbed: " + location.AddressScrub_Ext)
      if (location.Primary && location.AddressScrub_Ext){
        logger.info("Address.." + location.AddressLine1 + ".. " + location.City + " .." + location.State.DisplayName + " .." + location.PostalCode + " ...." + location.Primary)
        _address.AddressLine1 = location.AddressLine1
        _address.State = location.State.DisplayName
        _address.City = location.City
        _address.PostalCode = location.PostalCode
        _address.Country = location.Country.DisplayName
        try {
          var tunaResponse = TUNAGateway.fetchPropertyInformationComplete(_address)
          gw.transaction.Transaction.runWithNewBundle(\bun -> {
          policyPeriod = bun.add(policyPeriod)
          tunaLongitudeDetail(policyPeriod,tunaResponse)
          tunaLatitudeDetail(policyPeriod,tunaResponse)
          if (tunaResponse.TerritoryDetails != null){
             for (territoryCode in tunaResponse.TerritoryDetails index i) {
                logger.info("territoryCode value:" + territoryCode.Code)
                policyPeriod.HomeownersLine_HOE.Dwelling.PolicyLocations[i].TerritoryCodes[i].Code = territoryCode.Code
              }
            }
            if (null != tunaResponse.Datums && tunaResponse.Datums.size() > 0) {
              for (dwell in tunaResponse.Datums) {
                if (dwell.ID == YEAR_BUILT)
                  tunaYearBuiltDetail(policyPeriod,dwell)
                else if (dwell.ID == PROTECTION_CLASS)
                  tunaProtectionClassDetail(policyPeriod,dwell)
                else if (dwell.ID == ISO_360_VALUE )
                  tunaISO360Detail(policyPeriod,dwell)
                else if (dwell.ID == ESTIMATED_REPLACEMENT_COST )
                  tunaEstReplacementCostDetail(policyPeriod,dwell)
                else if (dwell.ID == DISTANCE_TO_COAST )
                  tunaDistToCoastDetail(policyPeriod,dwell)
                else if (dwell.ID == BCEG)
                  tunaBCEGDetail(policyPeriod,dwell)
                else if(dwell.ID ==  FIRE_DEPT_MATCH_LEVEL)
                  tunaFireDeptMatchLineLevelDetail(policyPeriod,dwell)
                else if(dwell.ID ==  FIRE_LINE_ADJUSTED_HAZARD )
                  tunaFireHazardDetail(policyPeriod,dwell)
                else if(dwell.ID ==  FIRE_LINE_FUEL)
                  tunaFireFuelDetail(policyPeriod,dwell)
                else if(dwell.ID ==  FIRE_LINE_ACCESS )
                  tunaFireAccessDetail(policyPeriod,dwell)
                else if(dwell.ID ==  FIRE_LINE_SLOPE )
                  tunaFireSlopeDetail(policyPeriod,dwell)

              }
            }
          })
        }catch (exp: Exception) {
          logger.error("TunaGateway : Dwelling  Information " + " : StackTrace = ", exp)
        }
      }
    }
    logger.debug(" Leaving  " + CLASS_NAME + " :: " + " getDwellingInformation" + "For Dwelling ", this.IntrinsicType)

  }

/**
 * This function is to call GetPropertyInformationComplete Service to map dwelling construction screen
 */
   public function getDwellingConstructionInformation(policyPeriod: PolicyPeriod) {

        logger.debug(" Entering  " + CLASS_NAME + " :: " + " getDwellingConstructionInformation" + "For DwellingConstruction ", this.IntrinsicType)
        var _address = new AddressDTO()
        logger.info("Base State..." + policyPeriod.BaseState.Code)
        var producerSelection = policyPeriod.BaseState.Code
        for (location in policyPeriod.Policy.Account.AccountLocations) {
        logger.info("Primary Location:" + location.Primary + "Address Scrubbed: " + location.AddressScrub_Ext)
        if (location.Primary && location.AddressScrub_Ext){
        logger.info("Address.." + location.AddressLine1 + ".. " + location.City + " .." + location.State.DisplayName + " .." + location.PostalCode + " ...." + location.Primary)
        _address.AddressLine1 = location.AddressLine1
        _address.State = location.State.DisplayName
        _address.City = location.City
        _address.PostalCode = location.PostalCode
        _address.Country = location.Country.DisplayName
        try {
        var tunaResponse = TUNAGateway.fetchPropertyInformationComplete(_address)
        gw.transaction.Transaction.runWithNewBundle(\bun -> {
        policyPeriod = bun.add(policyPeriod)
        if (null != tunaResponse.Datums && tunaResponse.Datums.size() > 0) {
            for (dwell in tunaResponse.Datums) {
              if (dwell.ID == STORIES_NUMBER)
              tunaStoryNumDetail(policyPeriod,dwell)
              else if (dwell.ID == CONSTRUCTION_TYPE)
              tunaConstructionTypeDetail(policyPeriod,dwell,producerSelection)
              else if (dwell.ID == EXTERIOR_WALL_FINISH)
              tunaExteriorWallDetail(policyPeriod,dwell,producerSelection)
              else if (dwell.ID == SQUARE_FOOTAGE)
              tunaSquareFootDetail(policyPeriod,dwell)
              else if (dwell.ID == ROOF_TYPE )
              tunaRoofTypeDetail(policyPeriod,dwell,producerSelection)
              else if (dwell.ID == ROOF_COVER)  //mapping to material
               tunaRoofMaterialDetail(policyPeriod,dwell,producerSelection)
              else if (dwell.ID == WIND_POOL)
              tunaWindPoolDetail(policyPeriod,dwell)
             }
          }
        })
      }catch (exp: Exception) {
        logger.error("TunaGateway : Dwelling Construction Information " + " : StackTrace = ", exp)
       }
      }
     }
    logger.debug(" Leaving  " + CLASS_NAME + " :: " + " getDwellingConstructionInformation" + "For DwellingConstruction ", this.IntrinsicType)

   }


  /**
   * This function is to map Longitude in dwelling screen
   */
  private function tunaLongitudeDetail(policyPeriod: PolicyPeriod,tunaResponse : TunaAppResponse){
    try{
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.Longitude_Ext = tunaResponse.Longitude
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaLongitudeDetails " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Latitude in dwelling screen
   */
  private function tunaLatitudeDetail(policyPeriod: PolicyPeriod,tunaResponse : TunaAppResponse){
    try{
      policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.Latitude_Ext = tunaResponse.Latitude
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaLatitudeDetails " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Year Build in dwelling Construction screen
   */
  private function tunaYearBuiltDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)){
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt = (propertyDataModel.Value) as Integer
      }
      }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaYearBuiltDetails " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Stories Number details in dwelling Construction screen
   */
  private function tunaStoryNumDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)){
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
          policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber = typecodeMapper.getInternalCodeByAlias("NumberOfStories_HOE", "tuna", propertyDataModel.Value)
        }
      }

    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaStoryNumDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Construction Type  in dwelling Construction screen
   */
  private function tunaConstructionTypeDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel,producerSelection: String){
    try{
      if(isNotNull(propertyDataModel)){
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        if (producerSelection == "HI" && constructionType_HI.contains(propertyDataModel.Value))
          policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = typecodeMapper.getInternalCodeByAlias("ConstructionType_HOE", "tuna" + "_" + producerSelection, propertyDataModel.Value)
        else
          policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = typecodeMapper.getInternalCodeByAlias("ConstructionType_HOE", "tuna", propertyDataModel.Value)
        }
      }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaConstructionTypeDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Exterior wall Details in dwelling Construction screen
   */
  private function tunaExteriorWallDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel,producerSelection: String){
    try{
      if(isNotNull(propertyDataModel)) {
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        if (producerSelection == "HI"  && exteriorWallFinish_HI.contains(propertyDataModel.Value))
          policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWallFinish_Ext = typecodeMapper.getInternalCodeByAlias("ExteriorWallFinish_Ext", "tuna" + "_" + producerSelection, propertyDataModel.Value)
        else if(producerSelection == "TX"  && exteriorWallFinish_TX.contains(propertyDataModel.Value))
          policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWallFinish_Ext = typecodeMapper.getInternalCodeByAlias("ExteriorWallFinish_Ext", "tuna" + "_" + producerSelection, propertyDataModel.Value)
        else
          policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWallFinish_Ext = typecodeMapper.getInternalCodeByAlias("ExteriorWallFinish_Ext", "tuna", propertyDataModel.Value)
        }
      }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaExteriorWallDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Roof Type in dwelling Construction screen
   */
  private function tunaRoofTypeDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel,producerSelection: String){
    try{
      if(isNotNull(propertyDataModel)){
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        if (producerSelection == "CA" && propertyDataModel.Value == "G")
          policyPeriod.HomeownersLine_HOE.Dwelling.RoofShape_Ext = typecodeMapper.getInternalCodeByAlias("RoofShape_Ext", "tuna" + "_" + producerSelection, propertyDataModel.Value)
        else
          policyPeriod.HomeownersLine_HOE.Dwelling.RoofShape_Ext = typecodeMapper.getInternalCodeByAlias("RoofShape_Ext", "tuna", propertyDataModel.Value)
        }
      }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaRoofTypeDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Roof Material in dwelling Construction screen
   */
  private function tunaRoofMaterialDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel,producerSelection: String){
    try{
      if(isNotNull(propertyDataModel)){
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        if (baseState.contains(producerSelection))
          policyPeriod.HomeownersLine_HOE.Dwelling.RoofType = typecodeMapper.getInternalCodeByAlias("RoofType", "tuna" + "_" + producerSelection, propertyDataModel.Value)
        else
          policyPeriod.HomeownersLine_HOE.Dwelling.RoofType = typecodeMapper.getInternalCodeByAlias("RoofType", "tuna", propertyDataModel.Value)
        }
      }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaRoofMaterialDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Square Footage details in dwelling Construction screen
   */
  private function tunaSquareFootDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)) {
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        policyPeriod.HomeownersLine_HOE.Dwelling.SquareFootage_Ext = (propertyDataModel.Value) as Integer
        }
    }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaSquareFootDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map wind pool value in dwelling screen
   */
  private function tunaWindPoolDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)){
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        policyPeriod.HomeownersLine_HOE.Dwelling.PropertyCovByStateWndstorm_Ext = (propertyDataModel.Value) as Boolean
          }
        }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaWindPoolDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Protection Class details in dwelling screen
   */
  private function tunaProtectionClassDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)){
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode = propertyDataModel.Value
        }
    }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaProtectionClassDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map ISO360 Value in dwelling screen
   */
  private function tunaISO360Detail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)){
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ISO360ValueID_Ext = propertyDataModel.Value
        }
          }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaISO360Detail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Estimated Replacement Cost value in dwelling screen
   */
  private function tunaEstReplacementCostDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)){
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        policyPeriod.HomeownersLine_HOE.Dwelling.ReplacementCost = propertyDataModel.Value
        }
      }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaEstReplacementCostDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Distance To Coast in dwelling screen
   */
  private function tunaDistToCoastDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)){
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistanceToCoast_Ext = propertyDataModel.Value
        }
      }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaDistToCoastDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map BCEG value in dwelling screen
   */
  private function tunaBCEGDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)) {
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.BCEG_Ext = propertyDataModel.Value
        }
      }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaBCEGDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map FireLine Match Level in dwelling screen
   */
  private function tunaFireDeptMatchLineLevelDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)){
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FireDeptMatchLevel_Ext = typekey.FireDeptMatchLevel_Ext.TC_USERENTERED
        }
      }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaFireDeptMatchLineLevelDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Adjust Hazard Score info in dwelling screen for California
   */
  private function tunaFireHazardDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
  try{
    if(isNotNull(propertyDataModel)) {
      if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
        //TODO
      } else{
      policyPeriod.HomeownersLine_HOE.Dwelling.CAFirelineInfo.AdjustedHazardScore = propertyDataModel.Value
      }
    }
  }catch(exp :Exception){
    logger.error("GetPropertyInformationComplete : tunaFireHazardDetail " + " : StackTrace = ", exp)
  }
 }

  /**
   * This function is to map Access info in dwelling screen for California
   */
  private function tunaFireAccessDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)) {
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        policyPeriod.HomeownersLine_HOE.Dwelling.CAFirelineInfo.Access = propertyDataModel.Value
        }
      }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaFireAccessDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Slope info in dwelling screen for California
   */
  private function tunaFireSlopeDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)) {
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        policyPeriod.HomeownersLine_HOE.Dwelling.CAFirelineInfo.Slope = propertyDataModel.Value
        }
      }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaFireSlopeDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Fuel info in dwelling screen for California
   */
  private function tunaFireFuelDetail(policyPeriod: PolicyPeriod,propertyDataModel : PropertyDataModel){
    try{
      if(isNotNull(propertyDataModel)){
        if(propertyDataModel.ListValue != null && propertyDataModel.ListValue.size() > 0) {
          //TODO
        } else{
        policyPeriod.HomeownersLine_HOE.Dwelling.CAFirelineInfo.Fuel = propertyDataModel.Value
        }
      }
    }catch(exp :Exception){
      logger.error("GetPropertyInformationComplete : tunaFireFuelDetail " + " : StackTrace = ", exp)
    }
  }

  private  function isNotNull(propertyDataModel : PropertyDataModel) : boolean {
    if("" != propertyDataModel.Value && null != propertyDataModel.Value )
      return true
    return false
  }

  /**
   * This function is to call GetPropertyInformation Service which is for BOP Product
   * Below method is a Post On Change when user enters value in YearBuilt field
   */
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