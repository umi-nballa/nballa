package acc.appliedsystems.util

uses org.slf4j.LoggerFactory
/**
 * Custom message context
 * User: mpham
 * Date: 10/30/15
 * Time: 10:28 AM
 * To change this template use File | Settings | File Templates.
 */
class CustomMessageContext {
  private var logger = LoggerFactory.getLogger("CustomMessageContext")
  construct() { }
  /**
   *   Convert messageContext to XML
   *   @param messageContext
   *   @return message is converted to xml
   */
  public  function handleConvertPolicyPeriodToXml(anPolicyPeriod:PolicyPeriod):String{
    logger.debug(\ -> "CustomMessageContext# handleConvertPolicyPeriodToXml()- ${anPolicyPeriod.Policy.ID}  - Entering")
    var sPolicyPeriod = anPolicyPeriod.getSlice(anPolicyPeriod.EditEffectiveDate)
    var msg : String
    var product = anPolicyPeriod.Policy.ProductCode
    logger.info(\ -> "ProductCode=${product}")
    if (product == "Homeowners") {
      logger.debug(\ -> "generate message for Homeowners")
      var xml = new acc.appliedsystems.homeowners.policyperiodmodel.PolicyPeriod(sPolicyPeriod)
      msg =  xml.asUTFString()
    }

    logger.debug(\ -> "handleConvertPolicyPeriodToXml() exit. JobNumber:  ${anPolicyPeriod.Policy.ID}")
    return msg
  }
}