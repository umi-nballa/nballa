package una.integration.service.gateway.clue

uses gw.api.util.DisplayableException
uses gw.xml.ws.WebServiceException
uses una.integration.service.transport.clue.CluePropertyCommunicatorStub
uses una.logging.UnaLoggerCategory
uses wsi.schema.una.inscore.cprulesorderschema.Order
uses wsi.schema.una.inscore.cprulesorderschema.enums.DescriptionType_Sex
uses wsi.schema.una.inscore.cprulesorderschema.enums.NameType_Type
uses wsi.schema.una.inscore.cprulesresultschema.anonymous.elements.MessageListType_Message

uses java.text.SimpleDateFormat

/**
 * Created with IntelliJ IDEA.
 * User: JGupta
 * Date: 10/17/16
 * Time: 7:17 AM
 * To change this template use File | Settings | File Templates.
 */
class CluePropertyGatewayStub implements CluePropertyInterface {
  private static var KEY_STORE_PATH: String
  private static var LEX_CLIENT_ID: String
  private static var LEX_ACCOUNT_NUMBER: String
  private final static var DISPLAY_ERROR_MESSAGE: String = "Failed to retrieve CLUE, please contact help desk."
  private final static var WS_NOT_AVAILABLE: String = "Failed to connect to the LexisNexis web service."
  private static var LEX_KEYSTORE_PATH: String
  private static var LEX_KEYSTORE_PASSWORD: String
  private static var LEX_INTERNET_CONNECTIVITY: Boolean
  private static var LEX_HTTP_USERNAME: String
  private static var LEX_HTTP_PASSWORD: String
  private static var DATE_FORMAT = "MM/dd/yyyy"
  private static var cluePropertyCommunicator: CluePropertyCommunicatorStub
  var timeout = "500"
  static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  construct(thresholdTimeout: String) {
    timeout = thresholdTimeout
    cluePropertyCommunicator = new CluePropertyCommunicatorStub()
    setProperties()
  }

  /**
   * Creates an order xml from the homeowner details in the provided policy period, then contacts the
   * LexisNexis web service to receive a result report. The result xml is then parsed and ententies are created from its contents.
   */
  @Param("pPeriod", "The Policy Period with homeowner details to create the order from." +
      " The resulting prior losses will be linked back to this period also.")
  @Throws(DisplayableException, "If the web service is not available")
  function orderClueProperty(pPeriod: PolicyPeriod) {
    //attempt to create the order xml
    var orderXml = createOrderXml(pPeriod, LEX_CLIENT_ID, LEX_ACCOUNT_NUMBER)
    var result: String
    _logger.info("CLUE Request or sending order :" + orderXml)
    try {
      result = cluePropertyCommunicator.invokeCluePropertyService(orderXml)
      pPeriod.createCustomHistoryEvent(CustomHistoryType.TC_CLUE_ORDERED_EXT, \ -> displaykey.Web.SubmissionWizard.Clue.EventMsg)
      _logger.info("CLUE Response or received result :" + result)
      _logger.debug("Mapping XML to Objects")
      mapXmlToObject(pPeriod, result)
      _logger.debug("finished ordering CLUE")
    }
        catch (wse: WebServiceException) {
          throw new DisplayableException(WS_NOT_AVAILABLE, wse)
        }
  }

