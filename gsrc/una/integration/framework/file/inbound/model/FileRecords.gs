package una.integration.framework.file.inbound.model

uses java.util.ArrayList

/**
 * This class represents the records available in an inbound file
 * CreatedBy: Vempa Tadi on 09/21/2016
 */
class FileRecords {
  var _headerRecord: FileRecordInfo   as HeaderRecord
  var _batches: List<BatchRecords>    as Batches
  var _trailerRecord: FileRecordInfo  as TrailerRecord

  /**
   * Initialization of variables
   */
  construct() {
    _batches = new ArrayList<BatchRecords>()
  }
}