package una.integration.batch.outbound.lexisfirst

uses una.integration.framework.file.outbound.batch.FileCreationBatch
uses java.util.Date
uses una.utils.PropertiesHolder
uses una.integration.framework.file.IFileDataMapping
uses una.integration.mapping.FileIntegrationMapping

/**
 * Created for LexisFirst Batch Process
 * Created By: pavan theegala
 * Created Date: 7/7/16
 *
 */
class LexisFirstOutboundBatchProcess extends FileCreationBatch {
  static final var Lexis_First_FOLDER_KEY = "LexisFirstOutboundFolder"
  static final var Lexis_First_FILENAME_KEY = "LexisFirstOutboundFilename"
  static final var Lexis_First_FILENAME_TIMESTAMP_KEY = "LexisFirstOutboundFileTimestampFormat"
  static final var Lexis_First_FILE_EXT_KEY = "LexisFirstOutboundFileExtension"

  construct() {
    super(BatchProcessType.TC_LEXISFIRSTOUTBOUND)
  }

  /**
   * This function creates a outbound file.
   */
  override function getFileName(startTime: Date): String {
    var folder = PropertiesHolder.getProperty(Lexis_First_FOLDER_KEY)
    var fileName = PropertiesHolder.getProperty(Lexis_First_FILENAME_KEY)
    var fileNameTimestamp = PropertiesHolder.getProperty(Lexis_First_FILENAME_TIMESTAMP_KEY)
    var fileExt = PropertiesHolder.getProperty(Lexis_First_FILE_EXT_KEY)

    return "${folder}${fileName}_${startTime.toStringWithFormat(fileNameTimestamp)}.${fileExt}"
  }

  /**
   * This function takes care of mapping to FlatFile Framework.
   */
  override property get FileDataMapping(): IFileDataMapping {
    return FileIntegrationMapping.LexisFirstOutbound
  }
}