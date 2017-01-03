package una.integration.plugins.lexisfirst

uses gw.xml.ws.WsdlConfig
uses una.logging.UnaLoggerCategory
uses una.model.LexisFirstFileData
uses wsi.remote.gw.webservice.bc.bc800.billingapi.BillingAPI

uses java.lang.Exception
uses java.text.SimpleDateFormat
uses gw.plugin.messaging.BillingMessageTransport

/**
 * Created for LexisFirst Integration
 * User: ptheegala
 * Date: 9/30/16
 *
 */
class LexisFirstServicePayload {
  final static  var _logger = UnaLoggerCategory.INTEGRATION
  private static final var CLASS_NAME = LexisFirstServicePayload.Type.DisplayName
  private static final var HO3= "HO3"
  private static final var HO4= "HO4"
  private static final var HO6= "HO6"
  private static final var DP3= "DP3"
  private static final var TRUE="Y"
  private static final var FALSE="N"
  private static final var NEW_BUSINESS ="NBB"
  private static final var POLICY_CHANGE="PCB"
  private static final var REINSTATE_POLICY="REI"
  private static final var REWRITE_POLICY="NBS"
  private static final var RENEWAL_POLICY="RWB"
  private static final var HOME_OWNERS="HOME"
  private static final var RENTERS="PPTHO"
  private static final var CONDOMINIUM="PPCHO"
  private static final var DWELLING_FIRE="DFIRE"
  private static final var COVERAGE_DWELLING="COVA"
  private static final var COVERAGE_OTHER_STRUCTURES="COVB"
  private static final var COVERAGE_PERSONAL_PROPERTY="COVC"
  private static final var COVERAGE_LOSS_OF_USE="COVD"
  private static final var COVERAGE_DWELLING_FIRE="FIRE"
  private static final var COVERAGE_PERSONAL_LIABILITY="COVE"
  private static final var COVERAGE_MEDICAL_PAYMENTS="COVF"
  private static final var COVERAGE_HURRICANE="HURR"
  private static final var COVERAGE_FLOOD="FLOD"
  private static final var DIRECT_BILL_PAYMENT="Direct Bill"
  private static final var INDIVIDUAL = "I"
  private static final var BUSINESS="B"
  private static final var EXTERNAL_SYSTEM ="lexisFirst"

  private static final var PRIMARY_NAMED_INSURED = "PolicyPriNamedInsured"
  private static final var PERSON= "person"
  var lexisFirstFileData: LexisFirstFileData
  var sdf = new SimpleDateFormat("MMddyyyy")
  var config = createWsiConfig()
  var billingAPI = new BillingAPI(config)
  var billingSummaryPlugin = gw.plugin.Plugins.get( gw.plugin.billing.IBillingSummaryPlugin)
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
      lexisFirstFileData.TransactionCreationDate = sdf.format(policyPeriod.CreateTime)
      lexisFirstFileData.ActionEffectiveDate = sdf.format(policyPeriod.EditEffectiveDate)
      lexisFirstFileData.PolicyEffectiveFromDate = sdf.format(policyPeriod.PolicyStartDate)
      lexisFirstFileData.PolicyExpirationDate = sdf.format(policyPeriod.PolicyEndDate)
      lexisFirstFileData.PolicyNumber = policyPeriod.PolicyNumber
      if (policyPeriod.HomeownersLine_HOEExists) {
        lexisFirstFileData.CommercialPolicy = FALSE
      } else {
        lexisFirstFileData.CommercialPolicy = TRUE
      }

