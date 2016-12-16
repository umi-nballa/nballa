package una.pageprocess

uses gw.api.util.LocationUtil
uses una.integration.mapping.tuna.TunaAppResponse
uses una.integration.service.gateway.plugin.GatewayPlugin
uses una.integration.service.gateway.tuna.TunaInterface
uses una.logging.UnaLoggerCategory
uses una.model.AddressDTO
uses java.lang.Exception
uses java.lang.Integer
uses una.integration.mapping.tuna.TunaAppResponseSessionUtil

/**
 * This Class is  for calling  one of the TUNA Service GetPropertyInformationComplete
 * Created By: ptheegala
 * Created On: 6/1/16
 *  TODO refactor the code
 */
class PropertyInformationCompletePluginImpl {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  private static final var CLASS_NAME = PropertyInformationCompletePluginImpl.Type.DisplayName
  private var _TUNAGateway = GatewayPlugin.makeTunaGateway()
  var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
  var baseState = {"CA", "FL", "NV", "NC", "HI", "TX"}
  var exteriorWallFinish_HI = {"AL", "ASB", "BAB", "BPIN", "BRED", "CMP", "COP", "CTG", "FCEM", "FCEMS", "LOG", "RC", "RMP", "SHN", "STU_FRM", "T111", "TPIN", "TRED", "VL", "VLS", "W", "WSS"}
  var exteriorWallFinish_TX = {"FCEM", "FCEMS", "SBC", "SBR", "STU_FRM"}
  var constructionType_HI = {"FRP", "FRW", "SIP"}
  var _address: AddressDTO
  var tunaResponse: TunaAppResponse
  var tunaAppSession : TunaAppResponseSessionUtil

  construct(){
    tunaAppSession = new TunaAppResponseSessionUtil()
  }


  //Instance call for Tuna Gateway
  property get TUNAGateway(): TunaInterface {

    return _TUNAGateway
  }

  /**
   * This function is to get tuna information and add it to user session
   */
  public function getTunaInformation(policyPeriod: PolicyPeriod): TunaAppResponse {

    var tunaAppObject : TunaAppResponse

    tunaAppObject   = tunaAppSession.getTunaAppFromSession(policyPeriod)

    if(tunaAppObject == null)
     tunaAppObject = retrieveTunaInfo(policyPeriod)

    if(tunaAppObject != null)
     tunaAppSession.initializeSessionVar(policyPeriod,tunaAppObject)


     return tunaAppObject
  }


  /*
  * This function is for new location to remove and remap tuna information
   */

  public function removeAndRemapTunaAppResponse(policyPeriod : PolicyPeriod): TunaAppResponse {
   var tunaAppObject : TunaAppResponse

   try{
   // policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.remove()

    tunaAppSession.removeFromSession(policyPeriod)

    tunaAppObject = getTunaInformation(policyPeriod)
   }
    catch(exp : Exception){
       logger.error("Exception Trying to map Tuna Info for new Location = ", exp.StackTraceAsString)

    }
    return tunaAppObject
  }





  public function retrieveTunaInfo(policyPeriod : PolicyPeriod): TunaAppResponse{

    if(!(policyPeriod.Status == typekey.PolicyPeriodStatus.TC_DRAFT &&policyPeriod.Job.DisplayType == typekey.Job.TC_SUBMISSION.Code)){
       return null
      }
     logger.debug(" Entering  " + CLASS_NAME + " :: " + " getDwellingInformation" + "For Dwelling ", this.IntrinsicType)
    _address = new AddressDTO()
    var location = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation
      _address.AddressLine1 = location.AddressLine1
      _address.State = location.State.DisplayName
      _address.City = location.City
      _address.PostalCode = location.PostalCode
      _address.Country = location.Country.DisplayName
      try {
        tunaResponse = TUNAGateway.fetchPropertyInformationComplete(_address)
        policyPeriod.createCustomHistoryEvent(CustomHistoryType.TC_TUNAINITIATED, \ -> displaykey.Web.SubmissionWizard.Tuna.EventMsg("fetchPropertyInformationComplete",tunaResponse.MetricsVersion.first().NamedValue))
          if(tunaResponse == null)
          LocationUtil.addRequestScopedWarningMessage("Unable to retrive information from TUNA")

      } catch (exp: Exception) {
        LocationUtil.addRequestScopedWarningMessage("Unable to retrive information from TUNA")
        logger.error("TunaGateway : Dwelling  Information " + " : StackTrace = ", exp)
      }
    logger.debug(" Leaving  " + CLASS_NAME + " :: " + " getDwellingInformation" + "For Dwelling ", this.IntrinsicType)
    return tunaResponse
  }

