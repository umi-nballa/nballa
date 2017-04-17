package una.integration.framework.file.outbound.persistence

uses una.integration.framework.persistence.dao.IntegrationBaseDAO
uses una.integration.framework.persistence.util.ProcessStatus
uses una.logging.UnaLoggerCategory

uses java.util.Date
uses java.util.HashMap

/**
 * The DAO class for CRUD operations on the OutboundFileProcess table.
 * Created by VTadi on 2/1/2017
 */
class OutboundFileProcessDAO extends IntegrationBaseDAO {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION

  /**
   * Constructor to initialize data for OutboundFileProcess class
   */
  construct() {
    super(OutboundFileProcess)
  }

  /**
   * Retrieves the most recent file creation date for the given outbound file creation batch.
   */
  function getLastFileCreationDate(batch : BatchProcessType)  : Date {
    _logger.debug("Entering the function 'getLastFileCreationDate' of OutboundFileProcessDAO ")
    var whereClause = "BatchName = :BATCHNAME and Status = :STATUS and ProcessedRecordCount > 0 order by CreateTime desc"
    var valueMap = new HashMap<String, Object>()
    valueMap.put("BATCHNAME", batch.Code)
    valueMap.put("STATUS", ProcessStatus.Processed.Code)
    _logger.debug("Exiting the function 'getLastFileCreationDate' of OutboundFileProcessDAO")
    return select(whereClause, valueMap)?.first().CreateTime
  }

}