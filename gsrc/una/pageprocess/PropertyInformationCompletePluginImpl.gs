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
  *
  */

  public function retrieveBCEG360Value(policyPeriod : PolicyPeriod, yearBuilt : String, sqrFtg : String) : TunaAppResponse{
    var mapISO : boolean
    if(!(policyPeriod.Status == typekey.PolicyPeriodStatus.TC_DRAFT &&policyPeriod.Job.DisplayType == typekey.Job.TC_SUBMISSION.Code)){
     return null
    }
    logger.info(" Entering  " + CLASS_NAME + " :: " + " retrieveBCEG/360Value" + "For Dwelling ", this.IntrinsicType)
    _address = new AddressDTO()
     var location = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation
    _address.AddressLine1 = location.AddressLine1
    _address.State = location.State.Code
    _address.City = location.City
    _address.PostalCode = location.PostalCode
    _address.Country = location.Country.Code
    _address.YearBuilt = yearBuilt
    _address.SqrFtg = sqrFtg
    try {

      if(yearBuilt != null){
       tunaResponse = TUNAGateway.fetchPropertyInformationISOLookUpOnly(_address)

      if(sqrFtg != null ){
       var tunaResponse360 = TUNAGateway.fetchPropertyInformation360ValueLookUpOnlyInc(_address)
       tunaResponse.EstimatedReplacementCost = tunaResponse360.EstimatedReplacementCost
       tunaResponse.ISO360Value = tunaResponse360.ISO360Value
       tunaResponse.CondoValuationID = tunaResponse360.CondoValuationID
       tunaResponse.ACV = tunaResponse360.ACV
       tunaResponse.CoverageLimit = tunaResponse360.CoverageLimit
       mapISO = true
       }
       refreshSessionVar(policyPeriod, tunaResponse, mapISO)
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
      _address.YearBuilt = (building.YearBuilt_Ext) as String
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
    _address.YearBuilt = (cpBuilding.Building.YearBuilt) as String
    try {
      tunaResponse = TUNAGateway.fetchPropertyInformation(_address)
      cpBuilding.CPLocation.Branch.createCustomHistoryEvent(CustomHistoryType.TC_TUNAINITIATED, \ -> displaykey.Web.SubmissionWizard.Tuna.EventMsg("fetchPropertyInformation",tunaResponse.MetricsVersion.first().NamedValue))

    logger.info(" Entering  " + CLASS_NAME + " :: " + " getCPPInformation" + "For BuildingLocation ", this.IntrinsicType)
    } catch (exp: Exception) {
      logger.error("TunaGateway :  getCPPInformation  " + " : StackTrace = ", exp)
    }
    return tunaResponse
  }



 }
