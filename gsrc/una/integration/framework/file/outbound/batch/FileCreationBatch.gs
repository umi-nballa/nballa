package una.integration.framework.file.outbound.batch

uses gw.api.util.DateUtil
uses gw.processes.BatchProcessBase
uses una.integration.framework.exception.ErrorTypeInfo
uses una.integration.framework.exception.ExceptionUtil
uses una.integration.framework.file.outbound.persistence.OutboundFileData
uses una.integration.framework.file.outbound.persistence.OutboundFileException
uses una.integration.framework.file.outbound.persistence.OutboundFileProcess
uses una.integration.framework.persistence.context.PersistenceContext
uses una.integration.framework.persistence.dao.IntegrationBaseDAO
uses una.integration.framework.persistence.util.ProcessStatus
uses una.integration.framework.util.BeanIOHelper
uses una.integration.framework.util.ErrorCode
uses una.logging.UnaLoggerCategory

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

  protected var _userName: String
  protected var _outboundFileProcessDAO: IntegrationBaseDAO
  protected var _outboundFileExceptionDAO: IntegrationBaseDAO
  protected var _dataEntityDAO: IntegrationBaseDAO

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
        createFile(outboundFileProcess, fileOutObjects)
        outboundFileProcess.Status = Processed
        afterFileCreation(processedEntities)
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
   * This should be overridden and return true if batch should continue processing other records.
   */
  override property get ContinueBatchOnError(): Boolean {
    return false
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
   * This function should be implemented by subclasses if the BeanIOStreamName is not configured
   */
  override function createFile(outboundFileProcess: OutboundFileProcess, fileRecords: List<Object>) {
    if (FileDataMapping.BeanIOStreamName != null) {
      outboundFileProcess.FileName = getFileName(outboundFileProcess.CreateTime)
      BeanIOHelper.writeFile(FileDataMapping.BeanIOStreamName, outboundFileProcess.FileName, fileRecords)
    } else {
      ExceptionUtil.throwException(ErrorCode.INCOMPLETE_FILE_CREATION)
    }
  }

  /**
   * Function to create name of the file.
   * @param startTime - the current time of creating the file.
   */
  override function getFileName(startTime: DateTime): String {
    ExceptionUtil.throwException(ErrorCode.NO_FILE_NAME)
    return null
  }

  /**
   * Overridden by the sub classes with custom processing after the file creation.
   * @param processedEntities - the list of records written to the file
   */
  override function afterFileCreation(processedEntities: List<OutboundFileData>) { }

  protected function createOutboundFileProcess(): OutboundFileProcess {
    var fileProcess: OutboundFileProcess = new()
    fileProcess.BatchName = this.Type
    fileProcess.StartTime = fileProcess.CreateTime
    fileProcess.Status = ProcessStatus.InProgress
    fileProcess.CreateUser = _userName
    fileProcess.UpdateUser = _userName
    fileProcess.ID = _outboundFileProcessDAO.insert(fileProcess)
    return fileProcess
  }

  protected function createProcessException(processID: Integer, dataID: Integer, errorType: ErrorTypeInfo, ex: Exception) {
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

  protected function updateEntity(fileProcessID: Integer, entity: OutboundFileData, status: ProcessStatus, updateTime: DateTime) {
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