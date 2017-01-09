package una.integration.mapping.ofac

uses una.integration.framework.util.PropertiesHolder
uses una.logging.UnaLoggerCategory


uses java.lang.Integer
uses java.util.HashMap
uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 12/7/16
 * Time: 4:14 AM
 */
class OFACResponseMapper {

  static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  static final var CLASS_NAME = OFACRequestMapper.Type.DisplayName


  /**
   * This Method persist OFAC Listed entities and Create Activity in GW
   */
  @Param("contactScoreMap", "Contact-Entity Score Map ,Listed in OFAC SDN")
  @Param("policyPeriod","Policy Period")
  function mapOFACResponse(contactList: ArrayList<Contact>,policyPeriod:PolicyPeriod)
  {
    _logger.info(CLASS_NAME + ": Entering Inside method mapOFACResponse")

      for(record in contactList  )
        {

          var ofacContact = policyPeriod.ofaccontact?.firstWhere( \ elt -> elt.Contact == record)
          if(ofacContact == null) {
          var ofacEntity = new OfacContact_Ext(policyPeriod)
          ofacEntity.Contact = record
          ofacEntity.OfacHit = true
         }
      }
       _logger.info(CLASS_NAME + ": Exting from the method mapOFACResponse")
  }






}