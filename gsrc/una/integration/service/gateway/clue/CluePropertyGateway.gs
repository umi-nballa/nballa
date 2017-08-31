/**
 *  CLUE Property Integration, reference implementation for the LexisNexis web service.
 *
 *  Author:    Jgupta
 *  Date:      01/August/2016
 **/
package una.integration.service.gateway.clue

uses gw.api.util.DisplayableException
uses gw.xml.ws.WebServiceException
uses una.integration.framework.util.PropertiesHolder
uses una.integration.service.transport.clue.CluePropertyCommunicator
uses una.logging.UnaLoggerCategory
uses una.utils.DateUtil
uses wsi.schema.una.inscore.cprulesorderschema.Order
uses wsi.schema.una.inscore.cprulesorderschema.anonymous.elements.AddressListType_Address
uses wsi.schema.una.inscore.cprulesorderschema.anonymous.elements.DatasetType_Addresses
uses wsi.schema.una.inscore.cprulesorderschema.anonymous.elements.DatasetType_Subjects
uses wsi.schema.una.inscore.cprulesorderschema.anonymous.elements.SubjectListType_Subject
uses wsi.schema.una.inscore.cprulesorderschema.anonymous.elements.SubjectType_Address
uses wsi.schema.una.inscore.cprulesorderschema.anonymous.elements.SubjectType_Name
uses wsi.schema.una.inscore.cprulesorderschema.enums.DescriptionType_Sex
uses wsi.schema.una.inscore.cprulesorderschema.enums.SubjectAddressType_Type
uses wsi.schema.una.inscore.cprulesresultschema.anonymous.elements.MessageListType_Message

uses java.lang.Integer
uses java.math.BigDecimal
uses java.math.BigInteger
uses java.text.SimpleDateFormat
uses java.util.Date

class CluePropertyGateway implements CluePropertyInterface {
  private static var KEY_STORE_PATH: String
  private static var LEX_CLIENT_ID: String
  private static var LEX_ACCOUNT_NUMBER: String
  private final static var DISPLAY_ERROR_MESSAGE = "Failed to retrieve CLUE, please contact help desk."
  private final static var WS_NOT_AVAILABLE = "Failed to connect to the LexisNexis web service."
  private static var LEX_KEYSTORE_PATH: String
  private static var LEX_KEYSTORE_PASSWORD: String
  private static var LEX_INTERNET_CONNECTIVITY: Boolean
  private static var LEX_HTTP_USERNAME: String
  private static var LEX_HTTP_PASSWORD: String
  private static var DATE_FORMAT = "MM/dd/yyyy"
  private static var cluePropertyCommunicator: CluePropertyCommunicator
  var timeout = "500"
  static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  construct(thresholdTimeout: String) {
    timeout = thresholdTimeout
    cluePropertyCommunicator = new CluePropertyCommunicator()
    setProperties()
  }

  /**
   * Creates an order xml from the homeowner details in the provided policy period, then contacts the
   * LexisNexis web service to receive a result report. The result xml is then parsed and ententies are created from its contents.
   */
  @Param("pPeriod", "The Policy Period with homeowner details to create the order from.")
  @Param("accountNumber", "The Lexis Nexis Account number to use for the report order.")
  @Throws(DisplayableException, "If the web service is not available")
  function orderClueProperty(pPeriod: PolicyPeriod, accountNumber : String) {
    //attempt to create the order xml
    _logger.debug("Entering orderClueProperty to order CLUE Report ")
    var clueReportExt = new ClueReport_Ext()
    var orderXml = createOrderXml(pPeriod, LEX_CLIENT_ID, accountNumber != null ? accountNumber : LEX_ACCOUNT_NUMBER, clueReportExt)
    var result: String
    _logger.info("CLUE Request or sending order :" + orderXml)
    try {
      result = cluePropertyCommunicator.invokeCluePropertyService(orderXml)
      pPeriod.createCustomHistoryEvent(CustomHistoryType.TC_CLUE_ORDERED_EXT, \-> displaykey.Web.SubmissionWizard.Clue.EventMsg)
      _logger.info("CLUE Response or received result :" + result)
      _logger.debug("Mapping XML to Objects")
      mapXmlToObject(pPeriod, result, clueReportExt)
      _logger.info("finished ordering CLUE")
    }
        catch (wse: WebServiceException) {
          _logger.error("CluePropertyGateway.gs - Exception occured "+wse)
          throw new DisplayableException(WS_NOT_AVAILABLE, wse)
        }
  }

