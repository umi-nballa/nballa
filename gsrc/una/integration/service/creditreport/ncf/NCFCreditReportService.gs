package una.integration.service.creditreport.ncf

uses una.integration.mapping.creditreport.CreditReportResponse
uses una.integration.plugins.creditreport.CreditReportDataManagerFactory
uses una.integration.plugins.creditreport.ICreditReportDataManager
uses una.integration.service.creditreport.ICreditReportService
uses una.integration.mapping.creditreport.CreditReportRequest
uses una.integration.framework.util.AddressParser
uses wsi.schema.una.inscore.cprulesresultschema.NationalCreditFile
uses wsi.schema.una.inscore.cprulesresultschema.Result
uses wsi.schema.una.inscore.lexisnexis.ncfv2rev1result.anonymous.elements.AlertsScoring_Scoring_Score
uses wsi.schema.una.inscore.lexisnexis.ncfv2rev1result.enums.ScoreStatus
uses wsi.schema.una.inscore.lexisnexis.ncfv2rev1result.NcfReport
uses wsi.schema.una.inscore.cprulesorderschema.Order
uses wsi.schema.una.inscore.cprulesorderschema.enums.SubjectAddressType_Type
uses wsi.schema.una.inscore.lexisnexis.ncfv2rev1result.enums.SearchDataset_Subjects_Subject_Type
uses wsi.remote.una.ncfwsc.guidewire.InteractiveOrderHandler
uses wsi.schema.una.inscore.lexisnexis.ncfv2rev1result.enums.VendorDataset_Addresses_Address_DataSourceIndicator
uses una.logging.UnaLoggerCategory
uses java.lang.Exception
uses java.text.SimpleDateFormat
uses java.io.FileNotFoundException
uses gw.api.util.DisplayableException
uses gw.xml.ws.WebServiceException
/**
 * Returns hardwired response 
 */
class NCFCreditReportService implements ICreditReportService {

  final static var LOGGER = UnaLoggerCategory.UNA_INTEGRATION

  private var _creditReportDataMgr : ICreditReportDataManager
  private final static var WS_NOT_AVAILABLE: String = "Failed to connect to the LexisNexis web service."
  private final static var PAGE_NOT_FOUND : String = "404 Not Found"
  private final static var DECEASED_EXCLUSION_CODE = "010"

  construct() {
    
    _creditReportDataMgr = CreditReportDataManagerFactory.getCreditReportDataManager(typekey.CreditReportDMExt.TC_PERSISTENT)
  }

