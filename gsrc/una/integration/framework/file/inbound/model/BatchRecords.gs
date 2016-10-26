package una.integration.framework.file.inbound.model

uses java.util.ArrayList

/**
 * This class represents all the records in a batch for an inbound flat file.
 * CreatedBy: Vempa Tadi on 09/21/2016
 */
class BatchRecords {
  var _batchHeaderRecord: FileRecordInfo    as BatchHeaderRecord
  var _detailRecords: List<FileRecordInfo>  as DetailRecords
  var _batchTrailerRecord: FileRecordInfo   as BatchTrailerRecord

  /**
   * Initialization of variables
   */
  construct() {
    _detailRecords = new ArrayList<FileRecordInfo>()
  }
}