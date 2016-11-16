package una.integration.framework.util

uses una.integration.framework.exception.IErrorCode

/**
 * Enum containing error codes and associated error messages for different error scenarios.
 * Created By: vtadi on 5/18/2016
 */
enum ErrorCode implements IErrorCode {
  UNEXPECTED_EXCEPTION ("PC0001", "Unexpected Exception occurred"),

  MISSING_READ_FILE_IMPLEMENTATION ("PC0002", "Please configure BeanIOStream or implement 'readFile' function for custom file reading"),
  INCOMING_FILE_PROCESSING_FAILED ("PC0003", "Unable to process the incoming file"),
  DUPLICATE_FILE ("PC0004", "A file with the same name is already processed."),
  INBOUND_DATA_RECORD_VALIDATION_ERROR ("PC0005", "Validation errors on the inbound data record. Please check field level errors."),

  OUTBOUND_PAYLOAD_EMPTY ("PC0006", "Outbound Integration Payload is empty"),
  ERROR_INSERTING_OUTBOUND_RECORD ("PC0007", "Unable to insert outbound record into integration table"),
  INCOMPLETE_FILE_CREATION ("PC0008", "'Please configure BeanIOStream or implement createFile' function for custom file writing"),
  ERROR_PROCESSING_OUTBOUND_RECORD ("PC0009", "Failed to process outbound record while creating flat file"),
  ERROR_CREATING_FILE ("PC0010", "Unable to create file"),
  HEADER_FILE_ERROR("PC0011", "Unable to process the incoming file as the Header records is a failure record"),
  ERROR_RECORD_FILE("PC0012", "Creating Error File with the error records in the file"),
  INVALID_HEADER_RECORD ("PC0013", "Failed to read the header record as per the layout"),
  INVALID_BATCH_HEADER_RECORD ("PC0014", "Failed to read the batch header record as per the layout"),
  INVALID_RECORD_NAME("PC0015", "Invalid record name configured in the BeanIOFileMapping xml file."),
  INVALID_UWCOMPANY ("PC0016", "Failed to process outbound record due to invalid UWCompany"),
  INVALID_CHECK_DATA ("PC0017", "Invalid Check Data"),
  MISSING_BEAN_DEFINITION ("PC0018", "Failed to load bean as the bean definition is not found"),
  NO_FILE_NAME("PC0019", "'getFileName()' function should be overridden and implemented.")

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