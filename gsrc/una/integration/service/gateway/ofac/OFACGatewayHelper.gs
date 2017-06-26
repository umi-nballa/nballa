package una.integration.service.gateway.ofac

uses una.integration.framework.util.PropertiesHolder
uses una.logging.UnaLoggerCategory
uses java.util.ArrayList
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchResults

uses wsi.remote.una.ofac.ofac.xgservices_svc.enums.ResultEntityType
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.ArrayOfResultRecord_ResultRecord
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.ArrayOfWLMatch_WLMatch

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 12/6/16
 * Time: 10:58 PM
 */
class OFACGatewayHelper {

  private static final var CLASS_NAME = OFACGatewayHelper.Type.DisplayName
  private static var _logger = UnaLoggerCategory.UNA_INTEGRATION


  // Function checks for FalsePositive and returns a Hashmap with contacts and respective scores
  public function checkAndMapResponseForAlerts(policyContacts: List<Contact>, pPeriod: PolicyPeriod, result: SearchResults): ArrayList<Contact> {
    _logger.info(CLASS_NAME + ": Entering checkAndMapResponseForAlerts method")
    var isFalsePositive : boolean

    var ofacList = new ArrayList<Contact>()
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
        if (watchList != null && !watchList.FalsePositive && watchList.EntityScore >= PropertiesHolder.getProperty("ENTITY_SCORE") as int )
          isFalsePositive = false

        if (!isFalsePositive){
          // Add contact and score to Map
          var contact = returnHITList(record, policyContacts, watchList,pPeriod)

          if(contact != null)
            ofacList.add(contact)
        }
      }
    }
    _logger.info(CLASS_NAME + ": Exiting checkAndMapResponseForAlerts method")
    return ofacList
  }

  // Function returns List of person contacts

  private function retrievePersonContactList(policyContacts: List<Contact>): ArrayList<Person> {
    _logger.info(CLASS_NAME + ": Entering retrievePersonContactList method")
    var personList = new ArrayList<entity.Person>()
    var contactItr = policyContacts.iterator()
    while (contactItr.hasNext()) {
      var contact = contactItr.next()
      if (contact typeis Person) {
        _logger.debug("Adding " + contact.Name + " to the person Contact List")
        personList.add(contact)
      }
    }
    _logger.info(CLASS_NAME + ": Exiting retrievePersonContactList method")
    return personList
  }

  // function returns List of Company contacts

  private function retrieveCompanyContactList(policyContacts: List<Contact>): ArrayList<Company> {
    _logger.info(CLASS_NAME + ": Entering retrieveCompanyContactList method")
    var companyList = new ArrayList<Company>()
    var contactItr = policyContacts.iterator()
    while (contactItr.hasNext()) {
      var contact = contactItr.next()
      if (contact typeis Company){
        _logger.debug("Adding " + contact.Name + " to the Comapany Contact List")
        companyList.add(contact)
      }
    }
    _logger.info(CLASS_NAME + ": Exiting retrieveCompanyContactList method")
    return companyList
  }


  // Function to check & add contact to LIST
  private function returnHITList(record: ArrayOfResultRecord_ResultRecord,
                                policyContacts: List<Contact>, watchList: ArrayOfWLMatch_WLMatch,
                                   pPeriod: PolicyPeriod): Contact {
    _logger.info(CLASS_NAME + ": Entering returnHITContact method")
    var personList = retrievePersonContactList(policyContacts)
    var companyList = retrieveCompanyContactList(policyContacts)

    if (record.RecordDetails.EntityType == ResultEntityType.Individual) {

      //add person contact to Map
      if (record.RecordDetails.Name.First != null && record.RecordDetails.Name.First !="" && record.RecordDetails.Name.Last != null) {
        var person = personList?.firstWhere(\elt -> elt.FirstName.equalsIgnoreCase(record.RecordDetails.Name.First)
            && elt.LastName.equalsIgnoreCase(record.RecordDetails.Name.Last))
        _logger.debug("Adding " + person.Name + " to the AlertList")

        if(person != null)   {
          pPeriod.createCustomHistoryEvent(CustomHistoryType.TC_IDENTIFIEDOFAC, \ -> displaykey.Web.OFAC.History.Event.Msg(person.DisplayName))
          return person
       }
      }
    else {
      // add company contact to the map
      if (record.RecordDetails.Name.Full != null && companyList.HasElements) {
        var company = companyList?.firstWhere(\elt ->
            elt.Name.equalsIgnoreCase(record.RecordDetails.Name.Full))
        _logger.debug("Adding " + company.Name  + " to the AlertList")

        if(company != null)       {
          pPeriod.createCustomHistoryEvent(CustomHistoryType.TC_IDENTIFIEDOFAC, \ -> displaykey.Web.OFAC.History.Event.Msg(company.DisplayName))
          return company
        }
        }
    }
    }
    _logger.info(CLASS_NAME + ": Exiting returnHITContact method")
    return null
  }

  // Function to check against some known OFAC hits and retunr a Contact for a dummy check
  public function returnHITContact(policyContacts: List<Contact>): Contact {
    _logger.info(CLASS_NAME + ": Entering returnHITContact method")
    var personList = retrievePersonContactList(policyContacts)
   // var companyList = retrieveCompanyContactList(policyContacts)

    //if (record.RecordDetails.EntityType == ResultEntityType.Individual) {
    //add person contact to Map
    //if (record.RecordDetails.Name.First != null && record.RecordDetails.Name.First !="" && record.RecordDetails.Name.Last != null) {
    var person = personList?.firstWhere(\elt -> elt.FirstName.equalsIgnoreCase("Rashid")
        && elt.LastName.equalsIgnoreCase("AL-MAGHRIBI"))
    if (person ==null)
      person = personList?.firstWhere(\elt -> elt.FirstName.equalsIgnoreCase("Dawood")
          && elt.LastName.equalsIgnoreCase("ibrahim"))
    _logger.debug("Adding " + person.Name + " to the AlertList")
    if (person != null)
      return person
    //}
    //}
    _logger.info(CLASS_NAME + ": Exiting returnHITContact method for known OFAC hits")
    return null
  }

  // Function is to get newly added Contact on Policy Period
  public function getNewlyAddedContactOnPolicyPeriod(policyPeriod: PolicyPeriod): List<Contact> {
    _logger.info(CLASS_NAME + ": Entering getNewlyAddedContactOnPolicyPeriod method")
    var newlyAddedContacts=new ArrayList<Contact>()
    var previousPeriod=policyPeriod.BasedOn
    var previousContact=previousPeriod.AllContacts
    newlyAddedContacts=policyPeriod?.AllContacts?.where( \  elt -> {
        var isExistingContact= previousContact?.contains(elt )
        return not isExistingContact
      })
    _logger.info(CLASS_NAME + ": Exiting getNewlyAddedContactOnPolicyPeriod method")
    return newlyAddedContacts
    }

}