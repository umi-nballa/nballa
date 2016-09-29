package una.integration.service.gateway.ofac

uses una.integration.framework.util.PropertiesHolder
uses una.model.OfacDTO
uses wsi.remote.una.ofac.ofac.xgservices.ports.XGServices_BasicHttpBinding_ISearch
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.ArrayOfInputRecord_InputRecord
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.AssignmentInfo_RolesOrUsers
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
uses gw.pl.logging.LoggerCategory
uses gw.pl.logging.LoggerFactory
uses gw.xml.ws.WebServiceException
uses gw.api.util.DisplayableException
uses java.util.ArrayList
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.SearchConfiguration_Watchlist
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.WatchlistConfiguration_DataFiles
uses wsi.remote.una.ofac.ofac.xgservices_svc.anonymous.elements.ArrayOfWatchlistDataFile_WatchlistDataFile
uses java.util.Date
uses java.lang.Integer

/**
 * Created with IntelliJ IDEA.
 * User: JGupta
 * Date: 9/22/16
 * Time: 9:46 AM
 * To change this template use File | Settings | File Templates.
 */
class OFACGateway implements OFACInterface {
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
  var timeout = "500"
  static var _logger = LoggerFactory.getLogger(LoggerCategory.PLUGIN, "OFACGateway")
  construct(thresholdTimeout: String) {
    timeout = thresholdTimeout
    setProperties()
  }

  /**
   *  Function to Validate List of Insured against OFAC and if listed ,persist in OfacContact Entity in GW
   */
  @Param("insuredList", "List of insured need to be checked Against OFAC")
  @Param("policyPeriod","Policy Period")
  @Throws(DisplayableException, "If the web service is not available")
  override function validateOFACEntity(insuredList: List<Contact>, policyPeriod: PolicyPeriod) {
    try
    {
      var xsService = new XGServices_BasicHttpBinding_ISearch()
      var entityScoreList=new List<Integer>()
      clientContext = buildClientContext()
      searchConfiguration = buildSearchConfiguration()
      var ofacDTOList = buildOFACInput(insuredList, policyPeriod)
      searchInput = buildSearchInput(ofacDTOList)
      var result = xsService.Search(clientContext, searchConfiguration, searchInput)
      result.print()
       //print(result.Records.ResultRecord.get(0).Watchlist.Matches.WLMatch.get(0).EntityScore)
      if(result!=null)
        if(result.Records!=null)
          if(result.Records.ResultRecord!=null)
      if (result.Records.ResultRecord.size() > 0)  {
        for(resultRecord in result.Records.ResultRecord)
        {
          entityScoreList.add(resultRecord.Watchlist.Matches.WLMatch.get(0).EntityScore)
        }
        persistOFACResult(insuredList,entityScoreList)
      }

     // throw new DisplayableException("OFAC HIT Underwriter Issue Created")
      //  print(result.Records.ResultRecord.get(1).Watchlist.Matches.WLMatch.get(6).EntityScore)
    } catch (wse: WebServiceException) {
      throw new DisplayableException(WS_NOT_AVAILABLE, wse)
    }
  }

