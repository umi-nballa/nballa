package una.integration.framework.exception

uses una.logging.UnaLoggerCategory

uses java.lang.Throwable

/**
 * Utility class to create, log and throw application exception
 * Created By: vtadi on 5/18/2016
 */
class ExceptionUtil {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION

  /**
   * Creates and logs an ApplicationException with the given error details and throws the original exception back to the caller.
   * @param errorCode an IErrorCode representing error message
   * @param fieldErrors a list of FieldErrorInformation
   * @param cause the original exception
   */
  static function throwException(errorCode: IErrorCode, fieldErrors: List<FieldErrorInformation>= null, cause: Throwable= null) {
    var appException = createApplicationException(errorCode, fieldErrors, cause)
    _logger.error(appException.toString())
    throw cause?:appException
  }

  /**
   * Creates and logs an ApplicationException with the given error details.
   * @param errorCode an IErrorCode representing error message
   * @param fieldErrors a list of FieldErrorInformation
   * @param cause the original exception
   */
  static function suppressException(errorCode: IErrorCode, fieldErrors: List<FieldErrorInformation>= null, cause: Throwable= null) {
    var appException = createApplicationException(errorCode, fieldErrors, cause)
    _logger.error(appException.toString())
  }

  /**
   * Creates and returns an ApplicationException based on the given error details.
   * @param errorCode an IErrorCode representing error message
   * @param fieldErrors a list of FieldErrorInformation
   * @param cause the original exception
   * @returns ApplicationException the custom exception created with the given error details.
   */
  static function createApplicationException(errorCode: IErrorCode, fieldErrors: List<FieldErrorInformation> = null, cause: Throwable = null): ApplicationException {
    var appException : ApplicationException
    if (cause != null) {
      appException = new ApplicationException(errorCode, fieldErrors, cause)
    } else {
      appException = new ApplicationException(errorCode, fieldErrors)
    }
    return appException
  }

}