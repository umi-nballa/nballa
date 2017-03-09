package una.integration.Helper

uses una.integration.framework.exception.ExceptionUtil
uses una.integration.framework.persistence.context.PersistenceContext
uses una.integration.framework.persistence.dao.IntegrationBaseDAO
uses una.integration.framework.persistence.util.ProcessStatus
uses una.integration.framework.util.ErrorCode
uses una.integration.mapping.FileIntegrationMapping
uses una.logging.UnaLoggerCategory
uses una.model.LexisFirstFileData
uses gw.plugin.billing.bc800.BCBillingSystemPlugin
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
  var billingSystemPlugin :BCBillingSystemPlugin
  var lexisFirstFileData :LexisFirstFileData
  var servicePayload :LexisFirstServicePayload
  var policyPeriod:PolicyPeriod


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
      throw exp
    }

  }

  /**
   *   Method to invoke Lexis First Helper class to generate a payload and insert data to IDS
   *   @param message  contains event fired messaging details
   */
   function createLexisFirstTransaction(message: Message){
     _logger.debug(" Entering  " + CLASS_NAME + " :: " + "createLexisFirstTransaction" + "For LexisFirst ")
     var PayerData:AddlInterestDetail
     policyPeriod = message.PolicyPeriod.getSlice(message.PolicyPeriod.EditEffectiveDate)
    if(policyPeriod.Policy.Product == HOME_OWNER){
      var addInterest = policyPeriod.HomeownersLine_HOE.Dwelling?.AdditionalInterestDetails
      if(addInterest.length>0){
         PayerData = primaryPayerAsMortgage(policyPeriod)
      }
      for(mortgage in addInterest) {
        if (mortgage != null && (mortgage.AdditionalInterestType == typekey.AdditionalInterestType.TC_MORTGAGEE or
            mortgage.AdditionalInterestType == typekey.AdditionalInterestType.TC_FIRSTMORTGAGEE_EXT or
            mortgage.AdditionalInterestType == typekey.AdditionalInterestType.TC_SECONDMORTGAGEE_EXT or
            mortgage.AdditionalInterestType == typekey.AdditionalInterestType.TC_THIRDMORTGAGEE_EXT)){
          servicePayload = new LexisFirstServicePayload()
          lexisFirstFileData = servicePayload.payLoadXML(policyPeriod,message.EventName,mortgage,PayerData)
          insertOutBoundFileData(lexisFirstFileData)
        }
      }
    }
     _logger.debug(" Leaving  " + CLASS_NAME + " :: " + "createLexisFirstTransaction" + "For LexisFirst ")
  }

  private function primaryPayerAsMortgage(Period:PolicyPeriod) :AddlInterestDetail{
    var addlInterestDetail:AddlInterestDetail
    billingSystemPlugin = new BCBillingSystemPlugin()
    var primaryPayer = billingSystemPlugin.searchPrimaryPayer(Period.Policy.Account.AccountNumber)
    if (primaryPayer != null) {
      var fetchContact = gw.api.database.Query.make(Contact).compare(Contact#AddressBookUID, Equals, primaryPayer).select().AtMostOneRow
      var addInterest = Period.HomeownersLine_HOE.Dwelling?.AdditionalInterestDetails
      addlInterestDetail = addInterest?.firstWhere(\addlInt -> addlInt.PolicyAddlInterest.ContactDenorm.AddressBookUID == fetchContact.AddressBookUID)
      if (addlInterestDetail != null && (addlInterestDetail.AdditionalInterestType == typekey.AdditionalInterestType.TC_MORTGAGEE or
          addlInterestDetail.AdditionalInterestType == typekey.AdditionalInterestType.TC_FIRSTMORTGAGEE_EXT or
          addlInterestDetail.AdditionalInterestType == typekey.AdditionalInterestType.TC_SECONDMORTGAGEE_EXT or
          addlInterestDetail.AdditionalInterestType == typekey.AdditionalInterestType.TC_THIRDMORTGAGEE_EXT)){
          return addlInterestDetail
      }
    }
    return addlInterestDetail
  }

}