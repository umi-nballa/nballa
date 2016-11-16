package una.integration.framework.file.inbound.persistence

uses una.integration.framework.persistence.dao.IntegrationBaseDAO
uses una.integration.framework.persistence.util.ProcessStatus
uses una.logging.UnaLoggerCategory

uses java.util.HashMap

/**
 * The DAO class for CRUD operations into the InboundFileProcess entity.
 * Created By: vtadi on 5/18/2016
 */
class InboundFileProcessDAO extends IntegrationBaseDAO {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION

  construct() {
    super(InboundFileProcess)
  }

  /**
   * Checks if there is an existing process with the same name and process status.
   * @param fileName
   * @param processStatus
   * @returns Boolean indicates whether there is a duplicate process with the same name and status.
   */
  function isDuplicateProcess(fileName: String, processStatus: ProcessStatus): Boolean {
    _logger.debug("Entering the function 'isDuplicateProcess' of InboundFileProcessDAO")
    var whereClause = "FILENAME = :FILENAME and STATUS = :STATUS"
    var valueMap = new HashMap<String, String>()
    valueMap.put("FILENAME", fileName)
    valueMap.put("STATUS", processStatus.Code)
    _logger.debug("Exiting the function 'isDuplicateProcess' of InboundFileProcessDAO")
    return select(whereClause, valueMap).Count > 0
  }


}