  /**
   * Parses the provided XML and maps CLUE elements to the provided policy period
   */
  @Param("pPeriod", " The resulting prior losses are mapped to this period.")
  @Param("responseXml", " The XML to parse.")
  private function mapXmlToObject(pPeriod: PolicyPeriod, responseXml: String) {
    var clueResponseXml = wsi.schema.una.inscore.cprulesresultschema.Result.parse(responseXml)
    var messages = clueResponseXml.Messages.Message_elem
    var clueProductReports = clueResponseXml.ProductResults.CluePersonalProperty
   // code for Clue Check for Ofac ,Uncomment once data Governance is approved
   pPeriod.HomeownersLine_HOE.ClueHit_Ext=true

    if (clueProductReports.HasElements){
      for (clueProductReport in clueProductReports) {
        _logger.debug("Clue Product Report found")
        // subjectIDMap contains sujbect as key and subjectId as value and it is set up
        // in the createOrderXML method.
        var reportElem = clueProductReport.Report_elem
        var clueReportXml = (reportElem.$SimpleValue as java.lang.String).substring("simple value: ".length)
        // need a second parse because of [CDATA]
        var clueReport = wsi.schema.una.inscore.xsd.property.cluepropertyv2result.CluePersonalProperty.parse(clueReportXml)
        //we should only have one report come back or not found.
        if (clueReport != null){
          //Collect summary details
          var totalRiskClaims = clueReport.Report.Summary.TotalRiskClaims
          var totalSubjectClaims = clueReport.Report.Summary.TotalSubjectClaims
          var totalPriorHist = clueReport.Report.Summary.TotalPriorInquiryHistory
          var totalClaims = totalPriorHist + totalRiskClaims + totalSubjectClaims
          var statusMsg = clueReport.Admin.Status.toString()
          var reference=clueReport.Admin.ProductReference

          _logger.debug(" Risk Claims: ${totalRiskClaims}"
              + ", Subject Claims: ${totalSubjectClaims}, Prior History: ${totalPriorHist}")
          //Save report status for UI feedback
          pPeriod.HomeownersLine_HOE.ClueStatus_Ext = "CLUE Request Status: ${statusMsg}. Number of Claims: ${totalClaims}"
              + ". Date: " + clueReport.Admin.DateRequestCompleted + "."

          if (totalClaims > 0){
            var cHistories = clueReport.Report.ResultsDataset.ClaimsHistory
            for (cHistory in cHistories) {
              var claims = cHistory.Claim
              var cHistoryType = cHistory.Type
              for (claim in claims) {
                //for every claim reported, create a PAPriorLossExt entity and attach it to the PA line
                addOrUpdatePriorLoss(pPeriod, extractClaimDetails(claim, cHistoryType,reference))
                _logger.debug("A claim has been added to the priorLoss array " + claim.Number)
              }
            }
          }
        }
      }
    }

    handleResponseMessages(messages)
  }

  /**
   *  Checks to see if a priorloss already exists on the PALine with the same claim number,
   *  if it does, it removes it and replaces it with the provided loss. New claims are simply added.
   */
  @Param("pPeriod", " The resulting prior losses are mapped to this period.")
  @Param("pLoss", " The PAPriorLossExt period to add or update.")
  private function addOrUpdatePriorLoss(pPeriod: PolicyPeriod, pLoss: HOPriorLoss_Ext) {
    var existingLoss = pPeriod.HomeownersLine_HOE.HOPriorLosses_Ext.firstWhere(\p -> p.ClaimNum == pLoss.ClaimNum)
    if (existingLoss != null){
      pPeriod.HomeownersLine_HOE.removeFromHOPriorLosses_Ext(existingLoss)
    }
    pPeriod.HomeownersLine_HOE.addToHOPriorLosses_Ext(pLoss)
  }

