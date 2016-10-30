package una.enhancements.entity

uses gw.lang.reflect.ReflectUtil
uses java.lang.IllegalArgumentException

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 9/27/16
 * Time: 10:47 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNABeanEnhancement : gw.pl.persistence.core.Bean {
  /*
  Similar to the "getFieldValue" function, which returns a database field-backed value for
  a given field name.  This returns the value of the field OR virtual property, including hidden fields
  Throws an IllegalArgumentException if the property is not found.
  */
  public function getPropertyValue(propertyName : String) : Object{
    var result : Object

    try{
      result = this.getFieldValue(propertyName)
    }catch(e : IllegalArgumentException){
      result = ReflectUtil.getProperty(this, propertyName)
    }

    return result
  }
}
