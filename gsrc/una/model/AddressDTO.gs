package una.model

/**
 * The DTO class used for  Address details mapping to Tuna requests
 * Created By: pavan Theegala
 * Created Date: 6/2/16
 *
 */

class AddressDTO {
  var _addressLine1: String   as AddressLine1
  var _addressLine2: String   as AddressLine2
  var _postalCode: String     as PostalCode
  var _city: String           as City
  var _state: String          as State
  var _country: String        as Country
  var _yearBuilt : String     as YearBuilt
}