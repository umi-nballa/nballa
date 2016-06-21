package una.integration.framework.persistence.util

uses una.integration.framework.exception.ErrorTypeInfo

uses java.beans.PropertyEditorSupport

/**
 * Property Editor to convert ErrorType to text value and vice versa.
 * Created By: vtadi on 5/18/2016
 */
class ErrorTypeInfoPropertyEditor extends PropertyEditorSupport {

    override property set AsText(text : String){
      Value = ErrorTypeInfo.AllValues.firstWhere( \ elt -> elt.Name == text)
    }

    override property get AsText(): String{
      return (Value as ErrorTypeInfo).Name
    }
}