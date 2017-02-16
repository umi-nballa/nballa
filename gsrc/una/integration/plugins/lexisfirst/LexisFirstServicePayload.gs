package una.integration.plugins.lexisfirst

uses gw.xml.ws.WsdlConfig
uses una.logging.UnaLoggerCategory
uses una.model.LexisFirstFileData
uses wsi.remote.gw.webservice.bc.bc800.billingapi.BillingAPI

uses java.lang.Exception
uses java.text.SimpleDateFormat
uses gw.plugin.messaging.BillingMessageTransport
uses una.utils.PropertiesHolder

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
  var config = createWsiConfig()
  var billingAPI = new BillingAPI(config)
  var billingSummaryPlugin = gw.plugin.Plugins.get(gw.plugin.billing.IBillingSummaryPlugin)
  var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
  /**
   * This function  creates payload to process LexisFirst transaction.
   * @param policyPeriod
   * @param eventName
   */
  function payLoadXML(policyPeriod: PolicyPeriod, eventName: String): LexisFirstFileData {
    _logger.info(" Entering  " + CLASS_NAME + " :: " + "" + "For LexisFirst payload service  ")
    _logger.info("Lexis First generating payload XML for event ::" + eventName)
    try {
      policyPeriod = policyPeriod.getSlice(policyPeriod.EditEffectiveDate)
      lexisFirstFileData = new LexisFirstFileData()
      lexisFirstFileData.RecordTypeIndicator = "1"
      lexisFirstFileData.CustomerTransactionID = ""
      lexisFirstFileData.TransactionCreationDate = policyPeriod.CreateTime != null ? sdf.format(policyPeriod.CreateTime) : ""
      lexisFirstFileData.ActionEffectiveDate = policyPeriod.EditEffectiveDate != null ? sdf.format(policyPeriod.EditEffectiveDate) : ""
      lexisFirstFileData.PolicyEffectiveFromDate = policyPeriod.PolicyStartDate != null ? sdf.format(policyPeriod.PolicyStartDate) : ""
      lexisFirstFileData.PolicyExpirationDate = policyPeriod.PolicyEndDate != null ? sdf.format(policyPeriod.PolicyEndDate) : ""
      lexisFirstFileData.PolicyNumber = policyPeriod.PolicyNumber
      if (policyPeriod.HomeownersLine_HOEExists) {
        lexisFirstFileData.CommercialPolicy = FALSE
      } else {
        lexisFirstFileData.CommercialPolicy = TRUE
      }

      //Action Code for Business Transactions
      if (eventName == BillingMessageTransport.CREATEPERIOD_LEXIS_FIRST_MSG || eventName == BillingMessageTransport.ISSUEPERIOD_LEXIS_FIRST_MSG) {
          lexisFirstFileData.ActionCode = NEW_BUSINESS
      }
      else if (eventName == BillingMessageTransport.CHANGEPERIOD_LEXIS_FIRST_MSG) {
          lexisFirstFileData.ActionCode = POLICY_CHANGE
      }
      else if (eventName == BillingMessageTransport.REINSTATEPERIOD_LEXIS_FIRST_MSG) {
          lexisFirstFileData.ActionCode = REINSTATE_POLICY
      }
      else if (eventName == BillingMessageTransport.RENEWPERIOD_LEXIS_FIRST_MSG) {
         lexisFirstFileData.ActionCode = RENEWAL_POLICY
      }
      else if (eventName == BillingMessageTransport.REWRITEPERIOD_LEXIS_FIRST_MSG) {
         lexisFirstFileData.ActionCode = NEW_BUSINESS
      }
      else {
        lexisFirstFileData.ActionCode = ""
      }
      //Policy type Mapping
      if (policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO3) {
         lexisFirstFileData.PolicyTypeCode = HOME_OWNERS
      }
      else if (policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO4) {
         lexisFirstFileData.PolicyTypeCode = RENTERS
      }
      else if (policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO6) {
         lexisFirstFileData.PolicyTypeCode = CONDOMINIUM
      }
      else if (policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == DP3) {
         lexisFirstFileData.PolicyTypeCode = DWELLING_FIRE
      }
      else {
        lexisFirstFileData.PolicyTypeCode = ""
      }

      //Primary Insured details
      for (policyPriNamedInsured in policyPeriod.PolicyContactRoles.whereTypeIs(PolicyNamedInsured)) {

        if (policyPriNamedInsured.Subtype == PRIMARY_NAMED_INSURED){
          if (policyPriNamedInsured.AccountContactRole.AccountContact.ContactType == PERSON) {
            lexisFirstFileData.InsuredName1Type = INDIVIDUAL
          }
          else {
            lexisFirstFileData.InsuredName1Type = BUSINESS
          }
          lexisFirstFileData.InsuredName1LastName = policyPriNamedInsured.LastName
          lexisFirstFileData.InsuredName1FirstName = policyPriNamedInsured.FirstName
          lexisFirstFileData.InsuredStreet = policyPriNamedInsured.ContactDenorm.PrimaryAddress.AddressLine1
              + " " + (policyPriNamedInsured.ContactDenorm.PrimaryAddress.AddressLine2 != null ? policyPriNamedInsured.ContactDenorm.PrimaryAddress.AddressLine2 : "")
          lexisFirstFileData.InsuredCountry = policyPriNamedInsured.ContactDenorm.PrimaryAddress.Country.Code
          lexisFirstFileData.InsuredCity = policyPriNamedInsured.ContactDenorm.PrimaryAddress.City
          lexisFirstFileData.InsuredState = (policyPriNamedInsured.ContactDenorm.PrimaryAddress.State) as String
          lexisFirstFileData.InsuredZip = policyPriNamedInsured.ContactDenorm.PrimaryAddress.PostalCode?.length > 5 ? policyPriNamedInsured.ContactDenorm.PrimaryAddress.PostalCode.substring(0, 5)
              : policyPriNamedInsured.ContactDenorm.PrimaryAddress.PostalCode
        }
      }
      for (PolicyAddlNamedInsured in policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)) {
        lexisFirstFileData.InsuredName2FirstName = PolicyAddlNamedInsured.FirstName
        lexisFirstFileData.InsuredName2LastName = PolicyAddlNamedInsured.LastName
        if (PolicyAddlNamedInsured.AccountContactRole.AccountContact.ContactType == PERSON) {
          lexisFirstFileData.InsuredName2Type = INDIVIDUAL
        }
        else {
          lexisFirstFileData.InsuredName2Type = BUSINESS
        }
      }
      //Risk Location Details
      lexisFirstFileData.PropertyStreet = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine1
          + " " + (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine2 != null ? policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine2 : "")
      lexisFirstFileData.PropertyCity = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.City
      lexisFirstFileData.PropertyCountry = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.Country.Code
      lexisFirstFileData.PropertyState = (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.State) as String
      lexisFirstFileData.PropertyZip = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.PostalCode?.length > 5 ? policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.PostalCode.substring(0, 5)
          : policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.PostalCode
      //Fetching Primary payer Details from Billing Center

      var primaryPayer = billingAPI.searchPrimaryPayer(policyPeriod.Policy.Account.AccountNumber)
      if (primaryPayer != null) {
        var fetchContact = gw.api.database.Query.make(Contact).compare(Contact#AddressBookUID, Equals, primaryPayer).select().AtMostOneRow
        var addInterest = policyPeriod.HomeownersLine_HOE.Dwelling?.AdditionalInterestDetails
        var addInterestContact = addInterest?.firstWhere(\addlInt -> addlInt.PolicyAddlInterest.ContactDenorm.AddressBookUID == fetchContact.AddressBookUID)
        if (addInterestContact != null && (addInterestContact.AdditionalInterestType == typekey.AdditionalInterestType.TC_MORTGAGEE or
            addInterestContact.AdditionalInterestType == typekey.AdditionalInterestType.TC_FIRSTMORTGAGEE_EXT or
            addInterestContact.AdditionalInterestType == typekey.AdditionalInterestType.TC_SECONDMORTGAGEE_EXT or
            addInterestContact.AdditionalInterestType == typekey.AdditionalInterestType.TC_THIRDMORTGAGEE_EXT)){
          lexisFirstFileData.MortgageeName = addInterestContact.PolicyAddlInterest.ContactDenorm.DisplayName
          lexisFirstFileData.PayableName = addInterestContact.PolicyAddlInterest.ContactDenorm.DisplayName
          lexisFirstFileData.MortgageeCity = addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.City
          lexisFirstFileData.MortgageeCountry = addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.Country.Code
          lexisFirstFileData.MortgageeStreet = addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine1 + " " +
              (addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine2 != null ?
                  addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine2 : "")
          lexisFirstFileData.MortgageeState = (addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.State) as String
          lexisFirstFileData.MortgageeZip = addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.PostalCode?.length > 5 ? addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.PostalCode.substring(0, 5)
              : addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.PostalCode
          lexisFirstFileData.LoanNumber = addInterestContact.ContractNumber
          lexisFirstFileData.MortgageeInterestType = typecodeMapper.getAliasByInternalCode(AdditionalInterestType.Type.RelativeName, EXTERNAL_SYSTEM, addInterestContact.AdditionalInterestType.Code)
        }
      }

      //Mapping Coverage Details
      if (policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO3 || policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO6) {
        lexisFirstFileData.CoverageTypeCode1 = COVERAGE_DWELLING
        lexisFirstFileData.CoverageAmount1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value : "") as String
        lexisFirstFileData.Deductible1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value : "") as String
        if (!(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO6)){
          lexisFirstFileData.CoverageTypeCode3 = COVERAGE_OTHER_STRUCTURES
          lexisFirstFileData.CoverageAmount3 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value != null ?
              policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value : "") as String
          lexisFirstFileData.Deductible3 = ""
        }
        lexisFirstFileData.CoverageTypeCode2 = COVERAGE_PERSONAL_PROPERTY
        lexisFirstFileData.CoverageAmount2 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value : "") as String
        lexisFirstFileData.Deductible2 = ""
        lexisFirstFileData.CoverageTypeCode4 = COVERAGE_LOSS_OF_USE
        lexisFirstFileData.CoverageAmount4 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value : "") as String
        lexisFirstFileData.Deductible4 = ""
      } else if (policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO4) {
        lexisFirstFileData.CoverageTypeCode1 = COVERAGE_PERSONAL_PROPERTY
        lexisFirstFileData.CoverageAmount1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value : "") as String
        lexisFirstFileData.Deductible1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value : "") as String
        lexisFirstFileData.CoverageTypeCode4 = COVERAGE_LOSS_OF_USE
        lexisFirstFileData.CoverageAmount4 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value : "") as String
        lexisFirstFileData.Deductible4 = ""
      } else if (policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == DP3) {
        lexisFirstFileData.CoverageTypeCode1 = COVERAGE_DWELLING_FIRE
        lexisFirstFileData.CoverageAmount1 = (policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value : "") as String
        lexisFirstFileData.Deductible1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value : "") as String
        lexisFirstFileData.CoverageTypeCode3 = COVERAGE_OTHER_STRUCTURES
        lexisFirstFileData.CoverageAmount3 = (policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Other_Structures_HOE.DPDW_OtherStructuresLimit_HOETerm.Value) as String
        lexisFirstFileData.Deductible3 = ""
        lexisFirstFileData.CoverageTypeCode2 = COVERAGE_PERSONAL_PROPERTY
        lexisFirstFileData.CoverageAmount2 = (policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value : "") as String
        lexisFirstFileData.Deductible2 = ""
      } else {
        lexisFirstFileData.CoverageTypeCode1 = COVERAGE_DWELLING
        lexisFirstFileData.CoverageAmount1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value : "") as String
        lexisFirstFileData.Deductible1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value : "") as String
        lexisFirstFileData.CoverageTypeCode3 = COVERAGE_OTHER_STRUCTURES
        lexisFirstFileData.CoverageAmount3 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value : "") as String
        lexisFirstFileData.Deductible3 = ""
        lexisFirstFileData.CoverageTypeCode2 = COVERAGE_PERSONAL_PROPERTY
        lexisFirstFileData.CoverageAmount2 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value : "") as String
        lexisFirstFileData.Deductible2 = ""
        lexisFirstFileData.CoverageTypeCode4 = COVERAGE_LOSS_OF_USE
        lexisFirstFileData.CoverageAmount4 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value : "") as String
        lexisFirstFileData.Deductible4 = ""
      }

      lexisFirstFileData.CoverageTypeCode5 = COVERAGE_PERSONAL_LIABILITY
      lexisFirstFileData.CoverageAmount5 = (policyPeriod.HomeownersLine_HOE.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value : "") as String
      lexisFirstFileData.Deductible5 = ""
      lexisFirstFileData.CoverageTypeCode6 = COVERAGE_MEDICAL_PAYMENTS
      lexisFirstFileData.CoverageAmount6 = (policyPeriod.HomeownersLine_HOE.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm.Value : "") as String
      lexisFirstFileData.Deductible6 = ""
      lexisFirstFileData.CoverageTypeCode7 = COVERAGE_HURRICANE
      lexisFirstFileData.CoverageAmount7 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm.Value : "") as String
      lexisFirstFileData.Deductible7 = ""
      lexisFirstFileData.CoverageTypeCode8 = COVERAGE_FLOOD
      lexisFirstFileData.CoverageAmount8 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FllodCovPP_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FllodCovPP_HOETerm.Value : "") as String

      lexisFirstFileData.Deductible8 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Ded_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Ded_HOETerm.Value : "") as String
      lexisFirstFileData.CoverageTypeCode9 = ""
      lexisFirstFileData.CoverageAmount9 = ""
      lexisFirstFileData.Deductible9 = ""
      lexisFirstFileData.CoverageTypeCode10 = ""
      lexisFirstFileData.CoverageAmount10 = ""
      lexisFirstFileData.Deductible10 = ""

      lexisFirstFileData.LegalDescription = ""
      lexisFirstFileData.InsuranceCarrier = policyPeriod.UWCompany.DisplayName
      lexisFirstFileData.InsuranceCarrierNAIC = policyPeriod.UWCompany.Code == "01"? "11986":"10759"

      //Producer Details
      lexisFirstFileData.ProducerName = policyPeriod.ProducerCodeOfRecord.OrganizationWithUpdate
      lexisFirstFileData.ProducerCode = policyPeriod.ProducerCodeOfRecord.Code
      lexisFirstFileData.ProducerStreet = policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.AddressLine1
      lexisFirstFileData.ProducerCity = policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.City
      lexisFirstFileData.ProducerState = policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.State.Code
      lexisFirstFileData.ProducerCountry = policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.Country.Code
      lexisFirstFileData.ProducerZip = policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.PostalCode?.length > 5 ? policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.PostalCode.substring(0, 5)
          : policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.PostalCode
      lexisFirstFileData.ProducerPhone = policyPeriod.ProducerCodeOfRecord.Contact_Ext.WorkPhone

      //Endorsement Details
      lexisFirstFileData.EndorsementState1 = policyPeriod.BaseState.Code
      lexisFirstFileData.EndorsementState2 = policyPeriod.BaseState.Code
      lexisFirstFileData.EndorsementState3 = policyPeriod.BaseState.Code
      lexisFirstFileData.EndorsementState4 = policyPeriod.BaseState.Code
      lexisFirstFileData.EndorsementState5 = policyPeriod.BaseState.Code
      for (endorseNumber in policyPeriod.Forms) {
        if (endorseFormNumbers.contains(endorseNumber.FormNumber)) {
          lexisFirstFileData.Endorsement1 = endorseNumber.FormNumber
        }
        else if (endorseFormNumbers.contains(endorseNumber.FormNumber)) {
          lexisFirstFileData.Endorsement2 = endorseNumber.FormNumber
        }
        else if (endorseFormNumbers.contains(endorseNumber.FormNumber)) {
            lexisFirstFileData.Endorsement3 = endorseNumber.FormNumber
          }
          else if (endorseFormNumbers.contains(endorseNumber.FormNumber)) {
              lexisFirstFileData.Endorsement4 = endorseNumber.FormNumber
            }
            else if (endorseFormNumbers.contains(endorseNumber.FormNumber)){
                lexisFirstFileData.Endorsement5 = endorseNumber.FormNumber
              }
      }

      //Mapping Billing related details
      lexisFirstFileData.TotalPolicyPremium = policyPeriod.TotalPremiumRPT_amt

      var billingSummary = billingSummaryPlugin.retrievePolicyBillingSummary(policyPeriod.PolicyNumber, (policyPeriod.PolicyTerm.MostRecentTerm) as int)
      var sortedInvoices = billingSummary.Invoices.sort(\elt1, elt2 -> elt1.InvoiceDueDate.before(elt2.InvoiceDueDate))
      var firstUnpaidInvoice = sortedInvoices.firstWhere(\elt -> elt.Unpaid.Amount > 0)
      if (billingSummary.BillingMethod.DisplayName == DIRECT_BILL_PAYMENT) {
        lexisFirstFileData.PremiumAmountDue = firstUnpaidInvoice.Amount.Amount
        lexisFirstFileData.PremiumAmountDueDate = firstUnpaidInvoice.InvoiceDueDate != null ? sdf.format(firstUnpaidInvoice.InvoiceDueDate) : ""
      } else {
        lexisFirstFileData.PremiumAmountDue = 0
        lexisFirstFileData.PremiumAmountDueDate = ""
      }

      lexisFirstFileData.IncreasedPremiumAmountDue = ""
      lexisFirstFileData.MaximumPremiumAmountDue = ""
      //Remittance Details
      lexisFirstFileData.RemittanceStreet = ""
      lexisFirstFileData.RemittanceCity = ""
      lexisFirstFileData.RemittanceState = ""
      lexisFirstFileData.RemittanceZip = ""
      lexisFirstFileData.RemittanceCountry = ""
      lexisFirstFileData.RemittancePhone = ""
      lexisFirstFileData.FloodZoneRated = ""
      lexisFirstFileData.FloodZoneCurrent = ""
      lexisFirstFileData.Grandfathered = ""
      lexisFirstFileData.CommunityName = ""
      lexisFirstFileData.CommunityNumberORMapNumber = ""
      lexisFirstFileData.Elevation = ""
      if (policyPeriod.Notes*.DisplayName.first() != null) {
        lexisFirstFileData.Notes = policyPeriod.Notes*.DisplayName.first()
      } else {
        lexisFirstFileData.Notes = ""
      }
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
   *   This method is to get the user name and password
   */
  private function createWsiConfig(): WsdlConfig {
    var conf = new gw.xml.ws.WsdlConfig()
    conf.Guidewire.Locale = User.util.CurrentLocale.Code
    conf.Guidewire.Authentication.Username = "su"
    conf.Guidewire.Authentication.Password = "gw"
    return conf
  }
}