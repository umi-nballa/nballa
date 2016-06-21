package una.integration.framework.persistence.util

uses una.integration.framework.exception.ErrorTypeInfo
uses org.springframework.beans.BeanWrapper
uses org.springframework.jdbc.core.BeanPropertyRowMapper

uses java.lang.Class

/**
 * Defines mapping from database table row data to custom bean property values.
 * Used as RowCallbackHandler while querying integration database.
 * Created By: vtadi on 5/18/2016
 */
class CustomBeanPropertyRowMapper extends BeanPropertyRowMapper {
  construct(className : Class){
    super(className)
  }

  override function initBeanWrapper(bw :BeanWrapper){
    bw.registerCustomEditor(BatchProcessType, new BatchProcessTypePropertyEditor())
    bw.registerCustomEditor(ProcessStatus, new ProcessStatusPropertyEditor())
    bw.registerCustomEditor(ErrorTypeInfo, new ErrorTypeInfoPropertyEditor())
  }

}