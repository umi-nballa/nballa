package una.integration.framework.persistence.util

uses java.beans.PropertyEditorSupport

/**
 * Property Editor to convert ProcessStatus into text value and vice versa.
 * Created By: vtadi on 5/18/2016
 */
class ProcessStatusPropertyEditor extends PropertyEditorSupport{

    override property set AsText(text : String){
      Value = ProcessStatus.AllValues.firstWhere( \ elt -> elt.Name == text)
    }

    override property get AsText(): String{
      return (Value as ProcessStatus).Name
    }
}