package una.integration.mapping.ofac

uses una.integration.framework.util.PropertiesHolder
uses una.logging.UnaLoggerCategory


uses java.lang.Integer
uses java.util.HashMap

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 12/7/16
 * Time: 4:14 AM
 */
class OFACResponseMapper {

  static var _logger = UnaLoggerCategory.UNA_INTEGRATION


  /**
   * This Method persist OFAC Listed entities and Create Activity in GW
   */
  @Param("contactScoreMap", "Contact-Entity Score Map ,Listed in OFAC SDN")
  @Param("policyPeriod","Policy Period")
  function mapOFACResponse(contactScoreMap: HashMap<Contact, Integer>,policyPeriod:PolicyPeriod)
  {
    _logger.info("Entering Inside method persistOFACResult")
//    var contactScoreEntry = contactScoreMap.entrySet().iterator()
//    while (contactScoreEntry.hasNext()) {
//      var contact = contactScoreEntry.next()

      for(map in contactScoreMap.entrySet())
        {
   //   if (contact.Value > PropertiesHolder.getProperty("ENTITY_SCORE").toInt()){
        //policyPeriod.createCustomHistoryEvent(CustomHistoryType.TC_OFAC_CHECK_FAILED, \ -> displaykey.Account.History.OfacCheckFailed)
     //   gw.transaction.Transaction.runWithNewBundle(\bundle -> {
          //Create Activity             //TBD For Activity Creation
          /* var activityPattern = ActivityPattern.finder.getActivityPatternByCode("OFAC")
           var pol = bundle.add(policyPeriod.Policy)
           activityPattern.createPolicyActivity(bundle, pol, activityPattern.Subject, activityPattern.Description,null, activityPattern.Priority, null, null, null)*/
          //Persist ofac entity in GW
          var ofacEntity = new OfacContact_Ext(policyPeriod)
          ofacEntity.EntityScore = map.Value
          ofacEntity.Contact = map.Key
          ofacEntity.OfacHit = true
       // })
      }
      /*   //           TBD Later after History Typelist Approval
      else{
        policyPeriod.createCustomHistoryEvent(CustomHistoryType.TC_OFAC_CHECK_PASSED, \ -> displaykey.Account.History.OfacCheckPassed)
      }*/
  //  }
    _logger.info("Exting from the method persistOFACResult")
  }






}