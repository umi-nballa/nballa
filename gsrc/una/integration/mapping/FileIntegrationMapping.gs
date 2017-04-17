package una.integration.mapping

uses una.integration.framework.file.IFileDataMapping
uses gw.lang.reflect.gs.IGosuClass
uses una.model.LexisFirstFileData
uses una.model.PropertyInspectionData

/**
 * This Enum implements IFileDataMapping and provides mapping for each flat file integration.
 * This contains mapping of Gosu class to hold integration data, database table name, BeanIOStream name into one enum value
 * Created By: vtadi on 5/18/2016
 */
enum FileIntegrationMapping implements IFileDataMapping {

    LexisFirstOutbound(LexisFirstFileData,DataTable.LexisFirstOutboundFileData,BeanIOStream.LexisFirstOutBoundIntegration),
    PropertyInspectionNewBusiness(PropertyInspectionData,DataTable.PropertyInspectionsNBData,null)

  enum DataTable {
   LexisFirstOutboundFileData,
   PropertyInspectionsNBData
  }

  enum BeanIOStream {
    LexisFirstOutBoundIntegration
  }

  var _dataClass: IGosuClass
  var _dataTable: DataTable
  var _beanIOStream: BeanIOStream

  /**
   * Initializing values for the enum
   */
  private construct(dataClass: IGosuClass, dataTable: DataTable, beanIOStream: BeanIOStream) {
    _dataClass = dataClass
    _dataTable = dataTable
    _beanIOStream = beanIOStream
  }

  override property get DataClass(): IGosuClass {
    return _dataClass
  }

  override property get DataTableName(): String {
    return _dataTable.Name
  }

  override property get BeanIOStreamName(): String {
    return _beanIOStream.Name
  }

}