      //Action Code for Business Transactions
      if (eventName == BillingMessageTransport.CREATEPERIOD_LEXIS_FIRST_MSG) {
        lexisFirstFileData.ActionCode = NEW_BUSINESS
      }
      else if (eventName == BillingMessageTransport.CHANGEPERIOD_LEXIS_FIRST_MSG || eventName == BillingMessageTransport.ISSUEPERIOD_LEXIS_FIRST_MSG) {
        lexisFirstFileData.ActionCode = POLICY_CHANGE
      }
      else if (eventName == BillingMessageTransport.REINSTATEPERIOD_LEXIS_FIRST_MSG) {
        lexisFirstFileData.ActionCode = REINSTATE_POLICY
      }
      else if (eventName == BillingMessageTransport.RENEWPERIOD_LEXIS_FIRST_MSG) {
        lexisFirstFileData.ActionCode = RENEWAL_POLICY
      }
      else if (eventName == BillingMessageTransport.REWRITEPERIOD_LEXIS_FIRST_MSG) {
        lexisFirstFileData.ActionCode = REWRITE_POLICY
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
              +" "+ (policyPriNamedInsured.ContactDenorm.PrimaryAddress.AddressLine2 != null ? policyPriNamedInsured.ContactDenorm.PrimaryAddress.AddressLine2:"")
          lexisFirstFileData.InsuredCountry = policyPriNamedInsured.ContactDenorm.PrimaryAddress.Country.Code
          lexisFirstFileData.InsuredCity = policyPriNamedInsured.ContactDenorm.PrimaryAddress.City
          lexisFirstFileData.InsuredState = (policyPriNamedInsured.ContactDenorm.PrimaryAddress.State) as String
          lexisFirstFileData.InsuredZip = policyPriNamedInsured.ContactDenorm.PrimaryAddress.PostalCode?.substring(0, 5)
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
          +" "+(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine2 != null ? policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine2 :"")
      lexisFirstFileData.PropertyCity = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.City
      lexisFirstFileData.PropertyCountry = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.Country.Code
      lexisFirstFileData.PropertyState = (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.State) as String
      lexisFirstFileData.PropertyZip = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.PostalCode?.substring(0, 5)

      //Fetching Primary payer Details from Billing Center

        var primaryPayer = billingAPI.searchPrimaryPayer(policyPeriod.Policy.Account.AccountNumber)
        if(primaryPayer != null) {
          var fetchContact = gw.api.database.Query.make(Contact).compare(Contact#AddressBookUID,Equals,primaryPayer).select().AtMostOneRow
          var addInterest = policyPeriod.HomeownersLine_HOE.Dwelling?.AdditionalInterestDetails
          var addInterestContact = addInterest?.firstWhere( \ addlInt -> addlInt.PolicyAddlInterest.ContactDenorm.AddressBookUID == fetchContact.AddressBookUID)
          if(addInterestContact != null && (addInterestContact.AdditionalInterestType == typekey.AdditionalInterestType.TC_MORTGAGEE or
              addInterestContact.AdditionalInterestType == typekey.AdditionalInterestType.TC_FIRSTMORTGAGEE_EXT or
              addInterestContact.AdditionalInterestType == typekey.AdditionalInterestType.TC_SECONDMORTGAGEE_EXT or
              addInterestContact.AdditionalInterestType == typekey.AdditionalInterestType.TC_THIRDMORTGAGEE_EXT)){
            lexisFirstFileData.MortgageeName = addInterestContact.PolicyAddlInterest.ContactDenorm.DisplayName
            lexisFirstFileData.PayableName = addInterestContact.PolicyAddlInterest.ContactDenorm.DisplayName
            lexisFirstFileData.MortgageeCity = addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.City
            lexisFirstFileData.MortgageeCountry = addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.Country.Code
            lexisFirstFileData.MortgageeStreet = addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine1+" "+
                (addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine2 !=null ?
                    addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine2 :"")
            lexisFirstFileData.MortgageeState = (addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.State) as String
            lexisFirstFileData.MortgageeZip = addInterestContact.PolicyAddlInterest.ContactDenorm.PrimaryAddress.PostalCode?.substring(0, 5)
            lexisFirstFileData.LoanNumber =  addInterestContact.ContractNumber
            lexisFirstFileData.MortgageeInterestType = typecodeMapper.getAliasByInternalCode(AdditionalInterestType.Type.RelativeName,EXTERNAL_SYSTEM,addInterestContact.AdditionalInterestType)
          }
        }

      //Mapping Coverage Details
      if(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO3 || policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO6){
        lexisFirstFileData.CoverageTypeCode1 = COVERAGE_DWELLING
        lexisFirstFileData.CoverageAmount1 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value :0
        lexisFirstFileData.Deductible1 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value : 0
        if(!policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO6){
        lexisFirstFileData.CoverageTypeCode3 = COVERAGE_OTHER_STRUCTURES
        lexisFirstFileData.CoverageAmount3 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value : 0
        lexisFirstFileData.Deductible3 = ""
        }
        lexisFirstFileData.CoverageTypeCode2 = COVERAGE_PERSONAL_PROPERTY
        lexisFirstFileData.CoverageAmount2 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value : 0
        lexisFirstFileData.Deductible2 = ""
        lexisFirstFileData.CoverageTypeCode4 = COVERAGE_LOSS_OF_USE
        lexisFirstFileData.CoverageAmount4 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value : 0
        lexisFirstFileData.Deductible4 = ""
      } else if(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO4){
        lexisFirstFileData.CoverageTypeCode1 = COVERAGE_PERSONAL_PROPERTY
        lexisFirstFileData.CoverageAmount1 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value: 0
        lexisFirstFileData.Deductible1 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null ?
        policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value : 0
        lexisFirstFileData.CoverageTypeCode4 = COVERAGE_LOSS_OF_USE
        lexisFirstFileData.CoverageAmount4 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value : 0
        lexisFirstFileData.Deductible4 = ""
      } else if(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == DP3){
        lexisFirstFileData.CoverageTypeCode1 = COVERAGE_DWELLING_FIRE
        lexisFirstFileData.CoverageAmount1 = policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value  != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value : 0
            lexisFirstFileData.Deductible1 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null ?
        policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value : 0
        lexisFirstFileData.CoverageTypeCode3 = COVERAGE_OTHER_STRUCTURES
        lexisFirstFileData.CoverageAmount3 = policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Other_Structures_HOE.DPDW_OtherStructuresLimit_HOETerm.Value
        lexisFirstFileData.Deductible3 = ""
        lexisFirstFileData.CoverageTypeCode2 = COVERAGE_PERSONAL_PROPERTY
        lexisFirstFileData.CoverageAmount2 = policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value : 0
        lexisFirstFileData.Deductible2 = ""

      }else{
        lexisFirstFileData.CoverageTypeCode1 = COVERAGE_DWELLING
        lexisFirstFileData.CoverageAmount1 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value :0
        lexisFirstFileData.Deductible1 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null ?
        policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value : 0
        lexisFirstFileData.CoverageTypeCode3 = COVERAGE_OTHER_STRUCTURES
        lexisFirstFileData.CoverageAmount3 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value  != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value :0
        lexisFirstFileData.Deductible3 = ""
        lexisFirstFileData.CoverageTypeCode2 = COVERAGE_PERSONAL_PROPERTY
        lexisFirstFileData.CoverageAmount2 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value : 0
        lexisFirstFileData.Deductible2 = ""
        lexisFirstFileData.CoverageTypeCode4 = COVERAGE_LOSS_OF_USE
        lexisFirstFileData.CoverageAmount4 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value != null ?
            policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value : 0
        lexisFirstFileData.Deductible4 = ""
      }

      lexisFirstFileData.CoverageTypeCode5 = COVERAGE_PERSONAL_LIABILITY
      lexisFirstFileData.CoverageAmount5 = policyPeriod.HomeownersLine_HOE.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value :0
      lexisFirstFileData.Deductible5 = ""
      lexisFirstFileData.CoverageTypeCode6 = COVERAGE_MEDICAL_PAYMENTS
      lexisFirstFileData.CoverageAmount6 = policyPeriod.HomeownersLine_HOE.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm.Value : 0
      lexisFirstFileData.Deductible6 = ""
      lexisFirstFileData.CoverageTypeCode7 = COVERAGE_HURRICANE
      lexisFirstFileData.CoverageAmount7 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm.Value :0
      lexisFirstFileData.Deductible7 = ""
      lexisFirstFileData.CoverageTypeCode8 = COVERAGE_FLOOD
      lexisFirstFileData.CoverageAmount8 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FllodCovPP_HOETerm.Value != null ?
          policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FllodCovPP_HOETerm.Value :0

      lexisFirstFileData.Deductible8 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Ded_HOETerm.Value != null ?
      policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Ded_HOETerm.Value : 0
      lexisFirstFileData.CoverageTypeCode9 = ""
      lexisFirstFileData.CoverageAmount9 = ""
      lexisFirstFileData.Deductible9 = ""
      lexisFirstFileData.CoverageTypeCode10 = ""
      lexisFirstFileData.CoverageAmount10 = ""
      lexisFirstFileData.Deductible10 = ""

      lexisFirstFileData.LegalDescription = ""
      lexisFirstFileData.InsuranceCarrier = policyPeriod.UWCompany.DisplayName
      lexisFirstFileData.InsuranceCarrierNAIC = policyPeriod.UWCompany.Code as String

      //Producer Details
      lexisFirstFileData.ProducerName = policyPeriod.ProducerCodeOfRecord.Description
      lexisFirstFileData.ProducerCode = policyPeriod.ProducerCodeOfRecord.Code
      lexisFirstFileData.ProducerStreet = policyPeriod.ProducerCodeOfRecord.Address.AddressLine1
      lexisFirstFileData.ProducerCity = policyPeriod.ProducerCodeOfRecord.Address.City
      lexisFirstFileData.ProducerState = (policyPeriod.ProducerCodeOfRecord.Address.State) as String
      lexisFirstFileData.ProducerCountry = policyPeriod.ProducerCodeOfRecord.Address.Country.Code
      lexisFirstFileData.ProducerZip = policyPeriod.ProducerCodeOfRecord.Address.PostalCode?.substring(0, 5)
      lexisFirstFileData.ProducerPhone = ""

      //Endorsement Details
      lexisFirstFileData.EndorsementState1 = ""
      lexisFirstFileData.Endorsement1 = ""
      lexisFirstFileData.EndorsementState2 = ""
      lexisFirstFileData.Endorsement2 = ""
      lexisFirstFileData.EndorsementState3 = ""
      lexisFirstFileData.Endorsement3 = ""
      lexisFirstFileData.EndorsementState4 = ""
      lexisFirstFileData.Endorsement4 = ""
      lexisFirstFileData.EndorsementState5 = ""
      lexisFirstFileData.Endorsement5 = ""

      //Mapping Billing related details
      lexisFirstFileData.TotalPolicyPremium = policyPeriod.TotalPremiumRPT_amt

        var billingSummary = billingSummaryPlugin.retrievePolicyBillingSummary(policyPeriod.PolicyNumber, policyPeriod.PolicyTerm.MostRecentTerm)
        var sortedInvoices = billingSummary.Invoices.sort( \ elt1, elt2 -> elt1.InvoiceDueDate.before(elt2.InvoiceDueDate))
        var firstUnpaidInvoice = sortedInvoices.firstWhere( \ elt -> elt.Unpaid.Amount > 0)
        if(billingSummary.BillingMethod.DisplayName == DIRECT_BILL_PAYMENT) {
          lexisFirstFileData.PremiumAmountDue = firstUnpaidInvoice.Amount.Amount
          lexisFirstFileData.PremiumAmountDueDate = sdf.format(firstUnpaidInvoice.InvoiceDueDate)
        } else{
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
      if(policyPeriod.Notes*.DisplayName.first() != null){
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