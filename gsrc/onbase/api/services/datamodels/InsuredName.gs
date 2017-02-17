package onbase.api.services.datamodels


/**
 * Data model for OnBase Insured Name
 */
class InsuredName {
  var _firstName  : String as FirstName

  var _middleName : String as MiddleName

  var _lastName : String as LastName

  construct() {}

  construct(firstName :String, lastName : String) {
    _firstName = firstName
    _lastName = lastName
  }

  construct(firstName :String, lastName : String, middleName : String) {
    _firstName = firstName
    _lastName = lastName
    _middleName = middleName
  }
}