package una.integration.mapping.ofac

uses una.logging.UnaLoggerCategory

uses java.lang.Integer
uses java.util.HashMap

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 12/7/16
 * Time: 4:14 AM
 * Purpose of this class is to map OFAC listed Contact
 */
class OFACResponseMapper {
  private static final var CLASS_NAME = OFACRequestMapper.Type.DisplayName
  private static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  /**
   * This Method persist OFAC Listed entities and Create Activity in GW
   */
  @Param("contactScoreMap", "Contact-Entity Score Map ,Listed in OFAC SDN")
  @Param("policyPeriod", "Policy Period")
  function mapOFACResponse(contactScoreMap: HashMap<Contact, Integer>, policyPeriod: PolicyPeriod)
  {
    _logger.info(CLASS_NAME+" :Entering Inside method persistOFACResult")
    for (map in contactScoreMap.entrySet())
    {
      var ofacContact = policyPeriod.ofaccontact?.firstWhere(\elt -> elt.Contact == map.Key)
      if (ofacContact == null) {
        var ofacEntity = new OfacContact_Ext(policyPeriod)
        ofacEntity.EntityScore = map.Value
        ofacEntity.Contact = map.Key
        ofacEntity.OfacHit = true
      }
    }
    _logger.info(CLASS_NAME+" :Exting from the method persistOFACResult")
  }
}