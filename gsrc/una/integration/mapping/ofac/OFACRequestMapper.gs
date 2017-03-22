package una.integration.mapping.ofac

uses una.integration.framework.util.PropertiesHolder
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

uses java.util.ArrayList
uses gw.plugin.billing.bc800.PolicyInfoUtil

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 12/7/16
 * Time: 4:01 AM
 * This class provides methods to create OFAC Request
 */
class OFACRequestMapper {
  private static final var CLASS_NAME = OFACRequestMapper.Type.DisplayName
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
  private static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  final static var TC_ThirdPartyDesignee = "thirdPartyDesignee_Ext"
  construct() {
    setProperties()
  }

  /**
   *  This Method creates and returns ClientContext
   */
  @Returns("ClientContext")
  public function buildClientContext(): ClientContext
  {
    _logger.info(CLASS_NAME + ": Entering buildClientContext method")
    clientContext.ClientID = CLIENT_ID
    clientContext.UserID = USER_ID
    clientContext.Password = PASSWORD
    clientContext.GLB = GLB
    clientContext.DPPA = DPPA
       _logger.info(CLASS_NAME + ": Exiting buildClientContext method")
    return clientContext
  }

  /**
   *  This Method sets required configurational inputs and returns SearchConfiguration Instance
   */
  @Returns("SearchConfiguration")
  function buildSearchConfiguration(): SearchConfiguration
  {
    _logger.info(CLASS_NAME + ": Entering buildSearchConfiguration method")
    searchConfiguration.PredefinedSearchName = PREDEFINED_SEARCH_NAME
    searchConfiguration.AssignResultTo = new SearchConfiguration_AssignResultTo()
    searchConfiguration.AssignResultTo.RolesOrUsers = new AssignmentInfo_RolesOrUsers()
    searchConfiguration.AssignResultTo.Type = AssignmentType.Role
    var list = new ArrayList<String>()
    list.add(ROLES_OR_USER)
    searchConfiguration.AssignResultTo.RolesOrUsers.String = list
    searchConfiguration.WriteResultsToDatabase = true
    _logger.info(CLASS_NAME + ": Exiting buildSearchConfiguration method")
       return searchConfiguration
  }

