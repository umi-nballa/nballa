package una.integration.framework.file.inbound.plugin

uses una.integration.framework.file.IFileIntegration
uses una.integration.framework.file.inbound.model.FileRecordInfo

/**
 * Interface to be implemented by Inbound File Reader Plugin implementations.
 * Created By: vtadi on 5/18/2016
 */
interface IFileReaderPlugin extends IFileIntegration {

  /**
   * Reads the file data from the given path and creates and returns list of records of type FileRecordInfo.
   * @param filePath
   * @returns List<FileRecordInfo>
   */
  function readFile(filePath: String): List<FileRecordInfo>

}