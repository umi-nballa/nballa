package gw.lob.bp7.location

uses una.integration.mapping.tuna.TunaAppResponse
uses una.model.PropertyDataModel

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 12/16/16
 * Time: 1:39 PM
 * To change this template use File | Settings | File Templates.
 */
class BP7LocationUtil {
  
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

  static function setTunaFieldsMatchLevel(tunaAppResponse:una.integration.mapping.tuna.TunaAppResponse, location:BP7Location) : boolean {
    /************ location entity *****/
    location.BCEGMatchLevel_Ext = getMatchLevel(tunaAppResponse.BCEGGrade)
    location.DwellingPCCodeMatchLevel_Ext = getMatchLevel(tunaAppResponse.ProtectionClass)
    location.WindPoolMatchLevel_Ext = getMatchLevel(tunaAppResponse.WindPool)
    location.DistToCoastMatchLevel_Ext = getMatchLevel(tunaAppResponse.DistanceToCoast)
    location.TerritoryCodeMatchLevel_Ext = getMatchLevelString(tunaAppResponse.TerritoryCodes)
    location.LatitudeMatchLevel_Ext = (tunaAppResponse.Latitude != null) ? typekey.TUNAMatchLevel_Ext.TC_EXACT : typekey.TUNAMatchLevel_Ext.TC_NONE
    location.LongitudeMatchLevel_Ext = (tunaAppResponse.Longitude != null) ? typekey.TUNAMatchLevel_Ext.TC_EXACT : typekey.TUNAMatchLevel_Ext.TC_NONE
    location.WindPoolMatchLevel_Ext = getMatchLevel(tunaAppResponse.WindPool)
    location.PropFloodValMatchLevel_Ext = getMatchLevel(tunaAppResponse.PropertyFlood)

    return true
  }

}