  /**
   * This function is to call GetPropertyInformationComplete Service to map dwelling construction screen
   */
  public function getDwellingConstructionInformation(policyPeriod: PolicyPeriod): TunaAppResponse {
    if(!(policyPeriod.Status ==  typekey.PolicyPeriodStatus.TC_DRAFT)){
      return null
    }
    logger.info(" Entering  " + CLASS_NAME + " :: " + " getDwellingConstructionInformation" + "For DwellingConstruction ", this.IntrinsicType)
    _address = new AddressDTO()
    var location = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation
  //  if (location.AccountLocation.addressScrub_Ext) {
      _address.AddressLine1 = location.AddressLine1
      _address.State = location.State.DisplayName
      _address.City = location.City
      _address.PostalCode = location.PostalCode
      _address.Country = location.Country.DisplayName
      try {
        tunaResponse = TUNAGateway.fetchPropertyInformationComplete(_address)
        policyPeriod.createCustomHistoryEvent(CustomHistoryType.TC_TUNAINITIATED, \ -> displaykey.Web.SubmissionWizard.Tuna.EventMsg("fetchPropertyInformationComplete",tunaResponse.MetricsVersion.first().NamedValue))
        if (tunaResponse != null) {
//          tunaStoryNumDetail(policyPeriod, tunaResponse)
//          tunaConstructionTypeDetail(policyPeriod, tunaResponse)
//          tunaExteriorWallDetail(policyPeriod, tunaResponse)
//          tunaSquareFootDetail(policyPeriod, tunaResponse)
//          tunaRoofTypeDetail(policyPeriod, tunaResponse)
//          tunaRoofMaterialDetail(policyPeriod, tunaResponse)
//          tunaWindPoolDetail(policyPeriod, tunaResponse)
        } else {
          LocationUtil.addRequestScopedWarningMessage("Unable to retrive information from TUNA")
        }
      } catch (exp: Exception) {
        LocationUtil.addRequestScopedWarningMessage("Unable to retrive information from TUNA")
        logger.error("TunaGateway : Dwelling Construction Information " + " : StackTrace = ", exp)
      }
//    }else{
//      LocationUtil.addRequestScopedWarningMessage("Unable to call TUNA, Since the address is not scrubbed")
//    }
    logger.info(" Leaving  " + CLASS_NAME + " :: " + " getDwellingConstructionInformation" + "For DwellingConstruction ", this.IntrinsicType)
    return tunaResponse
  }

