package una.integration.service.gateway.ofac

uses una.integration.framework.util.PropertiesHolder
uses una.integration.service.transport.ofac.OFACCommunicatorStub
uses una.logging.UnaLoggerCategory
uses una.model.OfacDTO
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.ArrayOfInputAddress_InputAddress
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.ArrayOfInputRecord_InputRecord
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.AssignmentInfo_RolesOrUsers
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.InputEntity_Addresses
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.InputEntity_Name
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.InputRecord_Entity
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.SearchConfiguration_AssignResultTo
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.SearchInput_Records
uses wsi.remote.una.ofac.ofac.xgservices_svc.enums.AssignmentType
uses wsi.remote.una.ofac.ofac.xgservices_svc.enums.DPPAChoiceType
uses wsi.remote.una.ofac.ofac.xgservices_svc.enums.InputEntityType
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.ClientContext
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchConfiguration
uses wsi.remote.una.ofac.ofac.xgservices_svc.types.complex.SearchInput

uses java.lang.Integer
uses java.util.ArrayList
uses java.util.Date
uses java.util.HashMap

/**
 * Created with IntelliJ IDEA.
 * User: JGupta
 * Date: 10/5/16
 * Time: 9:06 AM
 **/
class OFACGatewayStub implements OFACInterface {
  private final static var DISPLAY_ERROR_MESSAGE: String = "Failed to retrieve OFAC, please contact help desk."
  private final static var WS_NOT_AVAILABLE: String = "Failed to connect to the OFAC web service."
  private static var CLIENT_ID: String
  private static var USER_ID: String
  private static var PASSWORD: String
  private static var GLB: int
  private static var DPPA = DPPAChoiceType.Choice6
  private static var PREDEFINED_SEARCH_NAME: String
  private static var ROLES_OR_USER: String
  private static var clientContext = new ClientContext()
  private static  var searchConfiguration = new SearchConfiguration()
  private static var searchInput = new SearchInput()
  var ofacCommunicator: OFACCommunicatorStub
  var timeout = "500"
  static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  construct(thresholdTimeout: String) {
    timeout = thresholdTimeout
    setProperties()
    ofacCommunicator = new OFACCommunicatorStub()
  }

  /**
   *  Function to Validate List of Insured against OFAC and if listed ,persist in OfacContact Entity in GW
   */
  @Param("insuredList", "List of insured need to be checked Against OFAC")
  @Param("policyPeriod", "Policy Period")
  override function validateOFACEntity(insuredList: List<Contact>, policyPeriod: PolicyPeriod) {
    _logger.debug("Entering Inside method validateOFACEntity")
    var contactScoreMap = new HashMap<Contact, Integer>()
    var isFalsePositiveRule = false
    clientContext = buildClientContext()
    searchConfiguration = buildSearchConfiguration()
    var ofacDTOList = buildOFACInput(insuredList, policyPeriod)
    searchInput = buildSearchInput(ofacDTOList)

    var result = ofacCommunicator.returnOFACSearchResults(clientContext, searchConfiguration, searchInput)
    _logger.info("result:" + result)


    // var personList = getPersonContactList()
    // Var CompanyList = getCompanyContactList()

    var personList = new ArrayList<entity.Person>()
    var companyList = new ArrayList<Company>()
    var insuredItr = insuredList.iterator()
    while (insuredItr.hasNext()) {
      var contact = insuredItr.next()
      if (contact typeis Person) {
        personList.add(contact)
      }
      if (contact typeis Company){
        companyList.add(contact)
      }
    }

    //mapOFACResults()


    if (result != null && result.Records != null && result.Records.ResultRecord != null && result.Records.ResultRecord.size() > 0)  {
      for (resultRecord in result.Records.ResultRecord)
      {
        var ofacContact: Contact
        if (resultRecord.RecordDetails != null) {
          if (resultRecord.RecordDetails.Name != null) {
            if (personList.size() > 0) {
              if (resultRecord.RecordDetails.Name.First != null && resultRecord.RecordDetails.Name.Last != null)
              {
                var person = personList.firstWhere(\elt -> elt.FirstName.equalsIgnoreCase(resultRecord.RecordDetails.Name.First) && elt.LastName.equalsIgnoreCase(resultRecord.RecordDetails.Name.Last))
                ofacContact = person
              }
            }
            if (companyList.size() > 0)
            {
              var company = companyList.firstWhere(\elt -> elt.Name.equalsIgnoreCase(resultRecord.RecordDetails.Name.Full))
              ofacContact = company
            }
            if (ofacContact != null)
              contactScoreMap.put(ofacContact, resultRecord.Watchlist.Matches.WLMatch.get(0).EntityScore)
          }
          //Check for Accept List
          if (resultRecord.RecordDetails.RecordState != null && resultRecord.RecordDetails.RecordState.Status != null) {
            if (resultRecord.RecordDetails.RecordState.Status.equalsIgnoreCase("Automatic False Positive"))
            {
              isFalsePositiveRule = true
            }
            else
            {
              isFalsePositiveRule = false
            }
          }
          else {
            isFalsePositiveRule = false
          }
        }
      }
    }
    if (isFalsePositiveRule == false)  {
      persistOFACResult(contactScoreMap, policyPeriod)
    }
    _logger.debug("Exting from the method validateOFACEntity")
  }

