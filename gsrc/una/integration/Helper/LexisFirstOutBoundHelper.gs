package una.integration.Helper

uses una.integration.framework.exception.ExceptionUtil
uses una.integration.framework.persistence.context.PersistenceContext
uses una.integration.framework.persistence.dao.IntegrationBaseDAO
uses una.integration.framework.persistence.util.ProcessStatus
uses una.integration.framework.util.ErrorCode
uses una.integration.mapping.FileIntegrationMapping
uses una.logging.UnaLoggerCategory
uses una.model.LexisFirstFileData

uses java.lang.Exception
uses una.integration.plugins.lexisfirst.LexisFirstServicePayload

/**
 * Created to Insert LexisFirst Data to Integration DataBase
 * User: pavan theegala
 * Date: 12/15/16
 *
 */
class LexisFirstOutBoundHelper {

  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  private static final var CLASS_NAME = LexisFirstOutBoundHelper.Type.DisplayName
  private static final var HOME_OWNER = "Homeowners"


  /**
   *   This method is to insert Lexis first data to integration database
   *   @param beanDTO  contains policy period details
   */
   function  insertOutBoundFileData(beanDTO : LexisFirstFileData){
    _logger.debug(" Entering  " + CLASS_NAME + " :: " + "insertOutBoundFileData" + "For LexisFirst ")
    var outboundEntityDAO = new IntegrationBaseDAO(FileIntegrationMapping.LexisFirstOutbound)
    try {
    PersistenceContext.runWithNewTransaction( \-> {
      var outboundEntity = beanDTO
      outboundEntity.Status = ProcessStatus.UnProcessed
      outboundEntity.CreateUser = this.IntrinsicType.RelativeName
      outboundEntity.UpdateUser = outboundEntity.CreateUser
      outboundEntity.RetryCount = 0
      outboundEntityDAO.insert(outboundEntity)
    })
      _logger.debug(" Leaving  " + CLASS_NAME + " :: " + "insertOutBoundFileData" + "For LexisFirst ")
    } catch (exp: Exception) {
      ExceptionUtil.suppressException(ErrorCode.ERROR_INSERTING_OUTBOUND_RECORD, null, exp)
    }

  }

  /**
   *   Method to invoke Lexis First Helper class to generate a payload and insert data to IDS
   *   @param message  contains event fired messaging details
   */
   function createLexisFirstTransaction(message: Message){

    if(message.policyPeriod.Policy.Product == HOME_OWNER){
      var servicePayload = new LexisFirstServicePayload()
      var lexisFirstFileData = servicePayload.payLoadXML(message.PolicyPeriod,message.EventName)
      insertOutBoundFileData(lexisFirstFileData)
    }
  }

}