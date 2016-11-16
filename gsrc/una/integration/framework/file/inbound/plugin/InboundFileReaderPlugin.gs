package una.integration.framework.file.inbound.plugin

uses gw.api.util.DateUtil
uses gw.plugin.integration.inbound.InboundIntegrationHandlerPlugin
uses una.integration.framework.exception.ErrorTypeInfo
uses una.integration.framework.exception.ExceptionUtil
uses una.integration.framework.exception.FieldErrorInformation
uses una.integration.framework.file.inbound.model.FileRecordInfo
uses una.integration.framework.file.inbound.model.FileRecords
uses una.integration.framework.file.inbound.persistence.InboundFileData
uses una.integration.framework.file.inbound.persistence.InboundFileException
uses una.integration.framework.file.inbound.persistence.InboundFileProcess
uses una.integration.framework.file.inbound.persistence.InboundFileProcessDAO
uses una.integration.framework.persistence.context.PersistenceContext
uses una.integration.framework.persistence.dao.IntegrationBaseDAO
uses una.integration.framework.persistence.util.ProcessStatus
uses una.integration.framework.util.BeanIOHelper
uses una.integration.framework.util.ErrorCode
uses una.logging.UnaLoggerCategory

uses java.lang.Exception
uses java.lang.Integer

/**
 * Abstract class with implementation of process method. This method reads the file with given FileDataMapping value,
 * inserts valid records to data table and invalid records to exception table.
 * Used as a super class for all the inbound file integration plugins.
 * Created By: vtadi on 5/18/2016
 */
abstract class InboundFileReaderPlugin implements InboundIntegrationHandlerPlugin, IFileReaderPlugin {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION

  var _userName: String
  var _fileProcessDAO: InboundFileProcessDAO
  var _dataEntityDAO: IntegrationBaseDAO
  var _fileExceptionDAO: IntegrationBaseDAO

  /**
   * Construct to initialize the username with the actual subclass name of the instance created.
   */
  construct() {
    _userName = this.IntrinsicType.RelativeName
  }

  /**
   * This function reads data from the filepath and creates an inbound file process and inserts the records into the integration database.
   * @param data the file to be processed.
   */
  override function process(data: Object) {
    _logger.debug("Entering the function 'process' of 'InboundFileReaderPlugin'")
    var filePath = (data as java.nio.file.Path ).toAbsolutePath() as String
    _fileProcessDAO = _fileProcessDAO?: new()
    _fileExceptionDAO = _fileExceptionDAO?: new(InboundFileException)
    _dataEntityDAO = _dataEntityDAO?: new(FileDataMapping)

    // Creating Process record
    var fileProcess = createInboundFileProcess(filePath)
    _logger.info("Started the ${FileDataMapping.BeanIOStreamName} process for the inbound file ${filePath}")
    try {
      // Checking for duplicate process
      if (_fileProcessDAO.isDuplicateProcess(filePath, ProcessStatus.Processed)) {
        var fieldError = new FieldErrorInformation() {:FieldName = "File name", :FieldValue = filePath}
        ExceptionUtil.throwException(ErrorCode.DUPLICATE_FILE, {fieldError})
      }
      var fileRecords = readFile(filePath)
      fileProcess.TotalRecordCount = 0
      fileRecords.Batches.each( \ batch -> {
        fileProcess.TotalRecordCount += batch.DetailRecords.Count
      })

      var containsHeader = fileRecords.HeaderRecord != null
      var containsBatchHeader = fileRecords.Batches*.BatchHeaderRecord.first() != null
      if (containsHeader && fileRecords.HeaderRecord.Failed) {
        var fieldError1 = new FieldErrorInformation() {:FieldName = "File Path", :FieldValue = filePath}
        var fieldError2 = fileRecords.HeaderRecord.FieldErrorInfo
        ExceptionUtil.throwException(ErrorCode.INVALID_HEADER_RECORD, {fieldError1, fieldError2})
      }
      if (containsBatchHeader && fileRecords.Batches*.BatchHeaderRecord.hasMatch( \ batchHeader -> batchHeader.Failed)) {
        var fieldError1 = new FieldErrorInformation() {:FieldName = "File Path", :FieldValue = filePath}
        var fieldError2 = fileRecords.Batches*.BatchHeaderRecord.firstWhere( \ batchHeader -> batchHeader.Failed).FieldErrorInfo
        ExceptionUtil.throwException(ErrorCode.INVALID_BATCH_HEADER_RECORD, {fieldError1, fieldError2})
      }

      PersistenceContext.runWithNewTransaction( \-> {
        fileRecords.Batches.each( \ batch -> {
          batch.DetailRecords.each( \ detailRecord -> {
            if (!detailRecord.Failed) {
              var inboundData = detailRecord.RecordObject as InboundFileData
              inboundData.UpdateUser = _userName
              inboundData.CreateUser = _userName
              inboundData.Status = ProcessStatus.UnProcessed
              inboundData.InboundFileProcessID = fileProcess.ID
              inboundData.RetryCount = 0
              if (containsHeader || containsBatchHeader) {
                // call subclass method for retrieving data from header and batch header and copy it to detail record
                loadHeaderData(fileRecords.HeaderRecord, batch.BatchHeaderRecord, inboundData)
              }
              _dataEntityDAO.insert(inboundData)
              fileProcess.ProcessedRecordCount++
            } else {
              var errorDesc = "Line number: ${detailRecord.RecordLineNumber} \n Field Errors: ${detailRecord.FieldErrors} \n Record Errors: ${detailRecord.RecordErrors}"
              var errorType = detailRecord.FieldErrors.Count > 0 ? ErrorTypeInfo.Business : ErrorTypeInfo.Technical
              createInboundFileDataException(fileProcess.ID, detailRecord.RecordText, errorType, errorDesc)
              fileProcess.FailedRecordCount++
            }
          })
        })
      })
      fileProcess.Status = ProcessStatus.Processed
    } catch (ex: Exception) {
      fileProcess.Status = ProcessStatus.Failed
      createInboundFileDataException(fileProcess.ID, "", ErrorTypeInfo.Technical, ex.Message + ex.StackTraceAsString)
      var fieldInfo = new FieldErrorInformation(){:FieldName = "File name", :FieldValue = filePath}
      ExceptionUtil.throwException(ErrorCode.INCOMING_FILE_PROCESSING_FAILED, {fieldInfo}, ex)
    } finally {
      fileProcess.EndTime = DateUtil.currentDate()
      fileProcess.UpdateTime = fileProcess.EndTime
      _fileProcessDAO.update(fileProcess)
      _logger.info("Completed the ${FileDataMapping.BeanIOStreamName} process with the inbound file process id - ${fileProcess.ID}")
    }
    _logger.debug("Exiting the function 'process' of 'InboundFileReaderPlugin'")
  }

