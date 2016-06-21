package una.integration.framework.file.outbound.persistence

uses una.integration.framework.persistence.entity.BaseEntity

uses java.util.Date

/**
 * Gosu class equivalent to the OutboundFileProcess table in the integration database.
 * Created By: vtadi on 5/18/2016
 */
class OutboundFileProcess extends BaseEntity {
  var _batchName: BatchProcessType  as BatchName
  var _fileName: String             as FileName
  var _totalRecordCount: int        as TotalRecordCount = 0
  var _processedRecordCount: int    as ProcessedRecordCount = 0
  var _failedRecordCount: int       as FailedRecordCount = 0
  var _startTime: Date              as StartTime
  var _endTime: Date                as EndTime

}