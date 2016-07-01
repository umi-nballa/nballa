package una.integration.batch.outbound.ivans

uses una.integration.framework.file.outbound.batch.FileCreationBatch
uses java.util.Date
uses una.integration.framework.util.PropertiesHolder
uses una.integration.framework.file.IFileDataMapping
uses una.integration.mapping.FileIntegrationMapping

/**
 * Created with IntelliJ IDEA.
 * User: JGupta
 * Date: 6/21/16
 * Time: 5:49 AM
 * To change this template use File | Settings | File Templates.
 */
class IVANSPolicyPeriodBatch extends  FileCreationBatch {
 static final var IVANS_FOLDER_KEY="IVANSOutboundFolder"
  static final var IVANS_FILENAME_KEY="IVANSOutboundFilename"
  static final var IVANS_FILENAME_TIMESTAMP_KEY="IVANSOutboundFileTimestampFormat"
  static final var IVANS_FILE_EXT_KEY="IVANSOutboundFileExtension"
 construct()
 {
   super(BatchProcessType.TC_IVANSPOLICYPERIOD)
 }
  override function getFileName(startTime: Date): String {
    var folder= PropertiesHolder.getProperty(IVANS_FOLDER_KEY)
    var fileName= PropertiesHolder.getProperty(IVANS_FILENAME_KEY)
    var fileNameTimestamp=PropertiesHolder.getProperty(IVANS_FILENAME_TIMESTAMP_KEY)
    var fileExt=PropertiesHolder.getProperty(IVANS_FILE_EXT_KEY)

    return "${folder}${fileName}-${startTime.toStringWithFormat(fileNameTimestamp)}.${fileExt}"
  }

  override property get FileDataMapping(): IFileDataMapping {
    return FileIntegrationMapping.IVANSPolicyPeriodOutbound
  }
}