  /**
   * Loads integration specific custom data from header records to detail records to be inserted in database.
   * @param headerRecord
   * @param batchHeaderRecord
   * @param inboundData
   */
  override function loadHeaderData(headerRecord: FileRecordInfo, batchHeaderRecord: FileRecordInfo, inboundData: InboundFileData) {
  }

  /**
   * Reads the file data from the given path and creates and returns list of records of type FileRecordInfo.
   * @param filePath
   * @returns FileRecords
   */
  override function readFile(filePath: String): FileRecords {
    if (FileDataMapping.BeanIOStreamName == null) {
      ExceptionUtil.throwException(ErrorCode.MISSING_READ_FILE_IMPLEMENTATION)
    }
    return BeanIOHelper.readFile(FileDataMapping.BeanIOStreamName, filePath)
  }

  /**
   * Creates an inbound file process for the given filePath.
   * @param filePath
   */
  private function createInboundFileProcess(filePath: String): InboundFileProcess {
    var fileProcess: InboundFileProcess = new()
    fileProcess.FileName = filePath
    fileProcess.StartTime = fileProcess.CreateTime
    fileProcess.Status = ProcessStatus.InProgress
    fileProcess.CreateUser = _userName
    fileProcess.UpdateUser = _userName
    fileProcess.ID = _fileProcessDAO.insert(fileProcess)
    return fileProcess
  }

  /**
   * Creates an InboundFileException record based on the given input data.
   * @param fileProcessID
   * @param recordPayload
   * @param errorTypeInfo
   * @param errorDesc
   */
  private function createInboundFileDataException(fileProcessID: Integer, recordPayload: String, errorTypeInfo: ErrorTypeInfo, errorDesc: String) {
    var exceptionEntity: InboundFileException = new()
    exceptionEntity.CreateUser = _userName
    exceptionEntity.UpdateUser = _userName
    exceptionEntity.Payload = recordPayload
    exceptionEntity.ErrorType = errorTypeInfo
    exceptionEntity.ErrorDescription = errorDesc
    exceptionEntity.InboundFileProcessID = fileProcessID
    _fileExceptionDAO.insert(exceptionEntity)

  }
}