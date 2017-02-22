package una.integration.plugins.lexisfirst

uses gw.plugin.Plugins
uses gw.plugin.billing.IBillingSummaryPlugin
uses gw.plugin.billing.bc800.BCBillingSystemPlugin
uses una.logging.UnaLoggerCategory
uses una.model.LexisFirstFileData
uses una.utils.PropertiesHolder
uses java.lang.Exception
uses java.text.SimpleDateFormat

/**
 * Created for LexisFirst Integration
 * User: ptheegala
 * Date: 9/30/16
 *
 */
class LexisFirstServicePayload {
  final static  var _logger = UnaLoggerCategory.INTEGRATION
  static final var CLASS_NAME = LexisFirstServicePayload.Type.DisplayName
  static final var HO3 = "HO3"
  static final var HO4 = "HO4"
  static final var HO6 = "HO6"
  static final var DP3 = "DP3"
  static final var TRUE = "Y"
  static final var FALSE = "N"
  static final var NEW_BUSINESS = "NBB"
  static final var POLICY_CHANGE = "PCB"
  static final var REINSTATE_POLICY = "REI"
  static final var REWRITE_POLICY = "NBS"
  static final var RENEWAL_POLICY = "RWB"
  static final var HOME_OWNERS = "HOME"
  static final var RENTERS = "PPTHO"
  static final var CONDOMINIUM = "PPCHO"
  static final var DWELLING_FIRE = "DFIRE"
  static final var COVERAGE_DWELLING = "COVA"
  static final var COVERAGE_OTHER_STRUCTURES = "COVB"
  static final var COVERAGE_PERSONAL_PROPERTY = "COVC"
  static final var COVERAGE_LOSS_OF_USE = "COVD"
  static final var COVERAGE_DWELLING_FIRE = "FIRE"
  static final var COVERAGE_PERSONAL_LIABILITY = "COVE"
  static final var COVERAGE_MEDICAL_PAYMENTS = "COVF"
  static final var COVERAGE_HURRICANE = "HURR"
  static final var COVERAGE_FLOOD = "FLOD"
  static final var DIRECT_BILL_PAYMENT = "Direct Bill"
  static final var INDIVIDUAL = "I"
  static final var BUSINESS = "B"
  static final var EXTERNAL_SYSTEM = "lexisFirst"
  static final var PRIMARY_NAMED_INSURED = "PolicyPriNamedInsured"
  static final var PERSON = "person"
  var endorseFormNumbers = PropertiesHolder.getProperty("EndorsmentDetails")
  var lexisFirstFileData: LexisFirstFileData
  var sdf = new SimpleDateFormat("MMddyyyy")
  var billingSystemPlugin = new BCBillingSystemPlugin()
  var billingSummaryPlugin = Plugins.get(IBillingSummaryPlugin)
  var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()

  /**
   * This function  creates payload to process LexisFirst transaction.
   * @param policyPeriod
   * @param eventName
   */
  function payLoadXML(policyPeriod: PolicyPeriod, eventName: String): LexisFirstFileData {
    _logger.info(" Entering  " + CLASS_NAME + " :: " + "" + "For LexisFirst payload service  ")
    _logger.info("Lexis First generating payload XML for event ::" + eventName)
    lexisFirstFileData = new LexisFirstFileData()
    try {
      policyPeriod = policyPeriod.getSlice(policyPeriod.EditEffectiveDate)
      policyInfo(policyPeriod,eventName,lexisFirstFileData)
      policyInsuredInfo(policyPeriod,lexisFirstFileData)
      producerInfo(policyPeriod,lexisFirstFileData)
      mortgageInfo(policyPeriod,lexisFirstFileData)
      coverageInfo(policyPeriod,lexisFirstFileData)
      dwellingInfo(policyPeriod,lexisFirstFileData)
      paymentInfo(policyPeriod,lexisFirstFileData)
      endorsementInfo(policyPeriod,lexisFirstFileData)
      remittanceInfo(policyPeriod,lexisFirstFileData)
      var payload = new una.gxmodels.lexisfirstfiledatamodel.LexisFirstFileData(lexisFirstFileData)
      _logger.info("Lexis First payload XML ::" + payload.asUTFString())
      _logger.info(" Leaving  " + CLASS_NAME + " :: " + "" + "For LexisFirst payload service  ")
    } catch (exp: Exception) {
      _logger.error("Lexis First creating payload Error::::" + exp)
      throw exp
    }
    return lexisFirstFileData
  }

