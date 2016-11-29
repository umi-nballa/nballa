package una.integration.util.propertyinspections

uses una.logging.UnaLoggerCategory
uses una.integration.framework.exception.FieldErrorInformation
uses una.integration.framework.exception.ExceptionUtil
uses una.integration.framework.util.ErrorCode
uses java.text.SimpleDateFormat

/**
 * The utility class which is used to validate the Inspection Vendors incoming file.
 * Created by : AChandrashekar on Date: 11/15/16
 */
class PropertyInspectionsInboundUtil {
  final static var LOGGER = UnaLoggerCategory.UNA_INTEGRATION
  final static var INSPECTION_VENDERS_FILENAME_FORMAT = "InspectionOrdered[0-9]{8}.[a-z]+"
  final static var UPLOAD_DATE_FORMAT = "MMddyyyy"

  /**
   * Validates the file name and extract required data from file name and add it to the header record.
   */
  static function validateFileName(fileName: String) {
    LOGGER.debug("Entering the function validateFileName() of PropertyInspectionsInboundUtil")
     // Validate the file name format
    var uploadDateStr: String
    var inspectionOrderedFileName : String
    var fieldError : FieldErrorInformation
    if (fileName.matches(INSPECTION_VENDERS_FILENAME_FORMAT)) {
      uploadDateStr = fileName.substring(17,25)
    } else{
      fieldError = new(){:FieldName = "FileName", :FieldValue = fileName, :ErrorMessage = "The file name does not match the Property Inspections inbound file format"}
      ExceptionUtil.throwException(UnaErrorCode.INVALID_PI_FILENAME, {fieldError})
    }
    // Validate the upload date in the file name
    var uploadDateFormatObj = new SimpleDateFormat(UPLOAD_DATE_FORMAT)
    var uploadDate = uploadDateFormatObj.parse(uploadDateStr)
    if (uploadDateFormatObj.format(uploadDate) != uploadDateStr) {
      fieldError = new(){:FieldName = "Date in the file name", :FieldValue = uploadDateStr, :ErrorMessage = "The upload date in the file name is not valid."}
      ExceptionUtil.throwException(UnaErrorCode.INVALID_PI_FILENAME, {fieldError})
    }
    LOGGER.debug("Exiting the function validateFileName() of PropertyInspectionsInboundUtil")
  }


}