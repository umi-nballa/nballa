package una.integration.service.gateway.ofac
/**
 * Created with IntelliJ IDEA.
 * User: JGupta
 * Date: 9/22/16
 * Time: 9:47 AM
 * To change this template use File | Settings | File Templates.
 */
interface OFACInterface {
  function validateOFACEntity(insuredList: List<Contact>, policyPeriod: PolicyPeriod)
}