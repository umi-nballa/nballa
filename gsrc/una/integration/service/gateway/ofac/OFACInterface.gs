package una.integration.service.gateway.ofac
/**
 * Created with IntelliJ IDEA.
 * User: JGupta
 * Date: 9/22/16
 * Time: 9:47 AM
 * This Interface provides Ability to check Contact against OFAC SDN
 */
interface OFACInterface {
  /*
  *  This Methid is to validate contact against OFAC SDN
  * */
  function validateOFACEntity(insuredList: List<Contact>, policyPeriod: PolicyPeriod)
}