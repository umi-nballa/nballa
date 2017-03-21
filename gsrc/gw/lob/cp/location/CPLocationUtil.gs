package gw.lob.cp.location

uses una.model.PropertyDataModel
uses una.integration.mapping.tuna.TunaAppResponse

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 12/16/16
 * Time: 1:39 PM
 * To change this template use File | Settings | File Templates.
 */
class CPLocationUtil {
  
  static function getMatchLevelString(thePropertyDataModelList : List<String>) : typekey.TUNAMatchLevel_Ext {
    var res = typekey.TUNAMatchLevel_Ext.TC_USERSELECTED
    if(thePropertyDataModelList ==null || thePropertyDataModelList.Count < 1){
      res = typekey.TUNAMatchLevel_Ext.TC_NONE
    }else if(thePropertyDataModelList.Count == 1){
      res = typekey.TUNAMatchLevel_Ext.TC_EXACT
    }
    return res
  }

  static function getMatchLevel(thePropertyDataModelList : List<PropertyDataModel>) : typekey.TUNAMatchLevel_Ext {
    var res = typekey.TUNAMatchLevel_Ext.TC_USERSELECTED
    if(thePropertyDataModelList ==null || thePropertyDataModelList.Count < 1){
      res = typekey.TUNAMatchLevel_Ext.TC_NONE
    }else if(thePropertyDataModelList.Count == 1){
      res = typekey.TUNAMatchLevel_Ext.TC_EXACT
    }
    return res
  }

    static function setTunaFieldsMatchLevel(tunaAppResponse:una.integration.mapping.tuna.TunaAppResponse, location:PolicyLocation) : boolean
    {

      if(location!=null && tunaAppResponse!=null)
        {
          location?.LatitudeMatchLevel_Ext = (tunaAppResponse.Latitude != null) ? typekey.TUNAMatchLevel_Ext.TC_EXACT : typekey.TUNAMatchLevel_Ext.TC_NONE
          location?.LongitudeMatchLevel_Ext = (tunaAppResponse.Longitude != null) ? typekey.TUNAMatchLevel_Ext.TC_EXACT : typekey.TUNAMatchLevel_Ext.TC_NONE
          location?.TerritoryCodeMatchLevel_Ext = getMatchLevelString(tunaAppResponse.TerritoryCodes)
          location?.PropFloodValMatchLevel_Ext = getMatchLevel(tunaAppResponse.PropertyFlood)
        }
      return true

    }

    static function setTunaFieldsMatchLevel(tunaAppResponse:una.integration.mapping.tuna.TunaAppResponse, building:CPBuilding) : boolean
      {
    /************ location entity *****/
    if(building!=null && tunaAppResponse!=null)
      {
    building?.BCEGMatchLevel_Ext = getMatchLevel(tunaAppResponse.BCEGGrade)
    building?.FirePCCodeMatchLevel_Ext = getMatchLevel(tunaAppResponse.ProtectionClass)
    building?.WindPoolMatchLevel_Ext = getMatchLevel(tunaAppResponse.WindPool)
    building?.DistToCoastMatchLevel_Ext = getMatchLevel(tunaAppResponse.DistanceToCoast)

    building?.WindPoolMatchLevel_Ext = getMatchLevel(tunaAppResponse.WindPool)

       }
    return true
  }

  static function getTunaResponse(polLocation:PolicyLocation)  : TunaAppResponse
  {
    if(polLocation.AssociatedPolicyPeriod.CPLineExists){
      return new una.pageprocess.PropertyInformationCompletePluginImpl().getTunaInformation(polLocation.AssociatedPolicyPeriod)
    }else{
      return new TunaAppResponse()
    }
  }

  static function isNCWindpool(building:CPBuilding):boolean
  {
    var countylist = {"Beaufort", "Brunswick", "Camden", "Carteret", "Chowan", "Craven", "Currituck", "Dare", "Hyde", "Jones", "New Hanover", "Onslow"
        ,"Pamlico",  "Pasquotank", "Pender", "Perquimans", "Tyrrell", "Washington" }
    if(building.CPLocation.Location.State.Code=="NC" && countylist.contains(building.Branch.PrimaryLocation.County))
      return true
    else
      return false
  }

  static function setNCWindpool(building:CPBuilding) : boolean
  {
    if(isNCWindpool(building))
      building.Windpoolvalue_Ext="Yes"
 //    else
 //   building.Windpoolvalue_Ext="No"

    return true
  }
}