package una.integration.framework.file

/**
 * Base Interface for all the flat file integrations abstractions.
 * Created By: vtadi on 5/18/2016
 */
interface IFileIntegration {

  /**
   * Returns a mapping of DTO class, Table Name, and BeanIO Stream name for the flat file integration.
   */
  property get FileDataMapping(): IFileDataMapping

}