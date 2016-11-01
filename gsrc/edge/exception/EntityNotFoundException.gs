package edge.exception
uses edge.exception.ApplicationErrorCode
uses java.lang.Throwable

class EntityNotFoundException extends ApplicationException {
  
  private var _showExceptionData:boolean as ShowExceptionData = false

  construct(){
    super(ApplicationErrorCode.GW_ENTITY_NOT_FOUND_ERROR)
  }
   
  construct(myCause: Throwable){
    super(ApplicationErrorCode.GW_ENTITY_NOT_FOUND_ERROR, myCause)
  }
  
  override property get Data(): Object {
    return ShowExceptionData ? super.Data: null
  }
}
