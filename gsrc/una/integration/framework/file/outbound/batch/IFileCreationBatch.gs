package una.integration.framework.file.outbound.batch

uses una.integration.framework.file.IFileIntegration
uses una.integration.framework.file.outbound.model.OutboundFile
uses una.integration.framework.file.outbound.persistence.OutboundFileData
uses una.integration.framework.file.outbound.persistence.OutboundFileProcess

uses java.util.Date

/**
 * Interface for a batch which creates a file based on records from integration table.
 * Any outbound batch which creates a file needs to implement this interface.
 * Created By: vtadi on 5/18/2016
 */
interface IFileCreationBatch extends IFileIntegration {

  /**
   * Specifies whether we need to continue batch processing or not if there is an error on a single record.
   */
  property get ContinueBatchOnError(): Boolean

  /**
   * Function to get the list of records from integration database for batch processing.
   * @return List<BaseEntity> - The list of integration table data records
   */
  function prepareDataForProcessing(): List< OutboundFileData >

  /**
   * Function to prepare data (header, details and trailer record) to write to the file.
   * @param outboundFileProcess - the file process instance
   * @param  entities - integration database entities.
   * @return OutboundFile - ordered list of objects needs to flush to the file.
   */
  function prepareDataForFile(outboundFileProcess: OutboundFileProcess, entities: List< OutboundFileData >): OutboundFile

  /**
   * Function to create name of the file.
   * @param startTime - the current time of creating the file.
   */
  function getFileName(startTime: DateTime): String

  /**
   * If this batch is not using BeanIO for file creation, write code to create file in this function.
   * @param outboundFileProcess - the file process instance
   * @param outboundFile - represents the records to be written to the file.
   */
  function createFile(outboundFileProcess: OutboundFileProcess, outboundFile: OutboundFile)

  /**
   * Custom processing after the file creation.
   * @param processedEntities - the list of records written to the file
   */
  function afterFileCreation(processedEntities: List<OutboundFileData>)
}