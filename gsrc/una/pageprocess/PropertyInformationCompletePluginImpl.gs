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
  var typeCodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
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

   // var tunaAppObject : TunaAppResponse

    var tunaAppObject   = tunaAppSession.getTunaAppFromSession(policyPeriod)

    if(tunaAppObject == null)
     tunaAppObject = retrieveTunaInfo(policyPeriod)

    if(tunaAppObject != null)
     tunaAppSession.initializeSessionVar(policyPeriod,tunaAppObject)

    gw.lob.ho.HODwellingUtil_HOE.setTunaFieldsMatchLevel(tunaAppObject,policyPeriod.HomeownersLine_HOE.Dwelling)


     return tunaAppObject
  }


  /**
   * This function is to get tuna information and add it to user session/ Refresh Cache
   */

  public function refreshSessionVar(policyPeriod : PolicyPeriod, tunaISOResponse : TunaAppResponse, mapISO : boolean )  {

    var tunaAppObject   = tunaAppSession.getTunaAppFromSession(policyPeriod)

    if(tunaAppObject == null)
      tunaAppObject = retrieveTunaInfo(policyPeriod)

    if(tunaAppObject != null && tunaISOResponse != null){

      tunaAppObject.BCEGGrade = tunaISOResponse.BCEGGrade

      if(mapISO == true){
      tunaAppObject.EstimatedReplacementCost = tunaISOResponse.EstimatedReplacementCost
      tunaAppObject.ISO360Value = tunaISOResponse.ISO360Value
      tunaAppObject.CondoValuationID = tunaISOResponse.CondoValuationID
      tunaAppObject.ACV = tunaISOResponse.ACV
      tunaAppObject.CoverageLimit = tunaISOResponse.CoverageLimit
      }

      tunaAppSession.removeFromSession(policyPeriod)
      tunaAppSession.initializeSessionVar(policyPeriod,tunaAppObject)
      }

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

  /**
   * This function is to reset the dwelling and dwelling construction details fetched from TUNA
   * when user click on edit or new location in dwelling screen
   * @param policyPeriod
   *
   */
  public function resetTunaInfo(policyPeriod : PolicyPeriod){

    //Remove from session
    tunaAppSession.removeFromSession(policyPeriod)
    //Dwelling Details
    if(policyPeriod.HomeownersLine_HOE != null)   {
    policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt = null
    policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideYearbuilt_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.TerritoryCodeTunaReturned_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.TerritoryCodeOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideTerritoryCode_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClasscode = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingPCCodeOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideDwellingPCCode_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.Latitude_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.OverrideLatitude_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.LatitudeOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.Longitude_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.LongitudeOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.OverrideLongitude_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ACVValue_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ACVValueOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideACVValue_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ResFireDept_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ResFireDeptMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ResFireDeptOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideResFireDept_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.EarthQuakeTer_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideEarthquakeTer_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.EarthquakeTerOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.PropFloodVal_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.PropFloodValOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverridePropFloodVal_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.BaseFloodElVal_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.BaseFloodElValOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideBaseFloodElVal_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ISO360ValueID_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideISO360_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ISO360Overridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.BCEG_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.BCEGOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideBCEG_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.WindPool_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideWindPool_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.WindPoolOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistToCoast_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideDistToCoast_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistToCoastOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistBOW_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideDistBOW_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistBOWOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistBOWNamedValue_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistBOWNVOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideDistBOWNamedValue_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.NoteDetail_Ext= null
    policyPeriod.HomeownersLine_HOE.Dwelling.CoverageALimitValue_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.CondoValuationIDValue_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.MetricsVersionValue_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ResultingPrecision_Ext= null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHaz_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFirelineAdjHaz_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHazOverridden_Ext= null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineSHIA_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFirelineSHIA_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineSHIAOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelinePrHaz_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelinePropHazOverridden_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFirelinePropHaz_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineFuel_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineFuelOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFirelineFuel_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.Fireslope_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FireslopeOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFireslope_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.Fireaccess_Ext= null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FireaccessOverridden_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFireaccess_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.Firelinemthlvl_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelinemhlvlOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFirelnmthlevelval_Ext = false
    //Dwelling Construction Details
    policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.NoofStoriesOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideStoriesNumber_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ConstTypeOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideConstructionType_Ext = false
    //policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionTypeL1_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ConstTypeOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideConstructionType_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionTypeL2_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ConstTypeOverriddenL2_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideConstructionTypeL2_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWallFinish_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWFvalueOverridden_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideExteriorWFval_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWallFinishL1_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWFvalueOverridL1_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideExteriorWFvalL1_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWallFinishL2_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWFvalueOverridL2_Ext  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideExteriorWFvalL2_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.SquareFootage_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideTotalSqFtVal_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.TotalSqFtValOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideTotalSqFtVal_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.RoofType  = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideRoofType_Ext = false
    policyPeriod.HomeownersLine_HOE.Dwelling.RoofingMaterialOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.RoofShape_Ext   = null
    policyPeriod.HomeownersLine_HOE.Dwelling.RoofShapeOverridden_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.OverrideRoofShape_Ext = false
    //Match Level Details
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.BCEGMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingPCCodeMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelinemthlvlMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.WindPoolMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistBOWMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistBOWNVMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistToCoastMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.TerritoryCodeMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.LatitudeMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.LongitudeMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.WindPoolMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ISO360MatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.ACVValueMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineSHIAMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineFuelMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelinePropHazMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHazMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FireaccessMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FireslopeMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumberMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.RoofTypeMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.RoofShapeMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionTypeMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionTypeMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionTypeMatchLvlL2_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.BaseFloodElValMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.PropFloodValMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.EarthquakeTerMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWFvalMatchLevel_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWFvalMatchLevelL1_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.ExteriorWFvalMatchLevelL2_Ext = null
    policyPeriod.HomeownersLine_HOE.Dwelling.TotalSqFtValMatchLevel_Ext = null
   }
  }

  /**
   *  Function to retrieve complete information
   */

  public function retrieveTunaInfo(policyPeriod : PolicyPeriod): TunaAppResponse{

    if(!(policyPeriod.Status == typekey.PolicyPeriodStatus.TC_DRAFT &&policyPeriod.Job.DisplayType == typekey.Job.TC_SUBMISSION.Code)){
       return null
      }
     logger.info(" Entering  " + CLASS_NAME + " :: " + " getDwellingInformation" + "For Dwelling ", this.IntrinsicType)
    _address = new AddressDTO()
    var location = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation
      _address.AddressLine1 = location.AddressLine1
      _address.State = location.State.Code
      _address.City = location.City
      _address.PostalCode = location.PostalCode
      _address.Country = location.Country.Code
      try {
        tunaResponse = TUNAGateway.fetchPropertyInformationComplete(_address)
        policyPeriod.createCustomHistoryEvent(CustomHistoryType.TC_TUNAINITIATED, \ -> displaykey.Web.SubmissionWizard.Tuna.EventMsg("fetchPropertyInformationComplete",tunaResponse.MetricsVersion.first().NamedValue))
          if(tunaResponse == null)
          LocationUtil.addRequestScopedWarningMessage("Unable to retrive information from TUNA")

      } catch (exp: Exception) {
        LocationUtil.addRequestScopedWarningMessage("Unable to retrive information from TUNA")
        logger.error("TunaGateway : Dwelling  Information " + " : StackTrace = ", exp)
      }
    logger.info(" Leaving  " + CLASS_NAME + " :: " + " getDwellingInformation" + "For Dwelling ", this.IntrinsicType)
    return tunaResponse
  }

 /**
  *   Function to retrieve BCEG / ISO 360 values
  */

  public function retrieveBCEG360Value(dwelling : Dwelling_HOE) : TunaAppResponse{
    var mapISO : boolean
    if(!(dwelling.PolicyPeriod.Status == typekey.PolicyPeriodStatus.TC_DRAFT && dwelling.PolicyPeriod.Job.DisplayType == typekey.Job.TC_SUBMISSION.Code)){
     return null
    }
    logger.info(" Entering  " + CLASS_NAME + " :: " + " retrieveBCEG/360Value" + "For Dwelling ", this.IntrinsicType)
    _address = new AddressDTO()
     var location = dwelling.HOLocation.PolicyLocation
    _address.AddressLine1 = location.AddressLine1
    _address.State = location.State.Code
    _address.City = location.City
    _address.PostalCode = location.PostalCode
    _address.Country = location.Country.Code
    _address.YearBuilt = mapYearBuilt(dwelling)
    _address.SqrFtg = mapSqrFtg(dwelling)
    try {

      if( _address.YearBuilt != null){
       tunaResponse = TUNAGateway.fetchPropertyInformationISOLookUpOnly(_address)

      if(_address.SqrFtg != null ){
       var tunaResponse360 = TUNAGateway.fetchPropertyInformation360ValueLookUpOnlyInc(_address)
       tunaResponse.EstimatedReplacementCost = tunaResponse360.EstimatedReplacementCost
       tunaResponse.ISO360Value = tunaResponse360.ISO360Value
       tunaResponse.CondoValuationID = tunaResponse360.CondoValuationID
       tunaResponse.ACV = tunaResponse360.ACV
       tunaResponse.CoverageLimit = tunaResponse360.CoverageLimit
       mapISO = true
       }
       refreshSessionVar(dwelling.PolicyPeriod, tunaResponse, mapISO)
       }
       if(tunaResponse == null)
       LocationUtil.addRequestScopedWarningMessage("Unable to retrive BCEG/ISO 360 information from TUNA")

    } catch (exp: Exception) {
      LocationUtil.addRequestScopedWarningMessage("Unable to retrive BCEG/ISO 360 value from TUNA")
      logger.error("TunaGateway : Dwelling  Information " + " : StackTrace = ", exp)
    }
    logger.info(" Leaving  " + CLASS_NAME + " :: " + " retrieveBCEG/360Value" + "For Dwelling ", this.IntrinsicType)
    return tunaResponse
  }


  public function retrieveTunaBOPInfo(location : BP7Location): TunaAppResponse{

    var policyPeriod = location.Branch

    if(!(policyPeriod.Status == typekey.PolicyPeriodStatus.TC_DRAFT && policyPeriod.Job.DisplayType == typekey.Job.TC_SUBMISSION.Code)){
      return null
    }
    logger.info(" Entering  " + CLASS_NAME + " :: " + " retrieveTunaBOPInfo " + "For BOP ", this.IntrinsicType)
    _address = new AddressDTO()

    _address.AddressLine1 = location.Location.AddressLine1
    _address.State = location.Location.State.Code
    _address.City = location.Location.City
    _address.PostalCode = location.Location.PostalCode
    _address.Country = location.Location.Country.Code
    try {
      tunaResponse = TUNAGateway.fetchPropertyInformation(_address)
      policyPeriod.createCustomHistoryEvent(CustomHistoryType.TC_TUNAINITIATED, \ -> displaykey.Web.SubmissionWizard.Tuna.EventMsg("fetchPropertyInformationComplete",tunaResponse.MetricsVersion.first().NamedValue))
      if(tunaResponse == null)
        LocationUtil.addRequestScopedWarningMessage("Unable to retrive information from TUNA")

    } catch (exp: Exception) {
      LocationUtil.addRequestScopedWarningMessage("Unable to retrive information from TUNA")
      logger.error("TunaGateway : Retrieving TUNA Information " + " : StackTrace = ", exp)
    }
    logger.info(" Leaving  " + CLASS_NAME + " :: " + " retrieveTunaBOPInfo" + "For BOP ", this.IntrinsicType)
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
   * This function is to call GetPropertyInformation Service which is for BOP Product
   * Below method is a Post On Change when user enters value in YearBuilt field
   */
  public function getBOPInformation(building: BP7Building): TunaAppResponse {

     _address = new AddressDTO()
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getBOPInformation" + "For BuildingLocation ", this.IntrinsicType)
      _address.AddressLine1 = building.Location.PolicyLocation.AddressLine1
      _address.City = building.Location.PolicyLocation.City
      _address.State = building.Location.PolicyLocation.State.Code
      _address.PostalCode = building.Location.PolicyLocation.PostalCode
      _address.YearBuilt = building.YearBuilt_Ext
      try {
        tunaResponse = TUNAGateway.fetchPropertyInformation(_address)

        if (tunaResponse == null)
          LocationUtil.addRequestScopedWarningMessage("Unable to retrive information from TUNA")

       logger.debug(" Entering  " + CLASS_NAME + " :: " + " getBOPInformation" + "For BuildingLocation ", this.IntrinsicType)
    } catch (exp: Exception) {
      LocationUtil.addRequestScopedWarningMessage("Unable to retrive information from TUNA")
      logger.error("TunaGateway :  getBOPInformation  " + " : StackTrace = ", exp)
    }
    return tunaResponse
  }


  /**
   * This function is to call GetPropertyInformation Service which is for CPP Product
   * Below method is a Post On Change when user enters value in YearBuilt field
   */
  public function getCPPInformation(cpBuilding: CPBuilding) : TunaAppResponse {

    _address = new AddressDTO()
    logger.info(" Entering  " + CLASS_NAME + " :: " + " getCPPInformation" + "For BuildingLocation ", this.IntrinsicType)
    _address.AddressLine1 = cpBuilding.CPLocation.PolicyLocation.AddressLine1
    _address.City = cpBuilding.CPLocation.PolicyLocation.City
    _address.State = cpBuilding.CPLocation.PolicyLocation.State.Code
    _address.PostalCode = cpBuilding.CPLocation.PolicyLocation.PostalCode
    _address.YearBuilt = cpBuilding.Building.YearBuilt
    try {
      tunaResponse = TUNAGateway.fetchPropertyInformation(_address)
      cpBuilding.CPLocation.Branch.createCustomHistoryEvent(CustomHistoryType.TC_TUNAINITIATED, \ -> displaykey.Web.SubmissionWizard.Tuna.EventMsg("fetchPropertyInformation" ,""))

    logger.info(" Entering  " + CLASS_NAME + " :: " + " getCPPInformation" + "For BuildingLocation ", this.IntrinsicType)
    } catch (exp: Exception) {
      logger.error("TunaGateway :  getCPPInformation  " + " : StackTrace = ", exp)
    }
    return tunaResponse
  }

  /**
   * Function to retrieve right year built value
   */

  function mapYearBuilt(dwelling_hoe : Dwelling_HOE) : int{
     if(dwelling_hoe.OverrideYearbuilt_Ext)
      return dwelling_hoe.YearBuiltOverridden_Ext
    return dwelling_hoe.YearBuilt
  }


  function mapSqrFtg(dwelling_hoe : Dwelling_HOE) : String {

     if(dwelling_hoe.OverrideTotalSqFtVal_Ext)
        return dwelling_hoe.TotalSqFtValOverridden_Ext
        return dwelling_hoe.SquareFootage_Ext as String
      }
 }
