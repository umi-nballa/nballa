package gwservices.pc.dm.batch

uses com.gwservices.pc.dm.data.access.DAStatisticsRecord
uses com.gwservices.pc.dm.data.access.IDataAccessInbound
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.util.DMLogger
uses gwservices.pc.dm.util.MigrationUtil

uses java.lang.Throwable
uses java.util.Map

/**
 * XML model database implementation
 */
class DatabaseMigrationProcess extends AbstractMigrationProcess {
  /// Logging ///
  private static final var _LOG_TAG = "${DatabaseMigrationProcess.Type.RelativeName} - "
  private static final var _logger = DMLogger.General
  /// Data access configuration ///
  private static final var _OVER_RIDE = "OVER_RIDE"
  /** Data access plugin */
  private var _inBoundDataAccessPlugin: IDataAccessInbound
  construct(params: Map <String, String>) {
    super(params)
  }

  /**
   * Grab records from staging table and process
   */
  function executeMigration() {
    var minNumOfSequences = PropertyHelper.getIntProperty(MigrationUtil.SEQUENCE_MIN_PARAM)
    var maxNumOfSequences = PropertyHelper.getIntProperty(MigrationUtil.SEQUENCE_MAX_PARAM)
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "executeMigration loading inbound plugin")
      _logger.debug(_LOG_TAG + "executeMigration sequence minimum ${minNumOfSequences}, maximum ${maxNumOfSequences}")
    }
    try {
      _inBoundDataAccessPlugin = MigrationUtil.loadDataAccessInbound(PropertyHelper)
      var overrideProperties = _inBoundDataAccessPlugin.OverrideProperties.AllProperties
      if (overrideProperties.getProperty(_OVER_RIDE) as Boolean) {
        overrideProperties.Keys.map(\key -> key as String).each(\key -> {
          PropertyHelper.setProperty(key, overrideProperties.getProperty(key))
        })
      }
      _inBoundDataAccessPlugin.setConfiguration(PropertyHelper)
      if (_logger.InfoEnabled) {
        _logger.info(_LOG_TAG + "executeMigration starting for ${this.WorkerID}...")
      }
      if (minNumOfSequences != null and maxNumOfSequences != null) {
        _inBoundDataAccessPlugin.setSequenceNumbers(minNumOfSequences, maxNumOfSequences)
      }
      for (id in _inBoundDataAccessPlugin.getBatchIds()) {
        if (_logger.isInfoEnabled()) {
          _logger.info(_LOG_TAG + "executeMigration batch id ${id}")
        }
        _inBoundDataAccessPlugin.setBatchId(id)
        var record = _inBoundDataAccessPlugin.NextRecord
        while (record != null and not ScriptParameters.PauseMigration_Ext) {
          var migrationRecord = new MigrationRecord()
          migrationRecord.ID = record.Id
          migrationRecord.PayloadType = record.PayloadType
          migrationRecord.SequenceNumber = record.SequenceNumber
          if (safeParsePayload(record.Payload, migrationRecord)) {
            processRecord(migrationRecord)
          }
          record = _inBoundDataAccessPlugin.NextRecord
        }
      }
      if (_logger.InfoEnabled) {
        _logger.info(_LOG_TAG + "executeMigration finished for ${this.WorkerID}...")
      }
    } finally {
      if (_inBoundDataAccessPlugin != null) {
        _inBoundDataAccessPlugin.commit()
        _inBoundDataAccessPlugin.closeConnection()
      }
    }
  }

  override function handleSuccess(record: MigrationRecord) {
    _inBoundDataAccessPlugin.markProcessed(record.ID, WorkerID, record.ApplicationID)
    if (record.Statistics.HasElements) {
      var stats = record.Statistics.map(\dastat -> {
        var srecord = new DAStatisticsRecord() {
            : EntityName = dastat.EntityName,
            : FieldName = dastat.FieldName,
            : FieldBooleanValue = dastat.BooleanValue,
            : FieldDecimalValue = dastat.BigDecimalValue,
            : FieldIntValue = dastat.IntegerValue,
            : FieldStrValue = dastat.StringValue
        }
        return srecord
      })
      _inBoundDataAccessPlugin.addStatistics(record.ID, stats)
    }
    if (record.UpdatedXML != null) {
      _inBoundDataAccessPlugin.updatePayload(record.ID, record.UpdatedXML.asUTFString())
    }
    _inBoundDataAccessPlugin.commit()
  }

  override function handleFailure(recordId: long, sequenceNumber: long, ex: Throwable) {
    var code = CODE.GENERAL
    var message = ex.StackTraceAsString
    if (ex typeis DataMigrationNonFatalException) {
      code = ex.Code
      message = ex.Message
    } else if (ex.Cause typeis DataMigrationNonFatalException) {
      code = ex.Cause.Code
      message = ex.Cause.Message
    }
    if (_logger.isInfoEnabled()) {
      _logger.info(_LOG_TAG + "handleFailure for record ${recordId}, code ${code}, message ${message}")
      _logger.info(_LOG_TAG + ex.StackTraceAsString)
    }
    _inBoundDataAccessPlugin.markError(recordId, WorkerID, code as String, message)
    _inBoundDataAccessPlugin.markDelayed(sequenceNumber)
    _inBoundDataAccessPlugin.commit()
  }
}