  /**
   * Parses the provided XML and maps CLUE elements to the provided policy period
   */
  @Param("pPeriod", " The resulting prior losses are mapped to this period.")
  @Param("responseXml", " The XML to parse.")
  private function mapXmlToObject(pPeriod: PolicyPeriod, responseXml: String, clueReportExt: ClueReport_Ext) {
    var clueResponseXml = wsi.schema.una.inscore.cprulesresultschema.Result.parse(responseXml)
    var messages = clueResponseXml.Messages.Message_elem
    foreach(message in messages) {
      var note = new Note()
      note.Confidential = false
      note.Account = pPeriod.Policy.Account
      note.Body = message.$Value != null ? message.$Value : ""
      note.Subject = message.Type != null ? message.Type : ""
      clueReportExt.addToMessages(note)
    }

    var clueProductReports = clueResponseXml.ProductResults.CluePersonalProperty
    // code for Clue Check to Check Ordered Status
    pPeriod.HomeownersLine_HOE.ClueHit_Ext = true
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
          var reference = clueReport.Admin.ProductReference
          _logger.debug(" Risk Claims: ${totalRiskClaims}"
              + ", Subject Claims: ${totalSubjectClaims}, Prior History: ${totalPriorHist}")
          //Save report status for UI feedback
          pPeriod.HomeownersLine_HOE.ClueStatus_Ext = "CLUE Request Status: ${statusMsg}. Number of Claims: ${totalClaims}"
              + ". Date: " + clueReport.Admin.DateRequestCompleted + "." + "\n" + "Mailing address, Risk Address, and Prior addresses are included in the C.L.U.E. report order."

          if (totalClaims > 0){
            var cHistories = clueReport.Report.ResultsDataset.ClaimsHistory
            // TODO: Receiving list of strings for Quoteback value. Need to analyse the mapping
            clueReportExt.QuotebackID = clueReport.Admin.Quoteback
            clueReportExt.Requestor = pPeriod.UpdateUser.Credential.UserName
            clueReportExt.ReferenceNumber = clueReport.Admin.ProductReference
            clueReportExt.AccountNumber = clueReport.Admin.PncAccount
            clueReportExt.OrderDate = clueReport.Admin.DateRequestOrdered
            clueReportExt.CompleteDate = clueReport.Admin.DateRequestCompleted
            clueReportExt.ProcessingStatus = clueReport.Admin.Status.toString()
            clueReportExt.NodeLocation = clueReport.Admin.ReportCode
            clueReportExt.RiskClaims = totalRiskClaims.toString()
            clueReportExt.SubjectClaims = totalSubjectClaims.toString()
            clueReportExt.SpecialBillingID = clueReport.Admin.SpecialBillingId

            for (cHistory in cHistories) {
              var claims = cHistory.Claim
              var cHistoryType = cHistory.Type
              for (claim in claims) {
                //for every claim reported, create a PAPriorLossExt entity and attach it to the PA line
                addOrUpdatePriorLoss(pPeriod, extractClaimDetails(claim, cHistoryType, reference, clueReportExt, pPeriod))
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
                                        cHistoryType: wsi.schema.una.inscore.xsd.property.cluepropertyv2result.enums.ResultsDataset_ClaimsHistory_Type,referenceNumber:String,
                                        clueReport: ClueReport_Ext, period: PolicyPeriod): HOPriorLoss_Ext {
    var priorLoss = new HOPriorLoss_Ext()
    var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    //get claim details
    priorLoss.Reference = referenceNumber
    priorLoss.ClaimDate = claim.ClaimDate as Date
    priorLoss.ReportedDate=claim.ClaimDate as Date
    priorLoss.ClaimAge = claim.ClaimAge.Years as Integer
    priorLoss.ClaimNum = claim.Number
    priorLoss.ClaimType = typecodeMapper.getInternalCodeByAlias(ClaimType_Ext.Type.RelativeName, "clue", cHistoryType.toString())
    priorLoss.ClueFileNumber = claim.ClueFileNumber
    priorLoss.ClueReport = clueReport


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
        cPayment.ClaimType = typecodeMapper.getInternalCodeByAlias(ClaimType_Ext.Type.RelativeName, "clue", cHistoryType.toString())
        //cPayment.ClaimDisposition = p.Disposition as String
        cPayment.ClaimAmount = p.AmountPaid as BigDecimal

        cPayment.ClaimDisposition_Ext = typecodeMapper.getInternalCodeByAlias(Status_Ext.Type.RelativeName, "clue", p.Disposition.toString())
        cPayment.LossCause_Ext = typecodeMapper.getInternalCodeByAlias(LossCause_Ext.Type.RelativeName, "clue", p.CauseOfLoss.toString())
        if (!(period.Job typeis Renewal)) {
          if (period.BaseState.Code == (typekey.State.TC_NC) as String) {
            if (typekey.LossCause_Ext.TF_NAWEATHERHO.TypeKeys.contains(cPayment.LossCause_Ext))
              cPayment.Weather = "NA"
            else if (typekey.LossCause_Ext.TF_WEATHERHO.TypeKeys.contains(cPayment.LossCause_Ext))
              cPayment.Weather = "Weather"
            else
              cPayment.Weather = "Non-Weather"
          }
        } else {
          if (typekey.LossCause_Ext.TC_EQBRK == cPayment.LossCause_Ext)
            cPayment.Weather = "NA"
          else if (typekey.LossCause_Ext.TF_RNLFILTER.TypeKeys.contains(cPayment.LossCause_Ext) ||
              typekey.ExpanedLossCause_Ext.TF_RNLNCHOFILTER.TypeKeys.contains(cPayment.LossCause_Ext) ||
              typekey.ExpanedLossCause_Ext.TF_RNLHOFILTER.TypeKeys.contains(cPayment.LossCause_Ext))
            cPayment.Weather = "Weather"
          else
            cPayment.Weather = "Non-Weather"
        }

        //Field Mapping for Chargeable
        pArray[i] = cPayment
      }
      priorLoss.ClaimPayment = pArray
    }
    priorLoss.Source = typekey.Source_Ext.TC_CLUE
    priorLoss.ChargeableClaim = una.integration.lexisnexis.util.ClueUtilInfo.calculateChargeable(priorLoss, period)
    _logger.debug("Getting claim scope and dispute date Details ")
    priorLoss.ClaimScope = typecodeMapper.getInternalCodeByAlias(ClaimScope_Ext.Type.RelativeName, "clue", claim.ScopeOfClaim.toString())
    priorLoss.DisputeDate = claim.DisputeClearanceDate as Date
    //get policy details
    priorLoss.PolicyNum = claim.Policy.Number
    priorLoss.PolicyCompany = claim.PropertyPolicy.Issuer
    //Statement field map
    var insuredType = wsi.schema.una.inscore.xsd.property.cluepropertyv2result.enums.SubjectTypeEnum.Insured
    var insured = claim.Subject.firstWhere(\c -> c.Classification == insuredType)
    // Consumer Narrative Mapping
    var consumerNarrative = claim.ConsumerNarrative?.first()
    var statement = ""
    if (consumerNarrative.Message != null && consumerNarrative.Message.size() > 0) {
      var narrativeNote = new Note()
      narrativeNote.Confidential = false
      narrativeNote.Account = period.Policy.Account
      //var author = new User()
      //author.Contact.Name = claim.ConsumerNarrative?.first().Name != null ? claim.ConsumerNarrative.first().Name : ""
      //narrativeNote.Author = author
      narrativeNote.Subject = consumerNarrative != null ? "Refers to claim " + priorLoss.ClaimNum : ""
      narrativeNote.AuthoringDate = consumerNarrative.DateFiled as Date
      narrativeNote.NarrativeRelation = consumerNarrative.Relationship?:""
      for (message in consumerNarrative.Message) {
        statement = statement.concat(message)
      }
      narrativeNote.Body = statement
      clueReport.addToNarratives(narrativeNote)
    }
    priorLoss.Statements = statement

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
		priorLoss.PolicyHolderName = policyHolder.Name.Last + ", " + policyHolder.Name.First + " " + (policyHolder.Name.Middle != null ? policyHolder.Name.Middle : "")
		var phAddress = policyHolder.Address.first()
		priorLoss.AddressType = phAddress.Type as String
		priorLoss.Address = (phAddress.House != null ? phAddress.House : "") + " " + (phAddress.Street1 != null ? phAddress.Street1 : "")
		priorLoss.City = phAddress.City
		priorLoss.State = phAddress.State
		priorLoss.Zip = phAddress.Postalcode
		priorLoss.SearchMatchIndicator = phAddress.SearchMatchIndicator.Code as String
    priorLoss.CluePropertyMatch.LocationOfLossMatchIndicator =   phAddress.Type.Code.contains("Risk") && phAddress.FsiStreet1.Code == typekey.ClueMatchIndicator_Ext.TC_MATCH && phAddress.FsiPostalcode.Code == typekey.ClueMatchIndicator_Ext.TC_MATCH  ? typekey.ClueMatchIndicator_Ext.TC_RISK :
                                                                          phAddress.Type.Code.contains("Mail") && phAddress.FsiStreet1.Code == typekey.ClueMatchIndicator_Ext.TC_MATCH && phAddress.FsiPostalcode.Code == typekey.ClueMatchIndicator_Ext.TC_MATCH ? typekey.ClueMatchIndicator_Ext.TC_MAILING :
                                                                          phAddress.Type.Code.contains("Former") && phAddress.FsiStreet1.Code == typekey.ClueMatchIndicator_Ext.TC_MATCH && phAddress.FsiPostalcode.Code == typekey.ClueMatchIndicator_Ext.TC_MATCH ? typekey.ClueMatchIndicator_Ext.TC_FORMER :  typekey.ClueMatchIndicator_Ext.TC_NOMATCH
		priorLoss.CluePropertyMatch.InsuredMatchIndicator = typekey.ClueMatchIndicator_Ext.TC_MATCH
    priorLoss.PhoneNumber = policyHolder.Telephone
		priorLoss.PolicyHolder.FirstName = policyHolder.Name.First
		priorLoss.PolicyHolder.LastName = policyHolder.Name.Last
		priorLoss.PolicyHolder.PrimaryAddress.AddressLine1 = priorLoss.Address
		priorLoss.PolicyHolder.PrimaryAddress.City = priorLoss.City
		priorLoss.PolicyHolder.PrimaryAddress.State = priorLoss.State
		priorLoss.PolicyHolder.PrimaryAddress.PostalCode = priorLoss.Zip
		priorLoss.PolicyHolder.HomePhone = priorLoss.PhoneNumber
		priorLoss.PolicyHolder.SSNOfficialID = policyHolder.Ssn != null ? String.valueOf(policyHolder.Ssn).replaceFirst("(\\d{3})(\\d{2})(\\d+)", "$1-$2-$3") : ""
    if(policyHolder.Gender != null && policyHolder.Gender.name() != "") {
      priorLoss.PolicyHolder.Gender = policyHolder.Gender.name() == GenderType.TC_F.DisplayName ? GenderType.TC_F : GenderType.TC_M
    }
		priorLoss.PolicyHolder.DateOfBirth = policyHolder.Birthdate as Date

		var claimantType = wsi.schema.una.inscore.xsd.property.cluepropertyv2result.enums.SubjectTypeEnum.Claimant
		var claimant = claim.Subject.firstWhere(\c -> c.Classification == claimantType)
		priorLoss.ClaimIssuer.FirstName = claimant.Name.First
		priorLoss.ClaimIssuer.LastName = claimant.Name.Last
    priorLoss.CluePropertyMatch.ClaimantMatchIndicator = priorLoss.PolicyHolder.FirstName == priorLoss.ClaimIssuer.FirstName && priorLoss.PolicyHolder.LastName == priorLoss.ClaimIssuer.LastName ? typekey.ClueMatchIndicator_Ext.TC_MATCH : typekey.ClueMatchIndicator_Ext.TC_NOMATCH
		priorLoss.ClaimIssuer.HomePhone = claimant.Telephone
		priorLoss.ClaimIssuer.SSNOfficialID = claimant.Ssn != null ? String.valueOf(claimant.Ssn).replaceFirst("(\\d{3})(\\d{2})(\\d+)", "$1-$2-$3") : ""
    if(claimant.Gender != null && claimant.Gender.name() != "") {
      priorLoss.ClaimIssuer.Gender = claimant.Gender.name() == GenderType.TC_F.DisplayName ? GenderType.TC_F : GenderType.TC_M
    }
		priorLoss.ClaimIssuer.DateOfBirth = claimant.Birthdate as Date
    }

    //This loss was retrieved from LexisNexis
    priorLoss.ManuallyAddedLoss = false
    priorLoss.Source = Source_Ext.TC_CLUE

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
  private function createOrderXml(pPeriod: PolicyPeriod, lexClientID: String, lexAccountNumber: String, clueReportExt: ClueReport_Ext): String {
    var orderXml: String = null
    var lexOrder = new Order()
    var lexOrderAddress = new DatasetType_Addresses()
    var lexOrderSubject = new DatasetType_Subjects()


    clueReportExt.PolicyNumber = pPeriod.PolicyNumber
    clueReportExt.PolicyType = pPeriod.HomeownersLine_HOEExists != null ? typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE :
                              pPeriod.BP7LineExists != null ? typekey.PolicyLine.TC_BP7BUSINESSOWNERSLINE :
                              pPeriod.CPLineExists != null ? typekey.PolicyLine.TC_COMMERCIALPROPERTYLINE :
                                  pPeriod.GLLineExists != null ? typekey.PolicyLine.TC_GENERALLIABILITYLINE : ""
    clueReportExt.PolicyCompany = pPeriod.UWCompany.Name
    lexOrder.Client.Id = lexClientID
    lexOrder.Client.Quoteback_elem[0].Name = "orderClueProperty"


    // use the jobNumber as quote back.
    lexOrder.Client.Quoteback_elem[0].$Value = pPeriod.Job.JobNumber

    lexOrder.Accounting.Pnc.Account = lexAccountNumber
    lexOrder.RulePlan.Id = "5200" as BigInteger
    lexOrder.RulePlan.Parameter_elem[0].Name = "lineOfBusiness"
    lexOrder.RulePlan.Parameter_elem[0].$Value = "Property"

    //Set clue_Property specific attributes
    var subId = "S"
    var i = 0
    // only one subject associated with homeowner submission
    var addId = "A"
    var x = 0
    // only one address associated with homeowner submission

    lexOrder.Products.ClueProperty[0].Usage_elem.$Value = Underwriting
    lexOrder.Products.ClueProperty[0].ReportType_elem.$Value = C_L_U_E__Property_only


    // Set subject details for the primary named insured
    var pHolder = pPeriod.PrimaryNamedInsured

    var subject1 = new SubjectListType_Subject()
    i = i + 1
    subject1.Id = subId + i

    var subType = mapSubject(pHolder.FirstName, pHolder.LastName)
    subject1.Name.add(subType)


    if (pHolder.DateOfBirth != null)
      subject1.Birthdate = DateUtil.formatDateTime(pHolder.DateOfBirth)
    //  subject1.Ssn = "000000000"


    var address = new AddressListType_Address()
    clueReportExt.Subject1.FirstName = pHolder.FirstName
    clueReportExt.Subject1.LastName = pHolder.LastName
    if(pHolder.DateOfBirth != null)   {
      subject1.Birthdate = DateUtil.formatDateTime(pHolder.DateOfBirth)
      clueReportExt.Subject1.DateOfBirth = subject1.Birthdate
    }

    if(pHolder.ContactDenorm typeis Person && (pHolder.ContactDenorm as Person).Gender != null) {
          clueReportExt.Subject1.Gender = (pHolder.ContactDenorm as Person).Gender

    }
    clueReportExt.Subject1.SSNOfficialID = pHolder.ContactDenorm.SSNOfficialID != null ? pHolder.ContactDenorm.SSNOfficialID : ""
    clueReportExt.Subject1.HomePhone  = pHolder.ContactDenorm.PrimaryPhoneValue != null ? pHolder.ContactDenorm.PrimaryPhoneValue : ""
    var location = pPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation

    if (location != null){
      x = x + 1

      var houseAndStreet = location.AddressLine1.split(" ", 2)
      if (houseAndStreet.length == 2) {
        address.House = houseAndStreet[0]
        address.Street1 = houseAndStreet[1]
      }
      else {
        //address not in expected format
        address.House = location.AddressLine1
        address.Street1 = location.AddressLine2
      }
      address.City = location.City
      address.State = location.State.Code
      address.Postalcode = location.PostalCode.substring(0,5)
      address.Id = addId + x
    clueReportExt.RiskAddress = location
    }
    lexOrderAddress.Address.add(address)
    var addressSub = mapSubjectAddress(address, "Primary")
    subject1.Address.add(addressSub)

    //Map additional insureds

    var additionalIns = pPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)

    var addIns = additionalIns.first()
    var subject = new SubjectListType_Subject()
    if (addIns != null){
      i = i + 1
      subject.Id = subId + i
      if (addIns.DateOfBirth != null)
        subject.Birthdate = DateUtil.formatDateTime(addIns.DateOfBirth)
     //   subject.Ssn = "000000000"

      var subType1 = mapSubject(addIns.FirstName, addIns.LastName)

      subject.Name.add(subType1)

      clueReportExt.Subject2.FirstName = addIns.FirstName
      clueReportExt.Subject2.LastName = addIns.LastName
      clueReportExt.Subject2.DateOfBirth = subject.Birthdate as Date
      if(addIns.ContactDenorm typeis Person && (addIns.ContactDenorm as Person).Gender != null) {
        clueReportExt.Subject1.Gender = (addIns.ContactDenorm as Person).Gender

      }
      clueReportExt.Subject2.SSNOfficialID = addIns.ContactDenorm.SSNOfficialID != null ? addIns.ContactDenorm.SSNOfficialID : ""
      clueReportExt.Subject2.HomePhone  = addIns.ContactDenorm.PrimaryPhoneValue != null ? addIns.ContactDenorm.PrimaryPhoneValue : ""

    }

    var mailingAddress: Address

    if (addIns != null) {
      mailingAddress = addIns.ContactDenorm?.AllAddresses.firstWhere(\elt -> elt.AddressType == AddressType.TC_BILLING)
      _logger.debug("************** CLUE Mailing Address ***********************: " + mailingAddress.AddressLine1)
    } else {
      mailingAddress = pPeriod.PrimaryNamedInsured.ContactDenorm?.AllAddresses.firstWhere(\elt -> elt.AddressType == AddressType.TC_BILLING)
      _logger.debug("**************CLUE Mailing Address ***********************: : " + mailingAddress.AddressLine1)
     }

    var addressSub1: SubjectType_Address
    var address1 = new AddressListType_Address()
    if (mailingAddress != null)  {
      x = x + 1
      address1 = mapAddress(address1, mailingAddress)
      address1.Id = addId + x

      addressSub1 = mapSubjectAddress(address1, "Mailing")
      subject1.Address.add(addressSub1)

      if (addIns != null){
        subject.Address.add(addressSub)
        subject.Address.add(addressSub1)
      }
	  clueReportExt.MailAddress = mailingAddress
      print(clueReportExt.MailAddress.AddressLine1)
      lexOrderAddress.Address.add(address1)
      lexOrder.Products.ClueProperty[0].MailingAddress = address1
    }


    var priorAddress = pPeriod.PrimaryNamedInsured.ContactDenorm?.AllAddresses.firstWhere(\elt -> elt.AddressType == AddressType.TC_PRIORRESIDENCEADD1_EXT)
    _logger.debug("************ Prior Address ****************** : " + priorAddress.AddressLine1)
    var addressSub2: SubjectType_Address
    var address2 = new AddressListType_Address()
    if (priorAddress != null)  {
      x = x + 1
      var priorRiskAddress = mapAddress(address2, priorAddress)
      priorRiskAddress.Id = addId + x


      addressSub2 = mapSubjectAddress(priorRiskAddress, "Former")
	  
      if(addIns != null)
        subject.Address.add(addressSub2)

      clueReportExt.PriorAddress = priorAddress
      subject1.Address.add(addressSub2)
      lexOrderAddress.Address.add(priorRiskAddress)
      lexOrder.Products.ClueProperty[0].FormerAddress = address2
    }

    lexOrderSubject.Subject.add(subject1)

    if (addIns != null){

      lexOrderSubject.Subject.add(subject)
      lexOrder.Products.ClueProperty[0].JointSubject = subject
    }


    lexOrder.Dataset.Addresses = lexOrderAddress
    lexOrder.Dataset.Subjects = lexOrderSubject


    var formatter = new SimpleDateFormat(DATE_FORMAT)
  //  subject1.Description.Sex = getSex(pHolder)

    lexOrder.Products.ClueProperty[0].PrimarySubject = subject1
    lexOrder.Products.ClueProperty[0].RiskAddress = address


    orderXml = lexOrder.asUTFString()
    _logger.debug("CLUE order XML : " + orderXml)
    return orderXml
  }

