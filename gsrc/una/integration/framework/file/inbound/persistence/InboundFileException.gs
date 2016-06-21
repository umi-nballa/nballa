package una.integration.framework.file.inbound.persistence

uses una.integration.framework.persistence.entity.ExceptionBaseEntity

uses java.lang.Integer

/**
 * This class holds exception data relevant to any inbound file integration process/entity.
 * Created By: vtadi on 5/18/2016
 */
class InboundFileException extends ExceptionBaseEntity {
  var _dataID: Integer        as DataID
  var _fileProcessID: Integer as InboundFileProcessID
}