package una.integration.framework.file.outbound.plugin

uses una.integration.framework.file.IFileIntegration
uses una.integration.framework.file.outbound.persistence.OutboundFileData

/**
 * Interface to be implemented by the MessageTransport implementations for outbound flat file integrations.
 * Created By: vtadi on 5/18/2016
 */
interface IFileDataTransport extends IFileIntegration {

  /**
   * Creates the outbound file data object(s) for the given payload.
   * @param payload
   * @returns OutboundFileData
   */
  function createOutboundFileData(payload: String): List<OutboundFileData>
}