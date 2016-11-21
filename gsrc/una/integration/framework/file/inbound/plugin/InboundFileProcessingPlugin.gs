package una.integration.framework.file.inbound.plugin

uses gw.plugin.integration.inbound.InboundIntegrationHandlerPlugin
uses una.integration.framework.exception.ExceptionUtil
uses una.integration.framework.exception.FieldErrorInformation
uses una.integration.framework.file.inbound.model.FileRecordInfo
uses una.integration.framework.file.inbound.model.FileRecords
uses una.integration.framework.persistence.context.PersistenceContext
uses una.integration.framework.util.BeanIOHelper
uses una.integration.framework.util.ErrorCode
uses una.integration.framework.util.PropertiesHolder
uses una.logging.UnaLoggerCategory

uses java.io.File

/**
 * The inbound file handler plugin base class to read and process the file directly without using Integration Database.
 * The sub classes can use the integration database based on the requirement.
 * Created By: Vempa Tadi on 9/26/2016
 */
abstract class InboundFileProcessingPlugin implements InboundIntegrationHandlerPlugin, IFileProcessingPlugin {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  final static var INTEGRATION_USER = PropertiesHolder.getProperty("INTEGRATION_USER")
  final static var PATH_SEPARATOR = "\\"
  final static var DONE_FOLDER_NAME = "done"

  /**
   * Validates the batch header record for mandatory information to process the detail records.
   */
  override function validateBatchHeader(batchHeaderRecord: FileRecordInfo) {
    _logger.debug("Batch Header Record validation is not implemented for the Stream: " + BeanIOStream)
  }

  /**
   * Validates the file header record for mandatory information to process the detail records.
   */
  override function validateFile(fileName: String, fileRecords: FileRecords) {
    _logger.debug("File basic validation is not implemented for the Stream: " + BeanIOStream)
  }

  /**
   * Creates the error file with all the records which can't be processed due to business/technical errors.
   */
  override function processFailedRecords(fileRecords: FileRecords, filePath: java.nio.file.Path) {
    _logger.debug("Using default error file creation for the file: " + filePath.toAbsolutePath() as String)
    BeanIOHelper.createFileWithErrorRecords(fileRecords, filePath)
  }

  /**
   * Reads the ReturnPremium Response file and updates check number and process status of the corresponding outgoing payments.
   * @param data the inbound file path
   */
  override function process(data: Object) {
    // Validates if the file with the same name is already processed.
    validateDuplicateFile(data)
    var filePath = (data as java.nio.file.Path ).toAbsolutePath() as String
    var fileName = (data as java.nio.file.Path ).toAbsolutePath().getFileName() as String
    var fileRecords = BeanIOHelper.readFile(BeanIOStream, filePath)
    var containsHeader = fileRecords.HeaderRecord != null
    var containsBatchHeader = fileRecords.Batches*.BatchHeaderRecord.first() != null
    validateFile(fileName, fileRecords)
    if (containsHeader && fileRecords.HeaderRecord.Failed) {
      var fieldError1 = new FieldErrorInformation() {:FieldName = "File Path", :FieldValue = filePath}
      var fieldError2 = fileRecords.HeaderRecord.FieldErrorInfo
      ExceptionUtil.throwException(ErrorCode.INVALID_HEADER_RECORD, {fieldError1, fieldError2})
    }
    PersistenceContext.runWithNewTransaction( \-> {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        fileRecords.Batches.each( \ batch -> {
          if (!(batch.BatchHeaderRecord.Failed?:false)) {
            batch.DetailRecords.each( \ detailRecord -> {
              if (!detailRecord.Failed) {
                processDetailRecord(fileName, fileRecords.HeaderRecord, batch.BatchHeaderRecord, detailRecord, bundle)
              }
            })
          }
        })
        // Failed records processing
        processFailedRecords(fileRecords, data as java.nio.file.Path)
      }, INTEGRATION_USER)
    })
  }

  /**
   * Validates if the file with the same name is already processed.
   */
  private function validateDuplicateFile(data : Object){
    _logger.debug("Entering validateDuplicateFile() ")
    var fileName = (data as java.nio.file.Path ).toAbsolutePath().getFileName() as String
    var fieldError : FieldErrorInformation
    var doneDirPath= (data as java.nio.file.Path ).Parent.Parent.toAbsolutePath()+PATH_SEPARATOR+DONE_FOLDER_NAME
    if(!(new File(doneDirPath)).exists()){
      fieldError = new(){:FieldName = "Folder Structure", :FieldValue = fileName, :ErrorMessage = "Folder Structure is not proper. Done folder not present"}
      ExceptionUtil.throwException(ErrorCode.IMPROPER_FOLDER_STRUCTURE, {fieldError})
    }
    if((new File(doneDirPath+PATH_SEPARATOR+fileName)).exists()) {
      fieldError = new(){:FieldName = "File", :FieldValue = fileName, :ErrorMessage = "File is already present in the target folder"}
      ExceptionUtil.throwException(ErrorCode.FILE_IS_PRESENT, {fieldError})
    }
    _logger.debug("Exiting the validateDuplicateFile()")
  }

}