package una.integration.framework.persistence.entity

uses una.integration.framework.exception.ErrorTypeInfo

/**
 * Base class for all the exception data objects associated to exception data tables in the integration database.
 * Created By: vtadi on 5/18/2016
 */
abstract class ExceptionBaseEntity extends BaseEntity {
  var payload : String            as Payload
  var errorDescription : String   as ErrorDescription
  var errorType : ErrorTypeInfo   as ErrorType
}