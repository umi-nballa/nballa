package una.integration.mapping.ofac

uses una.integration.framework.util.PropertiesHolder
uses una.integration.service.transport.ofac.OFACCommunicator
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



/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 12/7/16
 * Time: 4:01 AM
 */
class OFACRequestMapper {

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

  static var _logger = UnaLoggerCategory.UNA_INTEGRATION


  construct() {
    setProperties()
  }


  /**
   *  This Method creates and returns ClientContext
   */
  @Returns("ClientContext")
  function buildClientContext(): ClientContext
  {
    _logger.debug("Entering Inside method buildClientContext")
    clientContext.ClientID = CLIENT_ID
    clientContext.UserID = USER_ID
    clientContext.Password = PASSWORD
    clientContext.GLB = GLB
    clientContext.DPPA = DPPA
    _logger.info(clientContext)
    _logger.debug("Exting from the method buildClientContext")
    return clientContext
  }

  /**
   *  This Method sets required configurational inputs and returns SearchConfiguration Instance
   */
  @Returns("SearchConfiguration")
  function buildSearchConfiguration(): SearchConfiguration
  {
    _logger.debug("Entering Inside method buildSearchConfiguration")
    searchConfiguration.PredefinedSearchName = PREDEFINED_SEARCH_NAME
    searchConfiguration.AssignResultTo = new SearchConfiguration_AssignResultTo()
    searchConfiguration.AssignResultTo.RolesOrUsers = new AssignmentInfo_RolesOrUsers()
    searchConfiguration.AssignResultTo.Type = AssignmentType.Role
    var list = new ArrayList<String>()
    list.add(ROLES_OR_USER)
    searchConfiguration.AssignResultTo.RolesOrUsers.String = list
    searchConfiguration.WriteResultsToDatabase = true
    _logger.debug("Exting from the method buildSearchConfiguration")
    _logger.info(searchConfiguration)
    return searchConfiguration
  }

  /**
   *  This Method sets search input and returns SearchInput Instance
   */
  @Returns("SearchInput")
  @Param("ofacDTOList", "List of insured need  to be checked Against OFAC")
  function buildSearchInput(ofacDTOList: List<OfacDTO>): SearchInput
  {
    _logger.debug("Entering Inside method buildSearchInput")
    searchInput.Records = new SearchInput_Records()
    for(i in 0..ofacDTOList.size() - 1) {
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
      searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].StateProvinceDistrict = ofacDTOList[i].State
      searchInput.Records.InputRecord[i].Entity.Addresses.InputAddress[0].Type = wsi.remote.una.ofac.ofac.xgservices_svc.enums.AddressType.Mailing
    }
    _logger.info(searchInput)
    _logger.debug("Exting from the method buildSearchInput")
    return searchInput
  }

  /**
   * This method loads basic ofac properties
   */
  function setProperties()
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
  function buildOFACInput(insuredList: List<Contact>, policyPeriod: PolicyPeriod): List<OfacDTO>
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
      if(null !=insured.PrimaryAddress.AddressType)
        ofacDTO.AddressType= insured.PrimaryAddress.AddressType.toString()
      if(null!=insured.PrimaryAddress.State)
        ofacDTO.State=insured.PrimaryAddress.State.Code
      ofacDTOList.add(ofacDTO)
    }
    _logger.debug("Exting from the method buildOFACInput")
    return ofacDTOList
  }


}