  function mapSubject(firstName: String, lastName: String): SubjectType_Name {
    var subType = new SubjectType_Name()

    subType.First = firstName
    subType.Last = lastName

    return subType
  }

  function mapSubjectAddress(address: AddressListType_Address, value: String): SubjectType_Address {
    var addressSub = new SubjectType_Address()

    if (value == "Primary")
      addressSub.Type = SubjectAddressType_Type.Risk

    if (value == "Mailing")
      addressSub.Type = SubjectAddressType_Type.Mailing

    if (value == "Former")
      addressSub.Type = SubjectAddressType_Type.Former


    addressSub.Ref = address

    return addressSub
  }

  function mapAddress(address: AddressListType_Address, pAddress: Address): AddressListType_Address {
    //Splits the addressline1 into housenumber and street
    // assumes that the house number is entered followed by a space and then the street name.

    var houseAndStreet = pAddress.AddressLine1.split(" ", 2)
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
    address.Postalcode = pAddress.PostalCode.substring(0,5)


    return address
  }

  /**
   * Reads in various properties from the ApplicationProperties.properties file
   */
  private function setProperties() {
    LEX_CLIENT_ID = PropertiesHolder.getProperty("clientID")
    LEX_ACCOUNT_NUMBER = PropertiesHolder.getProperty("accountNumber")
    LEX_INTERNET_CONNECTIVITY = new Boolean(PropertiesHolder.getProperty("publicInternetConnectivity"))
    if (LEX_INTERNET_CONNECTIVITY) {
      LEX_HTTP_USERNAME = PropertiesHolder.getProperty("httpUsername")
      LEX_HTTP_PASSWORD = PropertiesHolder.getProperty("httpPassword")
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


