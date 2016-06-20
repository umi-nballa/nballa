package una.integration.framework.file.outbound.persistence

uses una.integration.framework.persistence.entity.BaseEntity

uses java.lang.Integer

/**
 * Base class for all the outbound file integration data objects.
 * Created By: vtadi on 5/18/2016
 */
abstract class OutboundFileData extends BaseEntity {
  var _outboundFileProcessID: Integer   as OutboundFileProcessID
  var _retryCount: Integer      as RetryCount = 0
}