package una.integration.framework.file.outbound.persistence

uses una.integration.framework.persistence.entity.ExceptionBaseEntity

uses java.lang.Integer

/**
 * The Exception data class used for the outbound file integrations.
 * Created By: vtadi on 5/18/2016
 */
class OutboundFileException extends ExceptionBaseEntity {
  var _dataID: Integer        as DataID
  var _fileProcessID: Integer as OutboundFileProcessID
}