  @Param("insuredList","Insured Listed in OFAC SDN")
  private function persistOFACResult(insuredList: List<Contact>,entityScoreList:List<Integer>)
  {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      for (insured in insuredList)
      {
        var ofacEntity = new OfacContact()
        ofacEntity.OfacTriggeringDate=new Date()
        ofacEntity.EntityScore= entityScoreList.get(0)
        ofacEntity.Contact = insured
        ofacEntity.OfacHit = true
      }
    })
  }

  private function buildClientContext(): ClientContext
  {
    clientContext.ClientID = CLIENT_ID;
    clientContext.UserID = USER_ID;
    clientContext.Password = PASSWORD;
    //clientContext.ClientReference = "GUID here Please";
    clientContext.GLB = GLB
    clientContext.DPPA = DPPA
    clientContext.print()
    return clientContext
  }

  private function buildSearchConfiguration(): SearchConfiguration
  {
    searchConfiguration.PredefinedSearchName = PREDEFINED_SEARCH_NAME;
    //print(searchConfiguration)
    searchConfiguration.AssignResultTo = new SearchConfiguration_AssignResultTo();
   // print(searchConfiguration)
    searchConfiguration.AssignResultTo.RolesOrUsers = new AssignmentInfo_RolesOrUsers();
    searchConfiguration.AssignResultTo.Type = AssignmentType.Role;
    var list = new List<String>()
    list.add(ROLES_OR_USER)
    searchConfiguration.AssignResultTo.RolesOrUsers.String = list
    searchConfiguration.WriteResultsToDatabase = true;
    searchConfiguration.Watchlist = new SearchConfiguration_Watchlist();
    searchConfiguration.Watchlist.DataFiles = new WatchlistConfiguration_DataFiles()
    searchConfiguration.Watchlist.DataFiles.WatchlistDataFile[0] = new ArrayOfWatchlistDataFile_WatchlistDataFile()
    searchConfiguration.Watchlist.DataFiles.WatchlistDataFile[0].IgnoreWeakAKAs=true
    searchConfiguration.Watchlist.DataFiles.WatchlistDataFile[0].MinScore = 80
    searchConfiguration.Watchlist.DataFiles.WatchlistDataFile[0].Name = "OFAC SDN"
    //print("Search Conf**************************************")
       searchConfiguration.print()
    return searchConfiguration
  }

  @Param("ofacDTOList", "List of insured need  to be checked Against OFAC")
  private function buildSearchInput(ofacDTOList: List<OfacDTO>): SearchInput
  {
    searchInput.Records = new SearchInput_Records();
    //print(searchInput)
    for (i in 0..ofacDTOList.size() - 1) {
      searchInput.Records.InputRecord[i] = new ArrayOfInputRecord_InputRecord();
      searchInput.Records.InputRecord[i].Entity = new InputRecord_Entity();
      searchInput.Records.InputRecord[i].Entity.EntityType = InputEntityType.Individual;
      searchInput.Records.InputRecord[i].Entity.Name = new InputEntity_Name();
      if(ofacDTOList[i].FirstName!=null &&ofacDTOList[i].LastName!=null)
      {searchInput.Records.InputRecord[i].Entity.Name.First = ofacDTOList[i].FirstName;
        searchInput.Records.InputRecord[i].Entity.Name.Last = ofacDTOList[i].LastName;}
      else

      searchInput.Records.InputRecord[i].Entity.Name.Last = ofacDTOList[i].InsuredName;

    }
    //print("Search Input**************************************")
    searchInput.print()
    return searchInput
  }

  private function setProperties()
  {
    CLIENT_ID = PropertiesHolder.getProperty("CLIENT_ID")
    USER_ID = PropertiesHolder.getProperty("USER_ID")
    PASSWORD = PropertiesHolder.getProperty("PASSWORD")
    GLB = PropertiesHolder.getProperty("GLB").toInt()
    //  DPPA = PropertiesHolder.getProperty("DPPA")
    PREDEFINED_SEARCH_NAME = PropertiesHolder.getProperty("PREDEFINED_SEARCH_NAME")
    ROLES_OR_USER = PropertiesHolder.getProperty("ROLES_OR_USER")
  }

  @Param("insuredList","List of insured to be checked against OFAC")
  @Param("policyPeriod","PolicyPeriod")
  function buildOFACInput(insuredList: List<Contact>, policyPeriod: PolicyPeriod): List<OfacDTO>
  {
    var ofacDTOList = new ArrayList<OfacDTO> ()
    for (insured in insuredList)
    {
      var ofacDTO = new OfacDTO();
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

        ofacDTO.InsuredName = ((ofacDTO.FirstName != null) ? ofacDTO.FirstName : "") + " " +
            ((ofacDTO.MiddleName != null) ? ofacDTO.MiddleName : "") + " " +
            ((ofacDTO.LastName != null) ? ofacDTO.LastName : "")
      }

      if (insured typeis Company){

        if (null != insured.Name){
          ofacDTO.InsuredName = insured.Name
        }
      }

      if (null != insured.PrimaryAddress) {
        var primAddress = insured.PrimaryAddress
        var addr: String
        if (null != primAddress.AddressLine1){
          addr = primAddress.AddressLine1
        }

        if (null != primAddress.AddressLine2){
          if (null != addr) {
            addr = addr + ", " + primAddress.AddressLine2
          } else {
            addr = primAddress.AddressLine2
          }
        }

        if (null != primAddress.AddressLine3){
          if (null != addr) {
            addr = addr + ", " + primAddress.AddressLine3
          } else {
            addr = primAddress.AddressLine3
          }
        }

        ofacDTO.InsuredAddress = addr

        if (null != primAddress.City)
        {
          ofacDTO.City = primAddress.City
        }
        if (null != primAddress.State)
        {
          ofacDTO.State = primAddress.State.DisplayName
        }
        if (null != primAddress.Country)
        {
          ofacDTO.Country = primAddress.Country.Code
        }
        if (null != primAddress.PostalCode)
        {
          ofacDTO.PostalCode = primAddress.PostalCode
        }
      }

      if (null != policyPeriod){
        if (null != policyPeriod.PolicyNumber){
          ofacDTO.PolicyNumber = policyPeriod.PolicyNumber
        }
      }
      ofacDTOList.add(ofacDTO)
    }
    return ofacDTOList
  }
}