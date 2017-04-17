package una.integration.framework.file.outbound.model

uses java.util.ArrayList

/**
 * This class represents the records to be written to the outbound file
 * CreatedBy: Vempa Tadi on 01/03/2017
 */
class OutboundFile {
  var _headerRecord: Object       as HeaderRecord
  var _batches: List< OutboundFileBatch > as Batches
  var _trailerRecord: Object  as TrailerRecord

  /**
   * Initialization of variables
   */
  construct() {
    _batches = new ArrayList< OutboundFileBatch >()
  }
}