  /**
   *  Takes in a claim element and a claim history type element and outputs a HOPriorLossExt from extracted properties.
   */
  @Param("claim", " The prior loss or claim element")
  @Param("cHistoryType", " The claim--History_Type element ")
  private  function extractClaimDetails(claim: wsi.schema.una.inscore.xsd.property.cluepropertyv2result.anonymous.elements.ResultsDataset_ClaimsHistory_Claim,
                                        cHistoryType: wsi.schema.una.inscore.xsd.property.cluepropertyv2result.enums.ResultsDataset_ClaimsHistory_Type,referenceNumber:String): HOPriorLoss_Ext {
    var priorLoss = new HOPriorLoss_Ext()
    //get claim details
    priorLoss.Reference=referenceNumber
    priorLoss.ClaimDate = claim.ClaimDate
    priorLoss.ClaimAge = claim.ClaimAge.Years as java.lang.String
    priorLoss.ClaimNum = claim.Number
    priorLoss.ClaimType = cHistoryType.toString()

    _logger.debug("A Claim has been found " + claim.Number)

    //get claim payment details
    if (claim.ClaimPayment != null && claim.ClaimPayment.HasElements){
      var payments = claim.ClaimPayment
      _logger.debug("Payment Count = " + payments.Count)
      var pArray = new ClaimPayment_Ext[payments.Count]
      for (p in payments index i) {
        _logger.debug("setting cp data, i = " + i)
        _logger.debug("ptype = " + p.Type as String)
        _logger.debug("dis = " + p.Disposition as String)
        _logger.debug("amount = " + p.AmountPaid)
        var cPayment = new ClaimPayment_Ext()
        cPayment.ClaimType = p.CauseOfLoss.toString()
        cPayment.ClaimDisposition = p.Disposition as String
        cPayment.ClaimAmount = p.AmountPaid
        pArray[i] = cPayment
      }
      priorLoss.ClaimPayment = pArray
    }

    _logger.debug("Getting claim scope and dispute date Details ")
    priorLoss.ClaimScope = claim.ScopeOfClaim.toString()
    priorLoss.DisputeDate = claim.DisputeClearanceDate
    //get policy details
    priorLoss.PolicyNum = claim.Policy.Number
    priorLoss.PolicyCompany = claim.PropertyPolicy.Issuer

    priorLoss.PropertyPolicyNum = claim.PropertyPolicy.Number
    priorLoss.PropertyType = claim.PropertyPolicy.PropertyType as String
    priorLoss.ClaimStatus = claim.Disposition_elem.$Value as String
    priorLoss.AmBest = claim.ContributorAmbest
    priorLoss.LocationOfLoss = claim.LocationOfLoss_elem.$Value as String
    priorLoss.CatastropheInica = claim.CatastropheIndicator.toString()
    priorLoss.mortgageComp = claim.Mortgage.Company
    priorLoss.mortgageNum = claim.Mortgage.Number

    _logger.debug("Getting PolicyHolder Details ")
    // get policy holder details
    var pHolderType = wsi.schema.una.inscore.xsd.property.cluepropertyv2result.enums.SubjectTypeEnum.Insured
    var policyHolder = claim.Subject.firstWhere(\c -> c.Classification == pHolderType)
    if (policyHolder != null){
      priorLoss.PolicyHolderName = policyHolder.Name.Last + ", " + policyHolder.Name.First + " " + (policyHolder.Name.Middle!=null? policyHolder.Name.Middle:"")
      var phAddress = policyHolder.Address.first()
      priorLoss.AddressType = phAddress.Type as String
      priorLoss.Address = (phAddress.House != null ? phAddress.House : "") + " " + (phAddress.Street1 != null ? phAddress.Street1 : "")
      priorLoss.City = phAddress.City
      priorLoss.State = phAddress.State
      priorLoss.Zip = phAddress.Postalcode
      priorLoss.SearchMatchIndicator = phAddress.SearchMatchIndicator as String
      priorLoss.PhoneNumber = policyHolder.Telephone
    }

    //This loss was retrieved from LexisNexis
    priorLoss.ManuallyAddedLoss = false
    priorLoss.OriginLoss="CLUE"

    return priorLoss
  }

  /**
   *  Handles all types of messages that are contained in the provided list of messages
   */
  @Param("messages", " The list of messages to handle")
  @Throws(DisplayableException, "If there is an error or warning message in the messages list")
  private function handleResponseMessages(messages: List<MessageListType_Message>) {
    if (messages != null && messages.HasElements){
      for (message in messages) {
        if (message.Type == "Error") {
          _logger.error("Message:" + message.$Value)
          _logger.error("Message.Type:" + message.Type)

          throw new DisplayableException(DISPLAY_ERROR_MESSAGE + "\n" + message.$Value)
        }
        else if (message.Type == "Warning") {
          _logger.error("Message:" + message.$Value)
          _logger.error("Message.Type:" + message.Type)

          throw new DisplayableException("Warning: " + message.$Value)
        }
        else {
          //General or Info message
          _logger.info(message.$Value)
        }
      }
    }
  }

