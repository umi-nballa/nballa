package una.integration.framework.exception

uses gw.pl.util.ExceptionUtil

uses java.lang.RuntimeException
uses java.lang.Throwable

/**
 * Custom exception class used to store and print field level error details.
 * Created By: vtadi on 5/18/2016
 */
class ApplicationException extends RuntimeException {
  var errCode: IErrorCode                           as ErrCode
  var fieldErrorList: List<FieldErrorInformation>   as FieldErrorInfo
  var originalException: Throwable                  as OriginalException

  /**
   * Construct with original exception and error details.
   * @param errorCode the IErrorCode implementation enum value representing the error message
   * @param fieldErrors the list of FieldErrorInformation, each representing error details specific to a field.
   * @param cause the original exception
   */
  protected construct(errorCode: IErrorCode, fieldErrors: List<FieldErrorInformation>, cause: Throwable) {
    super(cause)
    errCode = errorCode
    fieldErrorList = fieldErrors
    originalException = cause
  }

  /**
   * Construct without an underlying exception, but having error details. Typically used in field validations.
   * @param errorCode the IErrorCode implementation enum value representing the error message
   * @param fieldErrors the list of FieldErrorInformation, each representing error details specific to a field.
   */
  protected construct(errorCode: IErrorCode, fieldErrors: List<FieldErrorInformation>) {
    errCode = errorCode
    fieldErrorList = fieldErrors
  }

  /**
   * Creates and returns the detailed and readable form of the exception.
   */
  override function toString(): String {
    var tab = "\t\t\t\t\t\t\t\t\t\t\t\t"
    var message = "\n${tab} ${errCode.toString()}\n"
    fieldErrorList?.each( \ fieldError -> {
      message = "${message}${tab} Field - ${fieldError.FieldName} \t Value - ${fieldError.FieldValue}"
      if (fieldError.ErrorMessage != null) {
        message = "${message} \t Message = ${fieldError.ErrorMessage}"
      }
      message = "${message}\n"
    })
    if (originalException != null) {
      var sw = ExceptionUtil.getCompleteStackTrace(originalException)
      if (originalException typeis ApplicationException) {
        message = "${sw}"
      } else {
        message = "${message} ${sw}"
      }
    }
    return message
  }
}