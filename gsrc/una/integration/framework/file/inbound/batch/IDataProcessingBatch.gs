package una.integration.framework.file.inbound.batch

uses una.integration.framework.exception.FieldErrorInformation
uses una.integration.framework.file.IFileIntegration
uses una.integration.framework.file.inbound.persistence.InboundFileData

/**
 * Interface for any inbound batch process that needs to validate and process data into any guidewire product.
 * Created By: vtadi on 5/18/2016
 */
interface IDataProcessingBatch extends IFileIntegration {

  /**
   * Validates the inbound data record and returns the field validation errors, if any.
   * @param inboundData
   * @returns List<FieldErrorInformation>
   */
  function validateData(inboundData: InboundFileData): List<FieldErrorInformation>

  /**
   * Processes the inbound data record into the product database.
   * @param inboundData
   */
  function processData(inboundData: InboundFileData)

}