  /**
   * This function is to map Longitude in dwelling screen
   */
  private function tunaLongitudeDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.Longitude != null)
        policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.Longitude_Ext = res.Longitude
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaLongitudeDetails " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Latitude in dwelling screen
   */
  private function tunaLatitudeDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.Latitude != null)
        policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.Latitude_Ext = res.Latitude
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaLatitudeDetails " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map tunaTerritoryCode in dwelling screen
   */
  private function tunaTerritoryCode(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.TerritoryCodes != null){
        if (res.TerritoryCodes.size() > 1) {
         /* for (code in res.TerritoryCodes index i) {
            policyPeriod.HomeownersLine_HOE.Dwelling.PolicyLocations[i].TerritoryCodes[i].Code = code
          }*/
        } else {
          policyPeriod.HomeownersLine_HOE.Dwelling.PolicyLocations[0].TerritoryCodes[0].Code = res.TerritoryCodes[0]
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaTerritoryCode " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Year Build in dwelling Construction screen
   */
  private function tunaYearBuiltDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.YearBuilt != null){
        if (res.YearBuilt.size() > 1) {
          //TODO
        } else {
          policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt = res.YearBuilt[0].Value
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaYearBuiltDetails " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Stories Number details in dwelling Construction screen
   */
  private function tunaStoryNumDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.StoryNumber != null){
        if (res.StoryNumber.size() > 1) {
          //TODO
        } else {
          policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber = typecodeMapper.getInternalCodeByAlias("NumberOfStories_HOE", "tuna", res.StoryNumber[0].Value)
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaStoryNumDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Construction Type  in dwelling Construction screen
   */
  private function tunaConstructionTypeDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.ConstructionType != null){
        if (res.ConstructionType.size() > 1) {
          //TODO
        } else {
          if (policyPeriod.BaseState.Code == "HI" && constructionType_HI.contains(res.ConstructionType[0].Value))
            policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = typecodeMapper.getInternalCodeByAlias("ConstructionType_HOE", "tuna" + "_" + policyPeriod.BaseState.Code, res.ConstructionType[0].Value)
          else
            policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = typecodeMapper.getInternalCodeByAlias("ConstructionType_HOE", "tuna", res.ConstructionType[0].Value)
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaConstructionTypeDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Exterior wall Details in dwelling Construction screen
   */
  private function tunaExteriorWallDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.WallFinish != null){
        if (res.WallFinish.size() > 1) {
          //TODO
        } else {
          if (policyPeriod.BaseState.Code == "HI" && exteriorWallFinish_HI.contains(res.WallFinish[0].Value))
            policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWallFinish_Ext = typecodeMapper.getInternalCodeByAlias("ExteriorWallFinish_Ext", "tuna" + "_" + policyPeriod.BaseState.Code, res.WallFinish[0].Value)
          else if (policyPeriod.BaseState.Code == "TX" && exteriorWallFinish_TX.contains(res.WallFinish[0].Value))
            policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWallFinish_Ext = typecodeMapper.getInternalCodeByAlias("ExteriorWallFinish_Ext", "tuna" + "_" + policyPeriod.BaseState.Code, res.WallFinish[0].Value)
          else
            policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWallFinish_Ext = typecodeMapper.getInternalCodeByAlias("ExteriorWallFinish_Ext", "tuna", res.WallFinish[0].Value)
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaExteriorWallDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Roof Type in dwelling Construction screen
   */
  private function tunaRoofTypeDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.RoofType != null){
        if (res.RoofType.size() > 1) {
          //TODO
        } else {
          if (policyPeriod.BaseState.Code == "CA" && res.RoofType[0].Value == "G")
            policyPeriod.HomeownersLine_HOE.Dwelling.RoofShape_Ext = typecodeMapper.getInternalCodeByAlias("RoofShape_Ext", "tuna" + "_" + policyPeriod.BaseState.Code, res.RoofType[0].Value)
          else
            policyPeriod.HomeownersLine_HOE.Dwelling.RoofShape_Ext = typecodeMapper.getInternalCodeByAlias("RoofShape_Ext", "tuna", res.RoofType[0].Value)
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaRoofTypeDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Roof Material in dwelling Construction screen
   */
  private function tunaRoofMaterialDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.RoofCover != null) {
        if (res.RoofCover.size() > 1) {
          //TODO
        } else {
          if (baseState.contains(policyPeriod.BaseState.Code))
            policyPeriod.HomeownersLine_HOE.Dwelling.RoofType = typecodeMapper.getInternalCodeByAlias("RoofType", "tuna" + "_" + policyPeriod.BaseState.Code, res.RoofCover[0].Value)
          else
            policyPeriod.HomeownersLine_HOE.Dwelling.RoofType = typecodeMapper.getInternalCodeByAlias("RoofType", "tuna", res.RoofCover[0].Value)
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaRoofMaterialDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Square Footage details in dwelling Construction screen
   */
  private function tunaSquareFootDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.SquareFootage != null){
        if (res.SquareFootage.size() > 1) {
          //TODO
        } else {
          policyPeriod.HomeownersLine_HOE.Dwelling.SquareFootage_Ext = (res.SquareFootage[0].Value) as Integer
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaSquareFootDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map wind pool value in dwelling screen
   */
  private function tunaWindPoolDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.WindPool != null){
        if (res.WindPool.size() > 1) {
          //TODO
        } else {
          policyPeriod.HomeownersLine_HOE.Dwelling.PropertyCovByStateWndstorm_Ext = (res.WindPool[0].Value) as Boolean
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaWindPoolDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Protection Class details in dwelling screen
   */
  private function tunaProtectionClassDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.ProtectionClass != null) {
        if (res.ProtectionClass.size() > 1) {
          //TODO
        } else {
          policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode = (res.ProtectionClass[0].Value) as String
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaProtectionClassDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map ISO360 Value in dwelling screen
   */
  private function tunaISO360Detail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.ISO360Value != null) {
        if (res.ISO360Value.size() > 1) {
          //TODO
        } else {
          policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ISO360ValueID_Ext = (res.ISO360Value[0].Value) as String
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaISO360Detail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Estimated Replacement Cost value in dwelling screen
   */
  private function tunaEstReplacementCostDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.EstimatedReplacementCost != null){
        if (res.EstimatedReplacementCost.size() > 1) {
          //TODO
        } else {
          policyPeriod.HomeownersLine_HOE.Dwelling.ReplacementCost = (res.EstimatedReplacementCost[0].Value) as Integer
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaEstReplacementCostDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Distance To Coast in dwelling screen
   */
  private function tunaDistToCoastDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.DistanceToCoast != null){
        if (res.DistanceToCoast.size() > 1) {
          //TODO
        } else {
      //    if(res.DistanceToCoast[0].Value != "")
      //    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistToCoastTunaReturned_Ext = (res.DistanceToCoast[0].Value) as Integer
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaDistToCoastDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map BCEG value in dwelling screen
   */
  private function tunaBCEGDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.BCEGGrade != null) {
        if (res.BCEGGrade.size() > 1) {
          //TODO
        } else {
          //policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.BCEGTunaReturned_Ext= (res.BCEGGrade[0].Value) as String
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaBCEGDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map FireLine Match Level in dwelling screen
   */
//  private function tunaFireDeptMatchLineLevelDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
//    try {
//      if (res.FireDepartmentMatchLevel != null){
//        if (res.FireDepartmentMatchLevel.size() > 1) {
//          //TODO
//        } else {
//          policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FireDeptMatchLevel_Ext = typekey.FireDeptMatchLevel_Ext.TC_USERENTERED
//        }
//      }
//    } catch (exp: Exception) {
//      logger.error("GetPropertyInformationComplete : tunaFireDeptMatchLineLevelDetail " + " : StackTrace = ", exp)
//    }
//  }

  /**
   * This function is to map Adjust Hazard Score info in dwelling screen for California
   */
  private function tunaFireHazardDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.AdjustedHazard != null) {
        if (res.AdjustedHazard.size() > 1) {
          //TODO
        } else {
          //policyPeriod.HomeownersLine_HOE.Dwelling.CAFirelineInfo.AdjustedHazardScore = (res.AdjustedHazard[0].Value) as String
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaFireHazardDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Access info in dwelling screen for California
   */
  private function tunaFireAccessDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.FireLineAccess != null) {
        if (res.FireLineAccess.size() > 1) {
          //TODO
        } else {
        //  policyPeriod.HomeownersLine_HOE.Dwelling.CAFirelineInfo.Access = (res.FireLineAccess[0].Value) as String
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaFireAccessDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Slope info in dwelling screen for California
   */
  private function tunaFireSlopeDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.FireLineSlope != null){
        if (res.FireLineSlope.size() > 1) {
          //TODO
        } else {
          //policyPeriod.HomeownersLine_HOE.Dwelling.CAFirelineInfo.Slope = (res.FireLineSlope[0].Value) as String
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaFireSlopeDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Fuel info in dwelling screen for California
   */
  private function tunaFireFuelDetail(policyPeriod: PolicyPeriod, res: TunaAppResponse) {
    try {
      if (res.FireLineFuel != null){
        if (res.FireLineFuel.size() > 1) {
          //TODO
        } else {
         // policyPeriod.HomeownersLine_HOE.Dwelling.CAFirelineInfo.Fuel = (res.FireLineFuel[0].Value) as String
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformationComplete : tunaFireFuelDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to call GetPropertyInformation Service which is for BOP Product
   * Below method is a Post On Change when user enters value in YearBuilt field
   */
  public function getBOPInformation(building: BP7Building) {

     _address = new AddressDTO()
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getBOPInformation" + "For BuildingLocation ", this.IntrinsicType)
      _address.AddressLine1 = building.Location.PolicyLocation.AddressLine1
      _address.City = building.Location.PolicyLocation.City
      _address.State = building.Location.PolicyLocation.State.Code
      _address.PostalCode = building.Location.PolicyLocation.PostalCode
      _address.YearBuilt = (building.YearBuilt_Ext) as String
      try {
        tunaResponse = TUNAGateway.fetchPropertyInformation(_address)

        if (tunaResponse == null)
          LocationUtil.addRequestScopedWarningMessage("Unable to retrive information from TUNA")

        tunaStoryNumDetail(building,tunaResponse)
        tunaSquareFootDetail(building,tunaResponse)
        tunaBCEGDetail(building,tunaResponse)

        tunaProtectionClassDetail(building,tunaResponse)
        tunaConstructionTypeDetail(building,tunaResponse)
        tunaWindPoolDetail(building,tunaResponse)
        tunaTerritoryCode(building,tunaResponse)
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getBOPInformation" + "For BuildingLocation ", this.IntrinsicType)
    } catch (exp: Exception) {
      LocationUtil.addRequestScopedWarningMessage("Unable to retrive information from TUNA")
      logger.error("TunaGateway :  getBOPInformation  " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map StoryNumber value in BOP Buildings screen
   */
  private function tunaStoryNumDetail(building: BP7Building, res: TunaAppResponse) {
    try {
      if (res.StoryNumber != null) {
        if (res.StoryNumber.size() > 1) {
          //TODO
        } else {
            building.NoOfStories_Ext = (res.StoryNumber[0].Value) as Integer
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation - BOP : tunaStoryNumDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map SquareFootage value in BOP Buildings screen
   */
  private function tunaSquareFootDetail(building: BP7Building, res: TunaAppResponse) {
    try {
      if (res.SquareFootage != null) {
        if (res.SquareFootage.size() > 1) {
          //TODO
        } else {
            building.BuildingSqFootage_Ext = (res.SquareFootage[0].Value) as Integer
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation - BOP : tunaSquareFootDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map BCEG value in BOP Buildings screen
   */
  private function tunaBCEGDetail(building: BP7Building, res: TunaAppResponse) {
    try {
      if (res.BCEGGrade != null) {
        if (res.BCEGGrade.size() > 1) {
          //TODO
        } else {
           building.BldgCodeEffGrade = typecodeMapper.getInternalCodeByAlias("BP7BldgCodeEffectivenessGrade", "tuna", (res.BCEGGrade[0].Value) as String)
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation - BOP : tunaBCEGDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map FireDepartmentMatchLevel value in BOP Buildings screen
   */
//  private function tunaFireDeptMatchLineLevelDetail(building: BP7Building, res: TunaAppResponse) {
//    try {
//      if (res.FireDepartmentMatchLevel != null) {
//        if (res.FireDepartmentMatchLevel.size() > 1) {
//          //TODO
//        } else {
//            building.FireDepartmentDistance_Ext = (res.FireDepartmentMatchLevel[0].Value) as Boolean
//        }
//      }
//    } catch (exp: Exception) {
//      logger.error("GetPropertyInformation - BOP : tunaFireDeptMatchLineLevelDetail " + " : StackTrace = ", exp)
//    }
//  }

  /**
   * This function is to map ProtectionClass value in BOP Buildings screen
   */
  private function tunaProtectionClassDetail(building: BP7Building, res: TunaAppResponse) {
    try {
      if (res.ProtectionClass != null) {
        if (res.ProtectionClass.size() > 1) {
          //TODO
        } else {
          building.Location.FireProtectionClassPPC = typecodeMapper.getInternalCodeByAlias("BP7FireProtectionClassPPC", "tuna", (res.ProtectionClass[0].Value) as String)
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation - BOP : tunaProtectionClassDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map ConstructionType value in BOP Buildings screen
   */
  private function tunaConstructionTypeDetail(building: BP7Building, res: TunaAppResponse) {
    try {
      if (res.ConstructionType != null) {
        if (res.ConstructionType.size() > 1) {
          //TODO
        } else {
            building.ConstructionType = typecodeMapper.getInternalCodeByAlias("BP7ConstructionType", "tuna", (res.ConstructionType[0].Value) as String)
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation - BOP : tunaConstructionTypeDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map WindPool value in BOP Buildings screen
   */
  private function tunaWindPoolDetail(building: BP7Building, res: TunaAppResponse) {
    try {
      if (res.WindPool != null) {
        if (res.WindPool.size() > 1) {
          //TODO
        } else {
            building.Location.WindpoolEligibility_Ext = (res.WindPool[0].Value) as Boolean
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation - BOP : tunaWindPoolDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map TerritoryCode value in BOP Buildings screen
   */
  private function tunaTerritoryCode(building: BP7Building, res: TunaAppResponse) {
    try {
      if (res.TerritoryCodes != null) {
        if (res.TerritoryCodes.size() > 1) {
          //TODO
        } else {
            building.Location.TerritoryCode.Code = (res.TerritoryCodes[0]) as String
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation - BOP : tunaTerritoryCode " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to call GetPropertyInformation Service which is for CPP Product
   * Below method is a Post On Change when user enters value in YearBuilt field
   */
  public function getCPPInformation(cpBuilding: CPBuilding) {

    _address = new AddressDTO()
    logger.info(" Entering  " + CLASS_NAME + " :: " + " getCPPInformation" + "For BuildingLocation ", this.IntrinsicType)
    _address.AddressLine1 = cpBuilding.CPLocation.PolicyLocation.AddressLine1
    _address.City = cpBuilding.CPLocation.PolicyLocation.City
    _address.State = cpBuilding.CPLocation.PolicyLocation.State.Code
    _address.PostalCode = cpBuilding.CPLocation.PolicyLocation.PostalCode
    _address.YearBuilt = (cpBuilding.Building.YearBuilt) as String
    try {
      tunaResponse = TUNAGateway.fetchPropertyInformation(_address)
      cpBuilding.CPLocation.Branch.createCustomHistoryEvent(CustomHistoryType.TC_TUNAINITIATED, \ -> displaykey.Web.SubmissionWizard.Tuna.EventMsg("fetchPropertyInformation",tunaResponse.MetricsVersion.first().NamedValue))
      tunaLongitudeDetail(cpBuilding,tunaResponse)
      tunaLatitudeDetail(cpBuilding,tunaResponse)
      tunaStoryNumDetail(cpBuilding,tunaResponse)
      tunaSquareFootDetail(cpBuilding,tunaResponse)
      tunaBCEGDetail(cpBuilding,tunaResponse)
      tunaProtectionClassDetail(cpBuilding,tunaResponse)
      tunaConstructionTypeDetail(cpBuilding,tunaResponse)
      tunaTerritoryCode(cpBuilding,tunaResponse)
      tunaRoofTypeDetail(cpBuilding,tunaResponse)
      tunaRoofMaterialDetail(cpBuilding,tunaResponse)
    logger.info(" Entering  " + CLASS_NAME + " :: " + " getCPPInformation" + "For BuildingLocation ", this.IntrinsicType)
    } catch (exp: Exception) {
      logger.error("TunaGateway :  getCPPInformation  " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Longitude in CPP Building screen
   */
  private function tunaLongitudeDetail(cpBuilding: CPBuilding, res: TunaAppResponse) {
    try {
      if (res.Longitude != null)
         cpBuilding.CPLocation.PolicyLocation.Longitude_Ext = (res.Longitude) as String
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation  - CPP : tunaLongitudeDetails " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Latitude in CPP Building screen
   */
  private function tunaLatitudeDetail(cpBuilding: CPBuilding, res: TunaAppResponse) {
    try {
      if (res.Latitude != null)
        cpBuilding.CPLocation.PolicyLocation.Latitude_Ext = (res.Latitude) as String
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation  - CPP : tunaLatitudeDetails " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map StoryNumber value in CPP Building screen
   */
  private function tunaStoryNumDetail(cpBuilding: CPBuilding, res: TunaAppResponse) {
    try {
      if (res.StoryNumber != null) {
        if (res.StoryNumber.size() > 1) {
          //TODO
        } else {
          cpBuilding.Building.NumStories = (res.StoryNumber[0].Value) as Integer
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation  - CPP : tunaStoryNumDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map SquareFootage value in CPP Building screen
   */
  private function tunaSquareFootDetail(cpBuilding: CPBuilding, res: TunaAppResponse) {
    try {
      if (res.SquareFootage != null) {
        if (res.SquareFootage.size() > 1) {
          //TODO
        } else {
          cpBuilding.SqFootExt = (res.SquareFootage[0].Value) as Integer
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation  - CPP : tunaSquareFootDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map BCEG value in CPP Buildings screen
   */
  private function tunaBCEGDetail(cpBuilding: CPBuilding, res: TunaAppResponse) {
    try {
      if (res.BCEGGrade != null) {
        if (res.BCEGGrade.size() > 1) {
          //TODO
        } else {
          cpBuilding.BCEG_Ext = (res.BCEGGrade[0].Value) as String
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation  - CPP : tunaBCEGDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map ProtectionClass value in CPP Buildings screen
   */
  private function tunaProtectionClassDetail(cpBuilding: CPBuilding, res: TunaAppResponse) {
    try {
      if (res.ProtectionClass != null) {
        if (res.ProtectionClass.size() > 1) {
          //TODO
        } else {
          cpBuilding.DwellingProtectionClassCode = (res.ProtectionClass[0].Value) as String
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation  - CPP : tunaProtectionClassDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map ConstructionType value in CPP Buildings screen
   */
  private function tunaConstructionTypeDetail(cpBuilding: CPBuilding, res: TunaAppResponse) {
    try {
      if (res.ConstructionType != null) {
        if (res.ConstructionType.size() > 1) {
          //TODO
        } else {
          cpBuilding.Building.ConstructionType = typecodeMapper.getInternalCodeByAlias("ConstructionType", "tuna", (res.ConstructionType[0].Value) as String)
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation  - CPP : tunaConstructionTypeDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map TerritoryCode value in CPP Buildings screen
   */
  private function tunaTerritoryCode(cpBuilding: CPBuilding, res: TunaAppResponse) {
    try {
      if (res.TerritoryCodes != null) {
        if (res.TerritoryCodes.size() > 1) {
          //TODO
        } else {
          cpBuilding.CPLocation.TerritoryCode.Code = (res.TerritoryCodes[0]) as String
        }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation - CPP : tunaTerritoryCode " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Roof Type in CPP Building screen
   */
  private function tunaRoofTypeDetail(cpBuilding: CPBuilding, res: TunaAppResponse) {
    try {
      if (res.RoofType != null){
        if (res.RoofType.size() > 1) {
          //TODO
        } else {
          cpBuilding.RoofShape  =  typecodeMapper.getInternalCodeByAlias("CPRoofShape_Ext", "tuna", (res.RoofType[0].Value) as String)
         }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation - CPP : tunaRoofTypeDetail " + " : StackTrace = ", exp)
    }
  }

  /**
   * This function is to map Roof Material in CPP Building screen
   */
  private function tunaRoofMaterialDetail(cpBuilding: CPBuilding, res: TunaAppResponse) {
    try {
      if (res.RoofCover != null) {
        if (res.RoofCover.size() > 1) {
          //TODO
        } else {
          cpBuilding.RoofTypeCP =  typecodeMapper.getInternalCodeByAlias("RoofType_CP", "tuna", (res.RoofCover[0].Value) as String)
          }
      }
    } catch (exp: Exception) {
      logger.error("GetPropertyInformation - CPP: tunaRoofMaterialDetail " + " : StackTrace = ", exp)
    }
  }

}
