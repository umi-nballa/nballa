package una.integration.framework.util

uses una.integration.framework.exception.IErrorCode

/**
 * Enum containing error codes and associated error messages for different error scenarios.
 * Created By: vtadi on 5/18/2016
 */
enum ErrorCode implements IErrorCode {

  // Inbound File Integration error codes
  DUPLICATE_FILE ("ERR-INBOUND-001", "A file with the same name is already processed."),
  MISSING_READ_FILE_IMPLEMENTATION ("ERR-INBOUND-002", "Please configure BeanIOStream or implement 'readFile' function for custom file reading"),
  INCOMING_FILE_PROCESSING_FAILED ("ERR-INBOUND-003", "Unable to process the incoming file"),
  INBOUND_DATA_RECORD_VALIDATION_ERROR ("ERR-INBOUND-004", "Validation errors on the inbound data record. Please check field level errors."),
  INVALID_HEADER_RECORD ("ERR-INBOUND-005", "Failed to read the header record as per the layout"),
  INVALID_BATCH_HEADER_RECORD ("ERR-INBOUND-006", "Failed to read the batch header record as per the layout"),
  INVALID_RECORD_NAME("ERR-INBOUND-007", "Invalid record name configured in the BeanIOFileMapping xml file."),
  IMPROPER_FOLDER_STRUCTURE("ERR-INBOUND-008","Folder Structure is not proper"),
  FILE_IS_PRESENT("ERR-INBOUND-009","File is already present in the target folder"),

  // Outbound File Integration error codes
  OUTBOUND_PAYLOAD_EMPTY ("ERR-OUTBOUND-001", "Outbound Integration Payload is empty"),
  ERROR_INSERTING_OUTBOUND_RECORD ("ERR-OUTBOUND-002", "Unable to insert outbound record into integration table"),
  ERROR_PROCESSING_OUTBOUND_RECORD ("ERR-OUTBOUND-003", "Failed to process outbound record while creating flat file"),
  INCOMPLETE_FILE_CREATION ("ERR-OUTBOUND-004", "'Please configure BeanIOStream or implement createFile' function for custom file writing"),
  ERROR_CREATING_FILE ("ERR-OUTBOUND-005", "Unable to create file"),
  ERROR_RECORD_FILE("ERR-OUTBOUND-006", "Creating Error File with the error records in the file"),
  NO_FILE_NAME("ERR-OUTBOUND-007", "'getFileName()' function should be overridden and implemented."),

  // Common Error codes
  UNEXPECTED_EXCEPTION ("ERR-001", "Unexpected Exception occurred"),
  MISSING_BEAN_DEFINITION ("ERR-002", "Failed to load bean as the bean definition is not found"),


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