   /**
    * In production would delegate the request to the external system to get the report
    */
   @Param("creditReportRequest", "Instance of report request")
   @Returns("Resulting credit response capturing return information from service provider")
   override function getCreditReport(creditReportRequest : CreditReportRequest) : CreditReportResponse {
         
    // Check for a cached credit score
    var creditReportResponse = _creditReportDataMgr.getRecordFromLocalDataStore(creditReportRequest)
    // Nothing stored, eligible or available from datastore
    if(creditReportResponse == null) {
      try {
        // Create request in XML format
        var xmlRequest = getOrderXml(creditReportRequest)
        if (xmlRequest != null) {
          // Submit request to service
          var orderAPI = new InteractiveOrderHandler()
          LOGGER.debug("InScore Request \n"+xmlRequest.asUTFString())
          var xmlResponse = orderAPI.handleInteractiveOrder(xmlRequest.asUTFString())
          LOGGER.debug("InScore Response \n"+xmlResponse.toString())
          if (xmlResponse != null) {
            // Get the NCF report record
            var result = Result.parse(xmlResponse)
            var ncfReport = NcfReport.parse(getNCF(result).Report)
            var score = getOrderResponseScore(ncfReport)
            //var alertScoring = ncfReport.Report.AlertsScoring.Scoring
            var subject = ncfReport.Report.SearchDataset.Subjects.firstWhere(\ s -> s.Subject.Type == SearchDataset_Subjects_Subject_Type.Primary)
            var address = ncfReport.Report.SearchDataset.Addresses.Address.firstWhere(\ s -> s.Ref == "1")
            /**
             * Reported current address from vendor dataset may need to be persisted 
             * for clarification purposes by Reps with the customer. For this purpose,
             * we're just using the id=1 address entry to see if it matches the
             * address indicated in the order request
             */
            var vendorDatasetAddress = ncfReport.Report.VendorDataset.Addresses.Address.firstWhere(\ v -> v.Id == "1")
            var isOrderCurrentAddressDiffThanVendors : boolean = (
              address.Street1 == vendorDatasetAddress.Street1 &&
              address.House == vendorDatasetAddress.House &&
              address.City == vendorDatasetAddress.City &&
              address.State == vendorDatasetAddress.State
            )
            var countReasonCode = score.ReasonCodes.Count
            var statusDescription : String
            var statusCode : CreditStatusExt
        
            if (score == null) {
                statusCode = CreditStatusExt.TC_NO_HIT
                statusDescription = "No credit found."
            }
            else {
              if(score.ExclusionCode == DECEASED_EXCLUSION_CODE ) {
                statusCode = CreditStatusExt.TC_NO_SCORE
                statusDescription = score.ExclusionMsg
              }else{
                statusCode = CreditStatusExt.TC_CREDIT_RECEIVED
                statusDescription = "Credit report found. "
                if(countReasonCode > 0) {
                  statusDescription += countReasonCode + " reason code(s) found."
                  statusCode =  CreditStatusExt.TC_CREDIT_RECEIVED_WITH_REASON_ENTRY
                }
              }
            }              
            creditReportResponse = new CreditReportResponse
                .Builder()
                .withFirstName(subject.Subject.Name.First)
                .withMiddleName(subject.Subject.Name.Middle)
                .withLastName(subject.Subject.Name.Last)
                .withAddress1(address.House + " " + address.Street1)
                .withAddresscity(address.City)
                .withAddressState(address.State)
                .withAddressZip(address.Postalcode)
                .withStatusCode(statusCode)
                .withStatusDescription(statusDescription)
                .withScore(score.Score as java.lang.String)
                .withCreditBureau(ncfReport.Admin.Vendor.Name as java.lang.String)
                .withScoreDate(ncfReport.Admin.DateRequestCompleted as java.util.Date)
                .withFolderId("100")
                .withDateOfBirth(subject.Subject.BirthDate as java.util.Date)
                .withSocialSecurityNumber(subject.Subject.Ssn)
                .withGender(subject.Subject.Gender as java.lang.String)
                .withScoreDate(ncfReport.Admin.DateRequestCompleted as java.util.Date)
                .withReferenceNumber(ncfReport.Admin.ProductReference)
                .withAddressDiscrepancyInd( isOrderCurrentAddressDiffThanVendors )
                .withPncAccount(ncfReport.Admin.PncAccount)
                .withProductReference(ncfReport.Admin.ProductReference)
                .withQuoteback(ncfReport.Admin.Quoteback)
                .withDateRequestOrdered(ncfReport.Admin.DateRequestOrdered)
                .withDateRequestCompleted(ncfReport.Admin.DateRequestCompleted)
                .withStatus(ncfReport.Admin.Status.toString())
                .withReportCode(ncfReport.Admin.ReportCode)
                .withSpecialBillingID(ncfReport.Admin.SpecialBillingId)
                .withReasons(score != null ? score.ReasonCodes.mapToKeyAndValue(\ a -> a.Code , \ a -> a.Description):null)
                .create()
          }
        }
      } catch(wse : Exception) {
          LOGGER.error("Exception occurred: " + wse.Cause)
          if(wse typeis FileNotFoundException || wse typeis WebServiceException || wse.Message.containsIgnoreCase(PAGE_NOT_FOUND)){
            throw new DisplayableException(WS_NOT_AVAILABLE, wse)
          }
          creditReportResponse = new CreditReportResponse
            .Builder()
            .withFirstName(creditReportRequest.FirstName)
            .withMiddleName(creditReportRequest.MiddleName)
            .withLastName(creditReportRequest.LastName)
            .withAddress1(creditReportRequest.AddressLine1)
            .withAddresscity(creditReportRequest.AddressCity)
            .withAddressState(creditReportRequest.AddressState as java.lang.String)
            .withAddressZip(creditReportRequest.AddressZip)
            .withStatusCode(CreditStatusExt.TC_ERROR)
            .withStatusDescription("Error obtaining credit report.")
            .create()
        }
    }
            
    // Add new record to cache
    if(creditReportResponse.StatusCode == CreditStatusExt.TC_CREDIT_RECEIVED) {
      _creditReportDataMgr.addReportToLocalDataStore(creditReportRequest, creditReportResponse)
    }        
    
    return creditReportResponse
  }
  
