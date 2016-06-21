package una.integration.framework.file.inbound.persistence

uses una.integration.framework.persistence.entity.BaseEntity

uses java.lang.Integer

/**
 * Base class for inbound file integration entities.
 * This class defines the common fields for all inbound file integration entity objects.
 * Created By: vtadi on 5/18/2016
 */
abstract class InboundFileData extends BaseEntity {
  var _inboundFileProcessID: Integer   as InboundFileProcessID
  var _retryCount: Integer      as RetryCount = 0
}