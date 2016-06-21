package una.integration.framework.file.outbound.batch

uses una.integration.framework.exception.ErrorTypeInfo
uses una.integration.framework.exception.ExceptionUtil
uses una.integration.framework.file.outbound.persistence.OutboundFileData
uses una.integration.framework.file.outbound.persistence.OutboundFileException
uses una.integration.framework.file.outbound.persistence.OutboundFileProcess
uses una.logging.UnaLoggerCategory
uses una.integration.framework.persistence.context.PersistenceContext
uses una.integration.framework.persistence.dao.IntegrationBaseDAO
uses una.integration.framework.persistence.util.ProcessStatus
uses una.integration.framework.util.BeanIOHelper
uses una.integration.framework.util.ErrorCode
uses gw.api.util.DateUtil
uses gw.processes.BatchProcessBase

uses java.lang.Exception
uses java.lang.Integer
uses java.util.ArrayList
uses java.util.Date

/**
 * An abstract class with common implementation of file creation batches
 * Created By: vtadi on 5/18/2016
 */
abstract class FileCreationBatch extends BatchProcessBase implements IFileCreationBatch {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION

  var _userName: String
  var _outboundFileProcessDAO: IntegrationBaseDAO
  var _outboundFileExceptionDAO: IntegrationBaseDAO
  var _dataEntityDAO: IntegrationBaseDAO

  /**
   * Construct to call the super class construct
   */
  construct(bt: BatchProcessType) {
    super(bt)
    _userName = this.IntrinsicType.RelativeName
  }

  /**
   * Creates a file with the records from an integration table.
   */
  override function doWork() {
    _logger.info("{} batch process is started now", this.Type)
    var startTime = DateUtil.currentDate()
    _outboundFileProcessDAO = _outboundFileProcessDAO?: new(OutboundFileProcess)
    _outboundFileExceptionDAO = _outboundFileExceptionDAO?: new(OutboundFileException)
    _dataEntityDAO = _dataEntityDAO?: new(FileDataMapping)
    // Creating outbound file process record
    var outboundFileProcess = createOutboundFileProcess()

    try {
      outboundFileProcess.FileName = getFileName(outboundFileProcess.CreateTime)

      var entities = prepareDataForProcessing()
      this.OperationsExpected = entities.Count
      outboundFileProcess.TotalRecordCount = entities.Count

      var processedEntities = new ArrayList< OutboundFileData >()
      PersistenceContext.runWithNewTransaction( \-> {
        var updateTime = DateUtil.currentDate()

        entities.each( \ entity -> {
          try {
            updateEntity(outboundFileProcess.ID, entity, Processed, updateTime)
            this.incrementOperationsCompleted()
            outboundFileProcess.ProcessedRecordCount++
            processedEntities.add(entity)
          } catch (ex: Exception) {
            if (ContinueBatchOnError) {
              createProcessException(outboundFileProcess.ID, entity.ID, ErrorTypeInfo.Technical, ex)
              this.incrementOperationsFailed()
              outboundFileProcess.FailedRecordCount++
              ExceptionUtil.suppressException(ErrorCode.ERROR_PROCESSING_OUTBOUND_RECORD, null, ex)
              updateEntity(outboundFileProcess.ID, entity, Error, updateTime)
            } else {
              outboundFileProcess.ProcessedRecordCount = 0
              outboundFileProcess.FailedRecordCount = outboundFileProcess.TotalRecordCount
              throw ex
            }
          }
        })
        var fileOutObjects = prepareDataForFile(processedEntities)
        if (FileDataMapping.BeanIOStreamName != null) {
          BeanIOHelper.writeFile(FileDataMapping.BeanIOStreamName, outboundFileProcess.FileName, fileOutObjects)
        } else {
          createFile(outboundFileProcess.FileName, fileOutObjects, outboundFileProcess.CreateTime)
        }
        outboundFileProcess.Status = Processed
      })
    } catch (ex: Exception) {
      createProcessException(outboundFileProcess.ID, null, Technical, ex)
      outboundFileProcess.Status = ProcessStatus.Error
      outboundFileProcess.ProcessedRecordCount = 0
      outboundFileProcess.FailedRecordCount = outboundFileProcess.TotalRecordCount
      ExceptionUtil.throwException(ErrorCode.ERROR_CREATING_FILE, null, ex)
    } finally {
      var endTime = DateUtil.currentDate()
      outboundFileProcess.EndTime = endTime
      outboundFileProcess.UpdateTime = endTime

      PersistenceContext.runWithNewTransaction( \-> {
        _outboundFileProcessDAO.update(outboundFileProcess)
      })
      _logger.info("Batch (ID - {}) ran to completion. Took {} milli seconds to complete the batch (Total Record Count - {})", {outboundFileProcess.ID, endTime.Time - startTime.Time, this.OperationsExpected})
    }
  }

  /**
   * Indicates whether the batch process should continue processing other records when there is an error for a record.
   * This should be overridden and return false if batch should exit on record level error.
   */
  override property get ContinueBatchOnError(): Boolean {
    return true
  }

  /**
   * Retrieves the list of entities from integration table to process and create flat file.
   */
  override function prepareDataForProcessing(): List< OutboundFileData > {
    var results = _dataEntityDAO.selectByStatusList({ProcessStatus.UnProcessed, ProcessStatus.Error})
    return results.whereTypeIs(OutboundFileData)
  }

  /**
   * To be overridden by sub classes to convert the given entity list into the model object list used to write to the file.
   * @param entities the list of data entities
   * @return List<Object> the list of objects to write to the file.
   */
  override function prepareDataForFile(entities: List< OutboundFileData >): List<Object> {
    return entities
  }

  /**
   * This function needs to be implemented by the subclasses.
   * The default implementation here throws an exception indicating that.
   */
  override function createFile(fileName: String, fileRecords: List<Object>, startTime: DateTime) {
    ExceptionUtil.throwException(ErrorCode.INCOMPLETE_FILE_CREATION)
  }

  private function createOutboundFileProcess(): OutboundFileProcess {
    var fileProcess: OutboundFileProcess = new()
    fileProcess.BatchName = this.Type
    fileProcess.StartTime = fileProcess.CreateTime
    fileProcess.Status = ProcessStatus.InProgress
    fileProcess.CreateUser = _userName
    fileProcess.UpdateUser = _userName
    fileProcess.ID = _outboundFileProcessDAO.insert(fileProcess)
    return fileProcess
  }

  private function createProcessException(processID: Integer, dataID: Integer, errorType: ErrorTypeInfo, ex: Exception) {
    var exceptionEntity: OutboundFileException = new()
    exceptionEntity.OutboundFileProcessID = processID
    exceptionEntity.DataID = dataID
    exceptionEntity.ErrorType = errorType
    exceptionEntity.ErrorDescription = ex.Message?:"" + ex.StackTraceAsString
    exceptionEntity.Status = ProcessStatus.UnProcessed
    exceptionEntity.CreateUser = _userName
    exceptionEntity.UpdateUser = _userName
    _outboundFileExceptionDAO.insert(exceptionEntity)
  }

  private function updateEntity(fileProcessID: Integer, entity: OutboundFileData, status: ProcessStatus, updateTime: DateTime) {
    entity.OutboundFileProcessID = fileProcessID
    entity.Status = status
    if (status == ProcessStatus.Error) {
      entity.RetryCount++
    }
    entity.UpdateUser = _userName
    entity.UpdateTime = updateTime
    _dataEntityDAO.update(entity)
  }

}