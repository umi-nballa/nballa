package una.integration.mapping.tuna

uses java.lang.Double
uses java.lang.Integer
uses una.model.PropertyDataModel
uses una.model.PropertyTerritoryModel

/**
 * Created for Response mapping for TUNA.
 * User: pyerrumsetty
 * Date: 5/11/16
 *
 */
class TunaAppResponse {

  /*Address Scrub*/
  var _status: Integer                      as Status
  var _scrubStatus: Integer                 as ScrubStatus
  var _note: String                         as Note
  var _noteDetail: String                   as NoteDetail
  var _uSPSOnly: Boolean                    as USPSOnly
  var _isExact: Boolean                     as IsExact
  var _resultPrecis: Integer                as ResultingPrecision
  var _addressLine1: String                 as AddressLine1
  var _addressLine2: String                 as AddressLine2
  var _postalCode: String                   as PostalCode
  var _city: String                         as City
  var _state: String                        as State
  var _country: String                      as Country
  var _latitude :Double                     as Latitude
  var _longitude :Double                    as Longitude

  /*Property Information complete*/
  var _counties: List                       as Counties
  var _datums :List<PropertyDataModel>      as Datums
  var _propertyLine:String                  as Line
  var _territoryDetails : List<PropertyTerritoryModel>  as TerritoryDetails
  var _territoryCodes:List                 as TerritoryCodes
  var _yearBuilt : List<PropertyDataModel>                     as YearBuilt
  var _protectionClass : List<PropertyDataModel>               as ProtectionClass
  var _distanceToCoast : List<PropertyDataModel>               as DistanceToCoast
  var _bcegGrade : List<PropertyDataModel>                     as BCEGGrade
  var _fireDeptMatchLevel : List<PropertyDataModel>            as FireDepartmentMatchLevel
  var _estimatedReplacementCost : List<PropertyDataModel>      as EstimatedReplacementCost
  var _iso360Value : List<PropertyDataModel>                   as ISO360Value
  var _adjustedHazard : List<PropertyDataModel>                as AdjustedHazard
  var _fireLineFuel : List<PropertyDataModel>                  as FireLineFuel
  var _fireLineSlope : List<PropertyDataModel>                 as FireLineSlope
  var _fireLineAccess : List<PropertyDataModel>                as FireLineAccess
  var _storiesNumber : List<PropertyDataModel>                 as  StoryNumber
  var _constructionType : List<PropertyDataModel>              as ConstructionType
  var _wallFinish : List<PropertyDataModel>                    as WallFinish
  var _roofCover : List<PropertyDataModel>                     as RoofCover
  var _roofType : List<PropertyDataModel>                      as RoofType
  var _squareFootage : List<PropertyDataModel>                 as SquareFootage
  var _windPool :List<PropertyDataModel>                       as WindPool




}