  /**
   * This Method persist OFAC Listed entities and Create Activity in GW
   */
  @Param("contactScoreMap", "Contact-Entity Score Map ,Listed in OFAC SDN")
  @Param("policyPeriod", "Policy Period")
  private static function persistOFACResult(contactScoreMap: HashMap<Contact, Integer>, policyPeriod: PolicyPeriod)
  {
    _logger.debug("Entering Inside method persistOFACResult")
    var contactScoreEntry = contactScoreMap.entrySet().iterator()
    while (contactScoreEntry.hasNext()) {
      var contact = contactScoreEntry.next()
      if (contact.Value > PropertiesHolder.getProperty("ENTITY_SCORE").toInt()){
        //           TBD Later after History Typelist Approval
       // policyPeriod.createCustomHistoryEvent(CustomHistoryType.TC_OFAC_CHECK_FAILED, \ -> displaykey.Account.History.OfacCheckFailed)
        gw.transaction.Transaction.runWithNewBundle(\bundle -> {
          //Create Activity             //TBD Later FOR ACTIIVITY Creation
         /* var activityPattern = ActivityPattern.finder.getActivityPatternByCode("OFAC")
          var pol = bundle.add(policyPeriod.Policy)
          activityPattern.createPolicyActivity(bundle, pol, activityPattern.Subject, activityPattern.Description, null, activityPattern.Priority, null, null, null)*/
          //Persist ofac entity in GW
          var ofacEntity = new OfacContact_Ext(policyPeriod)
          ofacEntity.EntityScore = contact.Value
          ofacEntity.Contact = contact.Key
          ofacEntity.OfacHit = true
        })
      }
      /*        //           TBD Later after History Typelist Approval
      else{
      policyPeriod.createCustomHistoryEvent(CustomHistoryType.TC_OFAC_CHECK_PASSED, \ -> displaykey.Account.History.OfacCheckPassed)
    }*/
    }
    _logger.debug("Exting from the method persistOFACResult")
  }

  /**
   *  This Method creates and returns ClientContext
   */
  @Returns("ClientContext")
  private static function buildClientContext(): ClientContext
  {
    _logger.debug("Entering Inside method buildClientContext")
    clientContext.ClientID = CLIENT_ID
    clientContext.UserID = USER_ID
    clientContext.Password = PASSWORD
    clientContext.GLB = GLB
    clientContext.DPPA = DPPA
    _logger.debug("Exting from the method buildClientContext")
    return clientContext
  }

  /**
   *  This Method sets required configurational inputs and returns SearchConfiguration Instance
   */
  @Returns("SearchConfiguration")
  private static function buildSearchConfiguration(): SearchConfiguration
  {
    _logger.debug("Entering Inside method buildSearchConfiguration")
    searchConfiguration.PredefinedSearchName = PREDEFINED_SEARCH_NAME
    searchConfiguration.AssignResultTo = new SearchConfiguration_AssignResultTo()
    searchConfiguration.AssignResultTo.RolesOrUsers = new AssignmentInfo_RolesOrUsers()
    searchConfiguration.AssignResultTo.Type = AssignmentType.Role
    var list = new List<String>()
    list.add(ROLES_OR_USER)
    searchConfiguration.AssignResultTo.RolesOrUsers.String = list
    searchConfiguration.WriteResultsToDatabase = true
    _logger.debug("Exting from the method buildSearchConfiguration")
    return searchConfiguration
  }

