package una.integration.framework.persistence.util

uses java.beans.PropertyEditorSupport

/**
 * Property Editor to convert a BatchProcessType to value and vice versa.
 * Created By: vtadi on 5/18/2016
 */
class BatchProcessTypePropertyEditor extends PropertyEditorSupport{

  override property set AsText(text : String){
    Value = BatchProcessType.get(text)
  }

  override property get AsText(): String{
    return (Value as BatchProcessType).Code
  }

}