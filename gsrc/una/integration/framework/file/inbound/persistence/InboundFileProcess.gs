package una.integration.framework.file.inbound.persistence

uses una.integration.framework.persistence.entity.BaseEntity

uses java.util.Date

/**
 * Represents an inbound file process data.
 * Created By: vtadi on 5/18/2016
 */
class InboundFileProcess extends BaseEntity {
  var fileName: String          as FileName
  var totalRecordCount: int     as TotalRecordCount = 0
  var processedRecordCount:int  as ProcessedRecordCount = 0
  var failedRecordCount: int    as FailedRecordCount = 0
  var startTime: Date           as StartTime
  var endTime: Date             as EndTime
}