  /**
   *  creates the xml required to make an inquiry from the lexisnexis webservice
   */
  @Param("pPeriod", "The Policy Period with homeowner details from which to create the order ")
  @Param("lexClientID", " The client ID provided by LexisNexis")
  @Param("lexAccountNumber", "The account number provided by LexisNexis")
  private function createOrderXml(pPeriod: PolicyPeriod, lexClientID: String, lexAccountNumber: String): String {
    var orderXml: String = null
    var lexOrder = new Order()
    lexOrder.Client.Id = lexClientID
    lexOrder.Client.Quoteback_elem[0].Name = "orderClueProperty"


    // use the jobNumber as quote back.
    lexOrder.Client.Quoteback_elem[0].$Value = pPeriod.Job.JobNumber

    lexOrder.Accounting.Pnc.Account = lexAccountNumber
    lexOrder.RulePlan.Id = "5200"
    lexOrder.RulePlan.Parameter_elem[0].Name = "lineOfBusiness"
    lexOrder.RulePlan.Parameter_elem[0].$Value = "Property"

    //Set clue_Property specific attributes
    var subId = "S1"
    // only one subject associated with homeowner submission
    var addId = "A1"
    // only one address associated with homeowner submission

    lexOrder.Products.ClueProperty[0].Usage_elem.$Value = Underwriting
    lexOrder.Products.ClueProperty[0].ReportType_elem.$Value = C_L_U_E__Property_only


    // Set subject details for the primary named insured
    var pHolder = pPeriod.PrimaryNamedInsured
    lexOrder.Dataset.Subjects.Subject[0].Id = subId
    lexOrder.Dataset.Addresses.Address[0].Id = addId


    var subject = lexOrder.Dataset.Subjects.Subject[0]
    // only one subject
    var address = lexOrder.Dataset.Addresses.Address[0]
    // only one address

    // use the policyHolder's public id as Quoteback
    subject.Quoteback = pHolder.PublicID
    subject.Name[0].First = pHolder.FirstName
    subject.Name[0].Last = pHolder.LastName

    subject.Name[0].Type = NameType_Type.Primary
    subject.Address[0].Type = Risk
    var pAddress = pPeriod.PolicyAddress.Address
    //Splits the addressline1 into housenumber and street
    // assumes that the house number is entered followed by a space and then the street name.
    var houseAndStreet: String[] = pAddress.AddressLine1.split(" ", 2)
    if (houseAndStreet.length == 2) {
      address.House = houseAndStreet[0]
      address.Street1 = houseAndStreet[1]
    }
    else {
      //address not in expected format
      address.House = pAddress.AddressLine1
      address.Street1 = pAddress.AddressLine2
    }
    address.City = pAddress.City
    address.State = pAddress.State.Code
    address.Postalcode = pAddress.PostalCode

    subject.Address[0].Ref = address

    var formatter = new SimpleDateFormat(DATE_FORMAT)
    if (pHolder.DateOfBirth != null){
      subject.Birthdate = formatter.format(pHolder.DateOfBirth)
    }
    if (pHolder.ContactDenorm.SSNOfficialID != null) {
      subject.Ssn = pHolder.ContactDenorm.SSNOfficialID.replaceAll("-", "")
    }
    subject.Description.Sex = getSex(pHolder)

    lexOrder.Products.ClueProperty[0].PrimarySubject = subject
    lexOrder.Products.ClueProperty[0].RiskAddress = address

    orderXml = lexOrder.asUTFString()
    return orderXml
  }

  /**
   * Reads in various properties from the lexisnexis.properties file
   */
  private function setProperties() {
    LEX_CLIENT_ID = una.integration.lexisnexis.properties.lexisnexis.clientID
    LEX_ACCOUNT_NUMBER = una.integration.lexisnexis.properties.lexisnexis.accountNumber
    LEX_INTERNET_CONNECTIVITY = new Boolean(una.integration.lexisnexis.properties.lexisnexis.publicInternetConnectivity)
    if (LEX_INTERNET_CONNECTIVITY) {
      LEX_HTTP_USERNAME = una.integration.lexisnexis.properties.lexisnexis.httpUsername
      LEX_HTTP_PASSWORD = una.integration.lexisnexis.properties.lexisnexis.httpPassword
    }
  }

  /**
   * Returns sex of the provided driver
   */
  @Param("subject", "The subject whose sex you wish to discover")
  @Returns("The sex of the provided subject or unknown if no sex is stored")
  private function getSex(subject: PolicyPriNamedInsured): DescriptionType_Sex {
    if (subject.ContactDenorm typeis Person) {
      var gender = (subject.ContactDenorm as Person).Gender
      if (gender == "F") {
        return DescriptionType_Sex.Female
      } else if (gender == "M") {
        return DescriptionType_Sex.Male
      } else {
        return Unknown
      }
    } else {
      return Unknown
    }
  }
}