  /**
   *  Transforms request object to XML format
   */
  @Returns("Convert request object into XML format")
  private static function getOrderXml(creditReportRequest : CreditReportRequest) : Order {
    var order = new Order()

    // Client node
    order.Client.Id = ScriptParameters.LexisNexisClientId
    order.Client.Quoteback_elem[0].Name = ScriptParameters.QuoteBackName
    order.Client.Quoteback_elem[0].$Value = creditReportRequest.PublicID

    // Accounting node
    order.Accounting.Pnc.Account = ScriptParameters.LexisNexisAccountNumber

    // Rule_Plan node
    order.RulePlan.Id = ScriptParameters.RulePlanId
    order.RulePlan.Parameter_elem[0].Name = "lineOfBusiness"
    order.RulePlan.Parameter_elem[0].$Value = "Property"

    // Products
    // a) Build subject first
    order.Dataset.Subjects.Subject[0].Id = "S0"

    var subject = order.Dataset.Subjects.Subject[0]
    subject.Quoteback = creditReportRequest.toString()
    subject.Name[0].First = creditReportRequest.FirstName
    subject.Name[0].Last = creditReportRequest.LastName
    subject.Name[0].Middle = creditReportRequest.MiddleName
    subject.Ssn = creditReportRequest.SocialSecurityNumber

    if(creditReportRequest.DateOfBirth != null){
      var dateFormat = new SimpleDateFormat("MM/dd/yyy")
      var dobString = dateFormat.format(creditReportRequest.DateOfBirth)

      //assign date of birth as String with above format to Birthdate
      subject.Birthdate = dobString
     }

    subject.Address[0].Type = SubjectAddressType_Type.Residence

    // current address
    order.Dataset.Addresses.Address[0].Id = "A0"
    var address = order.Dataset.Addresses.Address[0]
    
    var parser = AddressParser.getInstance()
    address.House = parser.parseStreetNumber(creditReportRequest.AddressLine1)
    address.Street1 = parser.parseStreetName(creditReportRequest.AddressLine1, creditReportRequest.AddressLine2)
    address.City =  creditReportRequest.AddressCity
    address.State = creditReportRequest.AddressState as java.lang.String
    address.Postalcode = creditReportRequest.AddressZip
    
    subject.Address[0].Ref = address
    
    // former address
    if (creditReportRequest.PriorAddressLine1 != null) {
      order.Dataset.Addresses.Address[1].Id = "A1"
      subject.Address[1].Type = SubjectAddressType_Type.Former
      address = order.Dataset.Addresses.Address[1]
    
      address.House = parser.parseStreetNumber(creditReportRequest.PriorAddressLine1)
      address.Street1 = parser.parseStreetName(creditReportRequest.PriorAddressLine1, creditReportRequest.PriorAddressLine2)
      address.City = creditReportRequest.PriorAddressCity
      address.State = creditReportRequest.PriorAddressState
      address.Postalcode = creditReportRequest.PriorAddressZip

      subject.Address[1].Ref = address
   }
  
    order.Products.NationalCreditFile[0].PrimarySubject = subject
    order.Products.NationalCreditFile[0].ReportCode ="1337"
    //order.Products.NationalCreditFile[0].Vendor = Equifax
    order.Products.NationalCreditFile[0].Format = CP_XML
    //order.Products.NationalCreditFile[0]. = "C1"

    return order
  }


  /**
   *  Only get 1 score in the event of an automatic switch.  
   *  The system will switch from 1 vendor to the other if 
   *  the first is down or a no hit.  You will get an additional 
   *  text message if you get the score from your alternate vendor. 
   */
  @Param("ncfReport", "Instance of NcfReport, taken from the response of the web service")
  @Returns("Instance containing the vendor score report") 
  private static function getOrderResponseScore(ncfReport : NcfReport) : AlertsScoring_Scoring_Score {
  
    var result : AlertsScoring_Scoring_Score = null
  
    if (ncfReport != null) {
      foreach (item in ncfReport.Report.AlertsScoring.Scoring.Score) {
        if (item.Status == ScoreStatus.Scored) {
          result = item
          break
        }else if(item.Status == ScoreStatus.No_Score and item.ExclusionCode == DECEASED_EXCLUSION_CODE and item.ExclusionMsg.containsIgnoreCase("DECEASED")) {
          result = item
          break
        }
      }
    }
  
    return result
  }

  /**
   *  Only one (1) NCF expected 
   */
  @Param("result", "Result object instance containing service provider response information, taken from the response of the web service")
  @Returns("National credit file instance out from the passed Result instance")
  private static function getNCF(result : Result) : NationalCreditFile {
  
    var ncf : NationalCreditFile = null
    
    if(result != null) {
      var ncfList = result.ProductResults.NationalCreditFile
  
      if (!ncfList.Empty) {
        ncf = ncfList[0]
      }
    }

     return ncf
  }
}