  /**
   * This function returns policyInfo data to lexisDTO.
   * @param policyPeriod
   * @param eventName
   * @param lexisDTO
   */
  private function policyInfo(policyPeriod: PolicyPeriod, eventName: String,lexisDTO: LexisFirstFileData) {
    lexisDTO.RecordTypeIndicator = "1"
    lexisDTO.CustomerTransactionID = ""
    lexisDTO.TransactionCreationDate = policyPeriod.CreateTime != null ? sdf.format(policyPeriod.CreateTime) : ""
    lexisDTO.ActionEffectiveDate = policyPeriod.EditEffectiveDate != null ? sdf.format(policyPeriod.EditEffectiveDate) : ""
    lexisDTO.PolicyEffectiveFromDate = policyPeriod.PolicyStartDate != null ? sdf.format(policyPeriod.PolicyStartDate) : ""
    lexisDTO.PolicyExpirationDate = policyPeriod.PolicyEndDate != null ? sdf.format(policyPeriod.PolicyEndDate) : ""
    lexisDTO.PolicyNumber = policyPeriod.PolicyNumber
    if(policyPeriod.HomeownersLine_HOEExists){
      lexisDTO.CommercialPolicy = FALSE
    } else{
      lexisDTO.CommercialPolicy = TRUE
    }
    //Action Code for Business Transactions
    if(eventName == LexisFirstMessageTransportImpl.CREATEPERIOD_LEXIS_FIRST_MSG || eventName == LexisFirstMessageTransportImpl.ISSUEPERIOD_LEXIS_FIRST_MSG) {
      lexisDTO.ActionCode = NEW_BUSINESS
    }
    else if(eventName == LexisFirstMessageTransportImpl.CHANGEPERIOD_LEXIS_FIRST_MSG){
      lexisDTO.ActionCode = POLICY_CHANGE
    }
    else if(eventName == LexisFirstMessageTransportImpl.REINSTATEPERIOD_LEXIS_FIRST_MSG){
      lexisDTO.ActionCode = REINSTATE_POLICY
    }
    else if(eventName == LexisFirstMessageTransportImpl.RENEWPERIOD_LEXIS_FIRST_MSG){
      lexisDTO.ActionCode = RENEWAL_POLICY
    }
    else{
      lexisDTO.ActionCode = ""
    }
    //Policy type Mapping
    if(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO3){
      lexisDTO.PolicyTypeCode = HOME_OWNERS
    }
    else if(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO4){
      lexisDTO.PolicyTypeCode = RENTERS
    }
    else if(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO6){
      lexisDTO.PolicyTypeCode = CONDOMINIUM
    }
    else if(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == DP3){
      lexisDTO.PolicyTypeCode = DWELLING_FIRE
    }
    else{
     lexisDTO.PolicyTypeCode = ""
     }
  }