  /**
   *  This Method sets search input and returns SearchInput Instance
   */
  @Returns("SearchInput")
  @Param("ofacDTOList", "List of insured need  to be checked Against OFAC")
  private static function buildSearchInput(ofacDTOList: List<OfacDTO>): SearchInput
  {
    _logger.debug("Entering Inside method buildSearchInput")
    searchInput.Records = new SearchInput_Records()
    for (i in 0..ofacDTOList.size() - 1) {
      searchInput.Records.InputRecord[i] = new ArrayOfInputRecord_InputRecord()
      searchInput.Records.InputRecord[i].Entity = new InputRecord_Entity()
      searchInput.Records.InputRecord[i].Entity.EntityType = InputEntityType.Individual
      searchInput.Records.InputRecord[i].Entity.Name = new InputEntity_Name()
      if (ofacDTOList[i].FirstName != null && ofacDTOList[i].LastName != null)
      {
        searchInput.Records.InputRecord[i].Entity.Name.First = ofacDTOList[i].FirstName
        searchInput.Records.InputRecord[i].Entity.Name.Last = ofacDTOList[i].LastName
      }
      else

        searchInput.Records.InputRecord[i].Entity.Name.Last = ofacDTOList[i].LastName
      searchInput.Records.InputRecord[i].Entity.Addresses = new InputEntity_Addresses()
      searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0] = new ArrayOfInputAddress_InputAddress()
      if (ofacDTOList[i].City != null)
        searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].City = ofacDTOList[i].City
      if (ofacDTOList[i].Country != null)
        searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].Country = ofacDTOList[i].Country
      if (ofacDTOList[i].AddressStreet1 != null)
        searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].Street1 = ofacDTOList[i].AddressStreet1
      if (ofacDTOList[i].AddressStreet2 != null)
        searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].Street2 = ofacDTOList[i].AddressStreet2
      if (ofacDTOList[i].PostalCode != null)
        searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].PostalCode = ofacDTOList[i].PostalCode
      searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].Type = wsi.remote.una.ofac.ofac.xgservices_svc.enums.AddressType.Mailing
    }
    _logger.debug("Exting from the method buildSearchInput")
    return searchInput
  }

  /**
   * This is static method to load basic ofac properties
   */
  private static function setProperties()
  {
    _logger.debug("Entering Inside method setProperties")
    CLIENT_ID = PropertiesHolder.getProperty("CLIENT_ID")
    USER_ID = PropertiesHolder.getProperty("USER_ID")
    PASSWORD = PropertiesHolder.getProperty("OFAC_PASSWORD")
    GLB = PropertiesHolder.getProperty("GLB").toInt()
    PREDEFINED_SEARCH_NAME = PropertiesHolder.getProperty("PREDEFINED_SEARCH_NAME")
    ROLES_OR_USER = PropertiesHolder.getProperty("ROLES_OR_USER")
    _logger.debug("Exting from the method setProperties")
  }

  /**
   * This method is to create List of OfacDTO
   */
  @Param("insuredList", "List of insured to be checked against OFAC")
  @Param("policyPeriod", "PolicyPeriod")
  @Returns("List of OfcaDTO instance")
  static function buildOFACInput(insuredList: List<Contact>, policyPeriod: PolicyPeriod): List<OfacDTO>
  {
    _logger.debug("Entering Inside method buildOFACInput")
    var ofacDTOList = new ArrayList<OfacDTO> ()
    for (insured in insuredList)
    {
      var ofacDTO = new OfacDTO()
      if (insured typeis Person){
        if (null != insured.FirstName){
          ofacDTO.FirstName = insured.FirstName
        }
        if (null != insured.MiddleName){
          ofacDTO.MiddleName = insured.MiddleName
        }
        if (null != insured.LastName){
          ofacDTO.LastName = insured.LastName
        }
        if (insured typeis Company){

          if (null != insured.Name)
            ofacDTO.LastName = insured.Name
        }
      }
      if (null != insured.PrimaryAddress)
        var primAddress = insured.PrimaryAddress

      if (null != insured.PrimaryAddress.AddressLine1)
        ofacDTO.AddressStreet1 = insured.PrimaryAddress.AddressLine1
      if (null != insured.PrimaryAddress.AddressLine2)
        ofacDTO.AddressStreet2 = insured.PrimaryAddress.AddressLine2
      if (null != insured.PrimaryAddress.City)
        ofacDTO.City = insured.PrimaryAddress.City
      if (null != insured.PrimaryAddress.Country)
        ofacDTO.Country = insured.PrimaryAddress.Country.Code
      if (null != insured.PrimaryAddress.PostalCode)
        ofacDTO.PostalCode = insured.PrimaryAddress.PostalCode

      ofacDTOList.add(ofacDTO)
    }
    _logger.debug("Exting from the method buildOFACInput")
    return ofacDTOList
  }
}