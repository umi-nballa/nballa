package una.integration.framework.file.inbound.plugin

uses una.integration.framework.file.IFileIntegration
uses una.integration.framework.file.inbound.model.FileRecordInfo
uses una.integration.framework.file.inbound.model.FileRecords
uses una.integration.framework.file.inbound.persistence.InboundFileData

/**
 * Interface to be implemented by Inbound File Reader Plugin implementations.
 * Created By: vtadi on 5/18/2016
 */
interface IFileReaderPlugin extends IFileIntegration {

  /**
   * Reads the file data from the given path and creates and returns FileRecords object with file records.
   * @param filePath
   * @returns FileRecords
   */
  function readFile(filePath: String): FileRecords

  /**
   * Loads integration specific custom data from header records to detail records to be inserted in database.
   * @param headerRecord
   * @param batchHeaderRecord
   * @param inboundData
   */
  function loadHeaderData(headerRecord: FileRecordInfo, batchHeaderRecord: FileRecordInfo, inboundData: InboundFileData)

}