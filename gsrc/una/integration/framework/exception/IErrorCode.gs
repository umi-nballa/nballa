package una.integration.framework.exception

/**
 * Interface used in Exception Handling to represent Error Code and Message.
 * Created By: vtadi on 5/18/2016
 */
interface IErrorCode {
  property get ErrorNumber(): String
  property get ErrorMessage(): String
}