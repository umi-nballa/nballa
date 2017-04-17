package una.integration.framework.file.outbound.model

/**
 * This class represents a batch of records to be written to the outbound file
 * CreatedBy: Vempa Tadi on 01/03/2017
 */
class OutboundFileBatch {
  var _batchHeaderRecord: Object    as BatchHeader
  var _detailRecords: List<Object>  as DetailRecords
  var _batchTrailerRecord: Object   as BatchTrailer

}