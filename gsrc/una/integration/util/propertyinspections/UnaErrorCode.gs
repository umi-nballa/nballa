package una.integration.util.propertyinspections

uses una.integration.framework.exception.IErrorCode



/**
 * Enum containing error codes and associated error messages for each integration.
 * Created By: vtadi on 11/17/2016
 */
enum UnaErrorCode implements IErrorCode {
  INVALID_PI_FILENAME ("ERR-PROPERTY-INSPECTIONS-001", "Inavalid File Name Format"),
  DATA_INSERTION_FAILURE("ERR-PROPERTY-INSPECTIONS-002", "Unable to Insert data into Integration db on the first Payment")

  var _number: String
  var _message: String

  /**
   * Construct to initialize the enum with an error number and message.
   */
  private construct(num: String, msg: String) {
    _number = num
    _message = msg
  }

  override property get ErrorNumber(): String {
    return _number
  }

  override property get ErrorMessage(): String {
    return _message
  }

  /**
   * String representation of this error code.
   */
  override function toString(): String {
    return "${ErrorNumber} (${Code}) - ${ErrorMessage}"
  }
}