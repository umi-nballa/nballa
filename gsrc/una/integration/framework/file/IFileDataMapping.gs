package una.integration.framework.file

uses gw.lang.reflect.gs.IGosuClass

/**
 * Contains mapping of DTO class, Table Name, and BeanIO Stream name for a flat file integration.
 * Created By: vtadi on 5/18/2016
 */
interface IFileDataMapping {
  property get DataClass(): IGosuClass
  property get DataTableName(): String
  property get BeanIOStreamName(): String
}