  /**
   *  This Method sets search input and returns SearchInput Instance
   */
  @Returns("SearchInput")
  @Param("ofacDTOList", "List of insured need  to be checked Against OFAC")
  public function buildSearchInput(ofacDTOList: List<OfacDTO>): SearchInput
  {
    _logger.info(CLASS_NAME + ": Entering buildSearchInput method")
    searchInput.Records = new SearchInput_Records()
    for (i in 0..ofacDTOList.size() - 1) {
      searchInput.Records.InputRecord[i] = new ArrayOfInputRecord_InputRecord()
      searchInput.Records.InputRecord[i].Entity = new InputRecord_Entity()
      searchInput.Records.InputRecord[i].Entity.EntityType = InputEntityType.Individual
      searchInput.Records.InputRecord[i].Entity.Name = new InputEntity_Name()
      searchInput.Records.InputRecord[i].Entity.Name.First = ofacDTOList[i].FirstName != null ? ofacDTOList[i].FirstName : ""
      searchInput.Records.InputRecord[i].Entity.Name.Last = ofacDTOList[i].LastName != null ? ofacDTOList[i].LastName : ""
      searchInput.Records.InputRecord[i].Entity.Addresses = new InputEntity_Addresses()
      searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0] = new ArrayOfInputAddress_InputAddress()
      searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].City = ofacDTOList[i].City != null ? ofacDTOList[i].City : ""
      searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].Country = ofacDTOList[i].Country != null ? ofacDTOList[i].Country : ""
      searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].Street1 = ofacDTOList[i].AddressStreet1 != null ? ofacDTOList[i].AddressStreet1 : ""
      searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].Street2 = ofacDTOList[i].AddressStreet2 != null ? ofacDTOList[i].AddressStreet2 : ""
      searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].PostalCode = ofacDTOList[i].PostalCode != null ? ofacDTOList[i].PostalCode : ""
      searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].StateProvinceDistrict = ofacDTOList[i].State
      searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].Type = wsi.remote.una.ofac.ofac.xgservices_svc.enums.AddressType.Mailing
    }

    _logger.info(CLASS_NAME + ": Exiting buildSearchInput method")
    return searchInput
  }

  /**
   * This method loads basic ofac properties
   */
  private function setProperties()
  {
    _logger.info(CLASS_NAME + ": Entering setProperties method")
    CLIENT_ID = PropertiesHolder.getProperty("CLIENT_ID")
    USER_ID = PropertiesHolder.getProperty("USER_ID")
    PASSWORD = PropertiesHolder.getProperty("OFAC_PASSWORD")
    GLB = PropertiesHolder.getProperty("GLB").toInt()
    PREDEFINED_SEARCH_NAME = PropertiesHolder.getProperty("PREDEFINED_SEARCH_NAME")
    ROLES_OR_USER = PropertiesHolder.getProperty("ROLES_OR_USER")
    _logger.info(CLASS_NAME + ": Exiting setProperties method")
  }

  /**
   * This method is to create List of OfacDTO
   */
  @Param("insuredList", "List of insured to be checked against OFAC")
  @Param("policyPeriod", "PolicyPeriod")
  @Returns("List of OfcaDTO instance")
  public function buildOFACInput(insuredList: List<Contact>, policyPeriod: PolicyPeriod): List<OfacDTO>
  {
    _logger.info(CLASS_NAME + ": Entering buildOFACInput method")
    var ofacDTOList = new ArrayList<OfacDTO> ()
    for (insured in insuredList) {
      var ofacDTO = new OfacDTO()
      if (insured typeis Person){
        ofacDTO.FirstName = insured?.FirstName != null ? insured?.FirstName : ""
        ofacDTO.MiddleName = insured?.MiddleName != null ? insured?.MiddleName : ""
        ofacDTO.LastName = insured?.LastName != null ? insured?.LastName : ""
        }
        if (insured typeis Company){
          if (null != insured.Name)
            ofacDTO.LastName = insured?.Name != null ? insured?.Name : ""
        }

      ofacDTO.AddressStreet1 = insured?.PrimaryAddress?.AddressLine1 != null ? insured?.PrimaryAddress?.AddressLine1 : ""
      ofacDTO.AddressStreet2 = insured?.PrimaryAddress?.AddressLine2 != null ? insured?.PrimaryAddress?.AddressLine2 : ""
      ofacDTO.City = insured?.PrimaryAddress?.City != null ? insured?.PrimaryAddress?.City : ""
      ofacDTO.Country = insured?.PrimaryAddress?.Country != null ? insured?.PrimaryAddress?.Country.Code : ""
      ofacDTO.PostalCode = insured?.PrimaryAddress?.PostalCode != null ? insured?.PrimaryAddress?.PostalCode : ""
      ofacDTO.AddressType = insured?.PrimaryAddress?.AddressType != null ? insured?.PrimaryAddress?.AddressType.toString() : ""
      ofacDTO.State = insured?.PrimaryAddress?.State != null ? insured?.PrimaryAddress?.State.Code : ""
      ofacDTOList.add(ofacDTO)
    }
    _logger.info(CLASS_NAME + ": Exiting buildOFACInput method")
    return ofacDTOList
  }

  /**
   * This method is to get Line specific Contacts for Ofac
   */
  @Param("insuredList", "List of insured to be checked against OFAC")
  @Param("policyPeriod", "PolicyPeriod")
  @Returns("List of Contact instance")
  public function getLineSpecificContacts(insuredList: List<Contact>, policyPeriod: PolicyPeriod): List<Contact>
  {
    _logger.info(CLASS_NAME + ": Entering getLineSpecificContacts method")
    var addlInterests = PolicyInfoUtil.retrieveAdditionalInterests(policyPeriod)
    if (!policyPeriod.CPLineExists && !policyPeriod.BP7LineExists && addlInterests!=null){
      insuredList = insuredList.where(\elt -> {
        var isThirdParty = addlInterests.where(\addlInt -> addlInt.AdditionalInterestType == typekey.AdditionalInterestType.get(TC_ThirdPartyDesignee))*.PolicyAddlInterest*.ContactDenorm.contains(elt)
        return not isThirdParty
      })
    }
    _logger.info(CLASS_NAME + ":Exiting getLineSpecificContacts method")
    return insuredList
  }
}
