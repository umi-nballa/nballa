package una.integration.service.propertyinspections

uses gw.xml.ws.annotation.WsiWebService
uses una.integration.Helper.PropertyInspection

/**
 * This is the Custom Integration API, which is published in Policy center.
 * notifyFirstPayment(policyNumber: String ) method is called when the first payment over a particular policy is done from Billing Center
 * Created by : AChandrashekar on Date: 9/27/16 - Time: 9:05 AM
 */

@WsiWebService("http://guidewire.com/pc/ws/una/integration/service/propertyinspections/CustomIntegrationAPI")
class CustomIntegrationAPI {

  /**
   * This is the method which is called from Billing Center when the first payment is done over the Policy
   */
  function notifyFirstPayment(policyNumber: String ) {
    var propertyInspection= new PropertyInspection()
    propertyInspection.inserttoIntegrationDB(policyNumber)
  }
}