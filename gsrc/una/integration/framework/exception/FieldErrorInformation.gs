package una.integration.framework.exception

/**
 * Class to hold field error information during validations
 * Created By: vtadi on 5/18/2016
 */
class FieldErrorInformation {
  var fieldName: String       as FieldName
  var fieldValue: Object      as FieldValue
  var errorMessage: String    as ErrorMessage
}