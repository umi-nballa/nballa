package una.integration.service.propertyinspections

uses gw.xml.ws.annotation.WsiWebService
uses una.integration.Helper.PropertyInspectionHelper
uses una.integration.Helper.PropertyInspectionsBRHelper
uses una.logging.UnaLoggerCategory
uses gw.api.database.Query
uses una.integration.framework.exception.FieldErrorInformation
uses java.lang.Exception
uses una.integration.framework.exception.ExceptionUtil
uses una.integration.util.propertyinspections.UnaErrorCode
uses java.util.HashMap

/**
 * This is the Custom Integration API, which is published in Policy center.
 * notifyFirstPayment(policyNumber: String ) method is called when the first payment over a particular policy is done from Billing Center
 * Created by : AChandrashekar on Date: 9/27/16 - Time: 9:05 AM
 */

@WsiWebService("http://guidewire.com/pc/ws/una/integration/service/propertyinspections/CustomIntegrationAPI")
class CustomIntegrationAPI {
  final static  var LOGGER = UnaLoggerCategory.INTEGRATION
  var CLASS_NAME=CustomIntegrationAPI.Type.DisplayName

  /**
   * This is the method which is called from Billing Center when the first payment is done over the Policy
   */
  function notifyFirstPayment(policyNumber: String ) {
    LOGGER.debug("Entering notifyFirstPayment() method of "+CLASS_NAME)
    var propertyInspection= new PropertyInspectionHelper ()
    var policyPeriod:PolicyPeriod=null;
    var propertyInspectionsBRHelper : PropertyInspectionsBRHelper= new()
    policyPeriod = Query.make(PolicyPeriod).compare(PolicyPeriod#PolicyNumber, Equals, policyNumber).select().last()
    var reportData = new HashMap<String, String>()
    if(policyPeriod!=null ){
      reportData = propertyInspectionsBRHelper.getReportData(policyNumber)
    }

    if (!reportData.Empty && reportData.size()>0) {
      try{
        propertyInspection.insertToIntegrationDB(policyNumber,reportData)
        gw.transaction.Transaction.runWithNewBundle(\bundle -> {
          bundle.add(policyPeriod)
          policyPeriod.createCustomHistoryEvent(CustomHistoryType.TC_INSPECTIONORDERED, \ -> displaykey.Web.InspectionScore.Event.Msg)
        })
        LOGGER.info("Policy is sent for Property Inspections"+policyNumber)
      } catch(ex : Exception){
        var fieldError = new FieldErrorInformation()  {:FieldName = "data insertion", :FieldValue = policyNumber}
        ExceptionUtil.throwException(UnaErrorCode.DATA_INSERTION_FAILURE, {fieldError})
      }

    }else {
      LOGGER.info("BR's are not Satisfied :: Policy is Not sent to Property Inspections"+policyPeriod)
    }
    LOGGER.debug("Exiting notifyFirstPayment() method of "+CLASS_NAME)
  }
}