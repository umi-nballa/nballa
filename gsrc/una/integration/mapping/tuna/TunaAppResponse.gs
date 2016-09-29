package una.integration.mapping.tuna

uses java.lang.Double
uses java.lang.Integer
uses una.model.PropertyDataModel

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
  var _territoryDetails : List              as TerritoryDetails


}