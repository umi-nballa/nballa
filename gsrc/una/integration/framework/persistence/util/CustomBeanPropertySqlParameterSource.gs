package una.integration.framework.persistence.util

uses una.integration.framework.exception.ErrorTypeInfo
uses org.springframework.beans.BeanWrapper
uses org.springframework.beans.PropertyAccessorFactory
uses org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource

/**
 * Defines mapping from custom bean property values to database table column values.
 * Used to retried the values from custom bean while querying database table.
 * Created By: vtadi on 5/18/2016
 */
class CustomBeanPropertySqlParameterSource extends BeanPropertySqlParameterSource {
  var beanWrapper : BeanWrapper as BeanWrapper
  construct(obj : Object){
    super(obj)
    beanWrapper = PropertyAccessorFactory.forBeanPropertyAccess(obj)
  }

  override function getValue(paramName : String) : Object {
    var result = BeanWrapper.getPropertyValue(paramName)

    if (result typeis BatchProcessType){
      return result.Code
    } else if(result typeis ProcessStatus){
      return result.Name
    } else if (result typeis ErrorTypeInfo) {
      return result.Name
    } else {
      return result
    }
  }
}