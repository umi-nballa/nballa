package una.integration.service.gateway.ofac

uses una.integration.framework.util.PropertiesHolder
uses una.logging.UnaLoggerCategory
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.ArrayOfResultRecord_ResultRecord
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.ArrayOfWLMatch_WLMatch
uses wsi.remote.una.ofac.ofac.xgservices_svc.enums.ResultEntityType
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchResults

uses java.lang.Integer
uses java.util.ArrayList
uses java.util.HashMap

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 12/6/16
 * Time: 10:58 PM
 * This class provide utility methods for Ofac Implementation
 */
class OFACGatewayHelper {

  private static final var CLASS_NAME = OFACGatewayHelper.Type.DisplayName
  private static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  // Function returns List of person contacts

  private function retrievePersonContactList(policyContacts: List<Contact>): ArrayList<Person> {
    _logger.info(CLASS_NAME + " : Entering inside method retrievePersonContactList ")
    var personList = new ArrayList<entity.Person>()
    var contactItr = policyContacts.iterator()
    while (contactItr.hasNext()) {
      var contact = contactItr.next()
      if (contact typeis Person) {
        _logger.debug("Adding " + contact.Name + " to the person Contact List")
        personList.add(contact)
      }
    }
    _logger.info(CLASS_NAME + " : Exiting from method retrievePersonContactList ")
    return personList
  }

  // function returns List of Company contacts

  private function retrieveCompanyContactList(policyContacts: List<Contact>): ArrayList<Company> {
    _logger.info(CLASS_NAME + " : Entering inside method retrieveCompanyContactList ")
    var companyList = new ArrayList<Company>()
    var contactItr = policyContacts.iterator()
    while (contactItr.hasNext()) {
      var contact = contactItr.next()
      if (contact typeis Company){
        _logger.debug("Adding " + contact.Name + " to the Comapany Contact List")
        companyList.add(contact)
      }
    }
    _logger.info(CLASS_NAME + " : Exiting from method retrieveCompanyContactList ")
    return companyList
  }

  // Function to check & add contact and Score to a Hashmap

  private function addContactScoreToMap(record: ArrayOfResultRecord_ResultRecord, policyContacts: List<Contact>, watchList: ArrayOfWLMatch_WLMatch, pPeriod: PolicyPeriod): HashMap<Contact, Integer> {
    _logger.info(CLASS_NAME + " : Entering inside method addContactScoreToMap ")
    var contactScoreMap = new HashMap<Contact, Integer>()
    var personList = retrievePersonContactList(policyContacts)
    var companyList = retrieveCompanyContactList(policyContacts)

    if (record.RecordDetails.EntityType == ResultEntityType.Individual) {
      //add person contact to Map
      if (record.RecordDetails.Name.First != null && record.RecordDetails.Name.Last != null) {
        var person = personList?.firstWhere(\elt -> elt.FirstName.equalsIgnoreCase(record.RecordDetails.Name.First)
            && elt.LastName.equalsIgnoreCase(record.RecordDetails.Name.Last))
        _logger.debug("Adding " + person.Name + " to the AlertList")

        if (person != null)   {
          contactScoreMap.put(person, watchList.EntityScore)
          pPeriod.createCustomHistoryEvent(CustomHistoryType.TC_IDENTIFIEDOFAC, \-> displaykey.Web.OFAC.History.Event.Msg(person.DisplayName))
        }
      }
    } else {
      // add company contact to the map
      if (record.RecordDetails.Name.Full != null && companyList.HasElements) {
        var company = companyList?.firstWhere(\elt ->
            elt.Name.equalsIgnoreCase(record.RecordDetails.Name.Full))
        _logger.debug("Adding " + company.Name + " to the AlertList")

        if (company != null)       {
          contactScoreMap.put(company, watchList.EntityScore)
          pPeriod.createCustomHistoryEvent(CustomHistoryType.TC_IDENTIFIEDOFAC, \-> displaykey.Web.OFAC.History.Event.Msg(company.DisplayName))
        }
      }
    }
    _logger.info(CLASS_NAME + " : Exiting from method addContactScoreToMap ")
    return contactScoreMap
  }

  // Function checks for FalsePositive and returns a Hashmap with contacts and respective scores

  function checkAndMapResponseForAlerts(policyContacts: List<Contact>, pPeriod: PolicyPeriod, result: SearchResults): HashMap<Contact, Integer> {
    _logger.info(CLASS_NAME + " : Entering inside method checkAndMapResponseForAlerts ")
    var isFalsePositive: boolean

    //no hit scenario, don't have to map isFalsePositive
    if (result != null && result.Records == null)    {
      isFalsePositive = true
    }
    if (result != null && result.Records != null)  {
      for (record in result.Records.ResultRecord)
      {
        var watchList = record.Watchlist.Matches.WLMatch.first()
        //False positive
        if (watchList != null && watchList.FalsePositive)
          isFalsePositive = true
        //Hit Scenario
        if (watchList != null && !watchList.FalsePositive && watchList.EntityScore >= PropertiesHolder.getProperty("ENTITY_SCORE") as int)
          isFalsePositive = false
        if (!isFalsePositive){
          // Add contact and score to Map
          var contactMap = addContactScoreToMap(record, policyContacts, watchList, pPeriod)
          _logger.info(CLASS_NAME + " : Exiting from method checkAndMapResponseForAlerts ")
          return contactMap
        }
      }
    }
    _logger.info(CLASS_NAME + " : Exiting from method checkAndMapResponseForAlerts ")
    return null
  }
}