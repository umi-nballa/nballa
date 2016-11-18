package una.integration.framework.file.inbound.plugin

uses gw.pl.persistence.core.Bundle
uses una.integration.framework.file.inbound.model.FileRecordInfo
uses una.integration.framework.file.inbound.model.FileRecords

/**
 * Interface to be implemented by Inbound File Processing Plugin implementations without inserting data into Integration Database.
 * Created By: vtadi on 9/27/2016
 */
interface IFileProcessingPlugin {

  /**
   * The BeanIO Stream Name used to read the inbound flat file.
   */
  property get BeanIOStream(): String

  /**
   * Processes the inbound detail record into the GW application.
   */
  function processDetailRecord(fileName: String, headerRecord: FileRecordInfo, batchHeaderRecord: FileRecordInfo, detailRecord: FileRecordInfo, bundle: Bundle)

  /**
   * Validates the batch header record for mandatory information to process the detail records.
   */
  function validateBatchHeader(batchHeaderRecord: FileRecordInfo)

  /**
   * Validates the file for mandatory information to process the detail records.
   */
  function validateFile(fileName: String, fileRecords: FileRecords)

  /**
   * Creates the error file with all the records which can't be processed due to business/technical errors.
   */
  function processFailedRecords(fileRecords: FileRecords, filePath: java.nio.file.Path)

}