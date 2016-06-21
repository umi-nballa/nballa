package una.integration.framework.file.inbound.batch

uses una.integration.framework.exception.ErrorTypeInfo
uses una.integration.framework.exception.ExceptionUtil
uses una.integration.framework.file.inbound.persistence.InboundFileData
uses una.integration.framework.file.inbound.persistence.InboundFileException
uses una.logging.UnaLoggerCategory
uses una.integration.framework.persistence.context.PersistenceContext
uses una.integration.framework.persistence.dao.IntegrationBaseDAO
uses una.integration.framework.persistence.util.ProcessStatus
uses una.integration.framework.util.ErrorCode
uses gw.api.util.DateUtil
uses gw.processes.BatchProcessBase

uses java.lang.Exception

/**
 * Base class for any custom batch process that needs to read data from integration database, validate and process records into any Guidewire product.
 * Created By: vtadi on 5/18/2016
 */
abstract class InboundDataProcessingBatch extends BatchProcessBase implements IDataProcessingBatch {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION

  var _dataEntityDAO: IntegrationBaseDAO
  var _fileExceptionDAO: IntegrationBaseDAO

  /**
   * Construct to pass the batch process type to the super class.
   */
  construct(batchType: BatchProcessType) {
    super(batchType)
  }

  /**
   * This function reads data from integration database based on the mapping provided in the FileDataMapping,
   * and delegates data validation and data processing to subclass,
   * and inserts the validation errors, if any, into the integration database,
   * and updates the process status of each record.
   */
  override function doWork() {
    _logger.debug("Entry into the method doWork of InboundDataProcessingBatch")
    _dataEntityDAO = _dataEntityDAO?: new(FileDataMapping)
    _fileExceptionDAO = _fileExceptionDAO?: new(InboundFileException)

    var entities = _dataEntityDAO.selectByStatusList({ProcessStatus.UnProcessed, ProcessStatus.Error})
    entities.whereTypeIs(InboundFileData).each( \ inboundEntity -> {
      var exceptionEntity: InboundFileException
      try {
        var validationErrors = validateData(inboundEntity)
        if (validationErrors != null && validationErrors.HasElements) {
          ExceptionUtil.throwException(ErrorCode.INBOUND_DATA_RECORD_VALIDATION_ERROR, validationErrors)
        } else {
          processData(inboundEntity)
        }
        inboundEntity.Status = ProcessStatus.Processed
      } catch (ex: Exception) {
        inboundEntity.Status = ProcessStatus.Error
        inboundEntity.RetryCount++
        exceptionEntity = createExceptionEntity(ex, inboundEntity)
      } finally {
        inboundEntity.UpdateUser = this.IntrinsicType.RelativeName
        inboundEntity.UpdateTime = DateUtil.currentDate()
        PersistenceContext.runWithNewTransaction( \-> {
          _dataEntityDAO.update(inboundEntity)
          if (exceptionEntity != null) {
            _fileExceptionDAO.insert(exceptionEntity)
          }
        })
      }
    })
    _logger.debug("Exit from method doWork of InboundDataProcessingBatch")
  }

  /**
   * Creates Cash Receipt exception entity for the given exception and cashReceipt details.
   */
  private function createExceptionEntity(ex: Exception, inboundEntity: InboundFileData): InboundFileException {
    var exceptionEntity: InboundFileException = new()
    exceptionEntity.InboundFileProcessID = inboundEntity.InboundFileProcessID
    exceptionEntity.DataID = inboundEntity.ID
    exceptionEntity.Payload = ""
    exceptionEntity.ErrorType = ErrorTypeInfo.Technical
    exceptionEntity.ErrorDescription = ex.Message?:"" + ex.StackTraceAsString
    exceptionEntity.UpdateUser = this.IntrinsicType.RelativeName
    exceptionEntity.UpdateTime = DateUtil.currentDate()
    return exceptionEntity
  }


}