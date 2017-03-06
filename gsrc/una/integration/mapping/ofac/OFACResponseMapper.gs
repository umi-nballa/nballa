package una.integration.mapping.ofac

uses una.logging.UnaLoggerCategory

uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 12/7/16
 * Time: 4:14 AM
 */
class OFACResponseMapper {
  private static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  private static final var CLASS_NAME = OFACRequestMapper.Type.DisplayName

  /**
   * This Method persist OFAC Listed entities and Create Activity in GW
   */
  @Param("contactScoreMap", "Contact-Entity Score Map ,Listed in OFAC SDN")
  @Param("policyPeriod", "Policy Period")
  function mapOFACResponse(contactList: ArrayList<Contact>, policyPeriod: PolicyPeriod)
  {
    _logger.info(CLASS_NAME + ": Entering Inside method mapOFACResponse")
    contactList?.toSet()?.each( \ record -> {
      var ofacContact = policyPeriod.ofaccontact?.firstWhere(\elt -> elt.Contact == record)
      if (ofacContact == null) {
        var ofacEntity = new OfacContact_Ext(policyPeriod)
        ofacEntity.Contact = record
        ofacEntity.OfacHit = true
      }
    })
    _logger.info(CLASS_NAME + ": Exting from the method mapOFACResponse")
  }
}