  /**
   * This function returns policyInsuredInfo data to lexisDTO.
   * @param policyPeriod
   * @param lexisDTO
   */
  private function policyInsuredInfo(policyPeriod: PolicyPeriod,lexisDTO: LexisFirstFileData) {
    //Primary Insured details
    for (policyPriNamedInsured in policyPeriod.PolicyContactRoles.whereTypeIs(PolicyNamedInsured)) {

      if (policyPriNamedInsured.Subtype == PRIMARY_NAMED_INSURED){
        if (policyPriNamedInsured.AccountContactRole.AccountContact.ContactType == PERSON) {
          lexisDTO.InsuredName1Type = INDIVIDUAL
        }
        else {
          lexisDTO.InsuredName1Type = BUSINESS
        }
        lexisDTO.InsuredName1LastName = policyPriNamedInsured.LastName
        lexisDTO.InsuredName1FirstName = policyPriNamedInsured.FirstName
        lexisDTO.InsuredStreet = policyPriNamedInsured.ContactDenorm.PrimaryAddress.AddressLine1
            + " " + (policyPriNamedInsured.ContactDenorm.PrimaryAddress.AddressLine2 != null ? policyPriNamedInsured.ContactDenorm.PrimaryAddress.AddressLine2 : "")
        lexisDTO.InsuredCountry = policyPriNamedInsured.ContactDenorm.PrimaryAddress.Country.Code
        lexisDTO.InsuredCity = policyPriNamedInsured.ContactDenorm.PrimaryAddress.City
        lexisDTO.InsuredState = (policyPriNamedInsured.ContactDenorm.PrimaryAddress.State) as String
        lexisDTO.InsuredZip = policyPriNamedInsured.ContactDenorm.PrimaryAddress.PostalCode?.length > 5 ? policyPriNamedInsured.ContactDenorm.PrimaryAddress.PostalCode.substring(0, 5)
            : policyPriNamedInsured.ContactDenorm.PrimaryAddress.PostalCode
      }
    }
    for (PolicyAddlNamedInsured in policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)) {
      lexisDTO.InsuredName2FirstName = PolicyAddlNamedInsured.FirstName
      lexisDTO.InsuredName2LastName = PolicyAddlNamedInsured.LastName
      if (PolicyAddlNamedInsured.AccountContactRole.AccountContact.ContactType == PERSON) {
        lexisDTO.InsuredName2Type = INDIVIDUAL
      }
      else {
        lexisDTO.InsuredName2Type = BUSINESS
      }
    }
  }

  /**
   * This function returns producerInfo data to lexisDTO.
   * @param policyPeriod
   * @param lexisDTO
   */
  private function producerInfo(policyPeriod: PolicyPeriod,lexisDTO: LexisFirstFileData){
    //Producer Details
    lexisDTO.ProducerName = (policyPeriod.ProducerCodeOfRecord.OrganizationWithUpdate) as String
    lexisDTO.ProducerCode = policyPeriod.ProducerCodeOfRecord.Code
    lexisDTO.ProducerStreet = policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.AddressLine1
    lexisDTO.ProducerCity = policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.City
    lexisDTO.ProducerState = policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.State.Code
    lexisDTO.ProducerCountry = policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.Country.Code
    lexisDTO.ProducerZip = policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.PostalCode?.length > 5 ? policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.PostalCode.substring(0, 5)
        : policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.PostalCode
    lexisDTO.ProducerPhone = policyPeriod.ProducerCodeOfRecord.Contact_Ext.WorkPhone
  }

  /**
   * This function returns mortgageInfo data to lexisDTO.
   * @param policyPeriod
   * @param lexisDTO
   */
  private function mortgageInfo(policyPeriod: PolicyPeriod,lexisDTO: LexisFirstFileData){
    //Fetching Primary payer Details from Billing Center
    var primaryPayer = billingSystemPlugin.searchPrimaryPayer(policyPeriod.Policy.Account.AccountNumber)
    if (primaryPayer != null) {
      var fetchContact = gw.api.database.Query.make(Contact).compare(Contact#AddressBookUID, Equals, primaryPayer).select().AtMostOneRow
      var addInterest = policyPeriod.HomeownersLine_HOE.Dwelling?.AdditionalInterestDetails
      var addInterestContact = addInterest?.firstWhere(\addlInt -> addlInt.PolicyAddlInterest.ContactDenorm.AddressBookUID == fetchContact.AddressBookUID)
      if (addInterestContact != null && (addInterestContact.AdditionalInterestType == typekey.AdditionalInterestType.TC_MORTGAGEE or
          addInterestContact.AdditionalInterestType == typekey.AdditionalInterestType.TC_FIRSTMORTGAGEE_EXT or
          addInterestContact.AdditionalInterestType == typekey.AdditionalInterestType.TC_SECONDMORTGAGEE_EXT or
          addInterestContact.AdditionalInterestType == typekey.AdditionalInterestType.TC_THIRDMORTGAGEE_EXT)){
        lexisDTO.MortgageeName = addInterestContact.PolicyAddlInterest.ContactDenorm.DisplayName
        lexisDTO.MortgageeCity = addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.City
        lexisDTO.MortgageeCountry = addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.Country.Code
        lexisDTO.MortgageeStreet = addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine1 + " " +
            (addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine2 != null ?
                addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine2 : "")
        lexisDTO.MortgageeState = (addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.State) as String
        lexisDTO.MortgageeZip = addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.PostalCode?.length > 5 ? addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.PostalCode.substring(0, 5)
            : addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.PostalCode
        lexisDTO.LoanNumber = addInterestContact.ContractNumber
        lexisDTO.MortgageeInterestType = typecodeMapper.getAliasByInternalCode(AdditionalInterestType.Type.RelativeName, EXTERNAL_SYSTEM, addInterestContact.AdditionalInterestType.Code)
      }
    }
  }

  /**
   * This function returns coverageInfo data to lexisDTO.
   * @param policyPeriod
   * @param lexisDTO
   */
  private function coverageInfo(policyPeriod: PolicyPeriod,lexisDTO: LexisFirstFileData){
    //Mapping Coverage Details
    if (policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO3 || policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO6) {
      lexisDTO.CoverageTypeCode1 = COVERAGE_DWELLING
      lexisDTO.CoverageAmount1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value : "") as String
      lexisDTO.Deductible1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value : "") as String
      if (!(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO6)){
        lexisDTO.CoverageTypeCode3 = COVERAGE_OTHER_STRUCTURES
        lexisDTO.CoverageAmount3 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value : "") as String
        lexisDTO.Deductible3 = ""
      }
      lexisDTO.CoverageTypeCode2 = COVERAGE_PERSONAL_PROPERTY
      lexisDTO.CoverageAmount2 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value : "") as String
      lexisDTO.Deductible2 = ""
      lexisDTO.CoverageTypeCode4 = COVERAGE_LOSS_OF_USE
      lexisDTO.CoverageAmount4 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value : "") as String
      lexisDTO.Deductible4 = ""
    } else if (policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO4) {
      lexisDTO.CoverageTypeCode1 = COVERAGE_PERSONAL_PROPERTY
      lexisDTO.CoverageAmount1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value : "") as String
      lexisDTO.Deductible1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value : "") as String
      lexisDTO.CoverageTypeCode4 = COVERAGE_LOSS_OF_USE
      lexisDTO.CoverageAmount4 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value : "") as String
      lexisDTO.Deductible4 = ""
    } else if (policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == DP3) {
      lexisDTO.CoverageTypeCode1 = COVERAGE_DWELLING_FIRE
      lexisDTO.CoverageAmount1 = (policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value : "") as String
      lexisDTO.Deductible1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value : "") as String
      lexisDTO.CoverageTypeCode3 = COVERAGE_OTHER_STRUCTURES
      lexisDTO.CoverageAmount3 = (policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Other_Structures_HOE.DPDW_OtherStructuresLimit_HOETerm.Value) as String
      lexisDTO.Deductible3 = ""
      lexisDTO.CoverageTypeCode2 = COVERAGE_PERSONAL_PROPERTY
      lexisDTO.CoverageAmount2 = (policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value : "") as String
      lexisDTO.Deductible2 = ""
    } else {
      lexisDTO.CoverageTypeCode1 = COVERAGE_DWELLING
      lexisDTO.CoverageAmount1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value : "") as String
      lexisDTO.Deductible1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value : "") as String
      lexisDTO.CoverageTypeCode3 = COVERAGE_OTHER_STRUCTURES
      lexisDTO.CoverageAmount3 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value : "") as String
      lexisDTO.Deductible3 = ""
      lexisDTO.CoverageTypeCode2 = COVERAGE_PERSONAL_PROPERTY
      lexisDTO.CoverageAmount2 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value : "") as String
      lexisDTO.Deductible2 = ""
      lexisDTO.CoverageTypeCode4 = COVERAGE_LOSS_OF_USE
      lexisDTO.CoverageAmount4 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value : "") as String
      lexisDTO.Deductible4 = ""
    }
    lexisDTO.CoverageTypeCode5 = COVERAGE_PERSONAL_LIABILITY
    lexisDTO.CoverageAmount5 = (policyPeriod.HomeownersLine_HOE.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value != null ?
        policyPeriod.HomeownersLine_HOE.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value : "") as String
    lexisDTO.Deductible5 = ""
    lexisDTO.CoverageTypeCode6 = COVERAGE_MEDICAL_PAYMENTS
    lexisDTO.CoverageAmount6 = (policyPeriod.HomeownersLine_HOE.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm.Value != null ?
        policyPeriod.HomeownersLine_HOE.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm.Value : "") as String
    lexisDTO.Deductible6 = ""
    lexisDTO.CoverageTypeCode7 = COVERAGE_HURRICANE
    lexisDTO.CoverageAmount7 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm.Value != null ?
        policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm.Value : "") as String
    lexisDTO.Deductible7 = ""
    lexisDTO.CoverageTypeCode8 = COVERAGE_FLOOD
    lexisDTO.CoverageAmount8 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FllodCovPP_HOETerm.Value != null ?
        policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FllodCovPP_HOETerm.Value : "") as String
    lexisDTO.Deductible8 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Ded_HOETerm.Value != null ?
        policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Ded_HOETerm.Value : "") as String
    lexisDTO.CoverageTypeCode9 = ""
    lexisDTO.CoverageAmount9 = ""
    lexisDTO.Deductible9 = ""
    lexisDTO.CoverageTypeCode10 = ""
    lexisDTO.CoverageAmount10 = ""
    lexisDTO.Deductible10 = ""
  }

  /**
   * This function returns dwellingInfo data to lexisDTO.
   * @param policyPeriod
   * @param lexisDTO
   */
  private function dwellingInfo(policyPeriod: PolicyPeriod,lexisDTO: LexisFirstFileData){
    //Risk Location Details
    lexisDTO.PropertyStreet = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine1
        + " " + (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine2 != null ? policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine2 : "")
    lexisDTO.PropertyCity = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.City
    lexisDTO.PropertyCountry = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.Country.Code
    lexisDTO.PropertyState = (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.State) as String
    lexisDTO.PropertyZip = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.PostalCode?.length > 5 ? policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.PostalCode.substring(0, 5)
        : policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.PostalCode
  }

  /**
   * This function returns paymentInfo data to lexisDTO.
   * @param policyPeriod
   * @param eventName
   */
  private function paymentInfo(policyPeriod: PolicyPeriod,lexisDTO: LexisFirstFileData){
    //Mapping Billing related details
    lexisDTO.TotalPolicyPremium = policyPeriod.TotalPremiumRPT_amt
    var billingSummary = billingSummaryPlugin.retrievePolicyBillingSummary(policyPeriod.PolicyNumber, (policyPeriod.PolicyTerm.MostRecentTerm) as int)
    var sortedInvoices = billingSummary.Invoices.sort(\elt1, elt2 -> elt1.InvoiceDueDate.before(elt2.InvoiceDueDate))
    var firstUnpaidInvoice = sortedInvoices.firstWhere(\elt -> elt.Unpaid.Amount > 0)
    if (billingSummary.BillingMethod.DisplayName == DIRECT_BILL_PAYMENT) {
      lexisDTO.PremiumAmountDue = firstUnpaidInvoice.Amount.Amount
      lexisDTO.PremiumAmountDueDate = firstUnpaidInvoice.InvoiceDueDate != null ? sdf.format(firstUnpaidInvoice.InvoiceDueDate) : ""
    } else {
      lexisDTO.PremiumAmountDue = 0
      lexisDTO.PremiumAmountDueDate = ""
    }
    lexisDTO.IncreasedPremiumAmountDue = ""
    lexisDTO.MaximumPremiumAmountDue = ""
    lexisDTO.LegalDescription = ""
    lexisDTO.InsuranceCarrier = policyPeriod.UWCompany.DisplayName
    lexisDTO.PayableName = policyPeriod.UWCompany.DisplayName
    lexisDTO.InsuranceCarrierNAIC = policyPeriod.UWCompany.Code == "01"? "11986":"10759"
  }

  /**
   * This function returns endorsementInfo data to lexisDTO.
   * @param policyPeriod
   * @param lexisDTO
   */
  private function endorsementInfo(policyPeriod: PolicyPeriod,lexisDTO: LexisFirstFileData){
    //Endorsement Details
    lexisDTO.EndorsementState1 = policyPeriod.BaseState.Code
    lexisDTO.EndorsementState2 = policyPeriod.BaseState.Code
    lexisDTO.EndorsementState3 = policyPeriod.BaseState.Code
    lexisDTO.EndorsementState4 = policyPeriod.BaseState.Code
    lexisDTO.EndorsementState5 = policyPeriod.BaseState.Code
    for (endorseNumber in policyPeriod.Forms) {
      if(endorseFormNumbers.contains(endorseNumber.FormNumber)){
        lexisDTO.Endorsement1 = endorseNumber.FormNumber
      }
      else if(endorseFormNumbers.contains(endorseNumber.FormNumber)) {
        lexisDTO.Endorsement2 = endorseNumber.FormNumber
      }
      else if(endorseFormNumbers.contains(endorseNumber.FormNumber)) {
        lexisDTO.Endorsement3 = endorseNumber.FormNumber
      }
      else if(endorseFormNumbers.contains(endorseNumber.FormNumber)) {
       lexisDTO.Endorsement4 = endorseNumber.FormNumber
      }
      else if(endorseFormNumbers.contains(endorseNumber.FormNumber)){
       lexisDTO.Endorsement5 = endorseNumber.FormNumber
       }
    }
  }

  /**
   * This function returns remittanceInfo data to lexisDTO.
   * @param policyPeriod
   * @param lexisDTO
   */
  private function remittanceInfo(policyPeriod: PolicyPeriod,lexisDTO: LexisFirstFileData){
    //Remittance Details
    lexisDTO.RemittanceStreet = ""
    lexisDTO.RemittanceCity = ""
    lexisDTO.RemittanceState = ""
    lexisDTO.RemittanceZip = ""
    lexisDTO.RemittanceCountry = ""
    lexisDTO.RemittancePhone = ""
    lexisDTO.FloodZoneRated = ""
    lexisDTO.FloodZoneCurrent = ""
    lexisDTO.Grandfathered = ""
    lexisDTO.CommunityName = ""
    lexisDTO.CommunityNumberORMapNumber = ""
    lexisDTO.Elevation = ""
    if (policyPeriod.Notes*.DisplayName.first() != null) {
      lexisDTO.Notes = policyPeriod.Notes*.DisplayName.first()
    } else {
      lexisDTO.Notes = ""
    }
  }

}