package una.integration.plugins.lexisfirst

uses gw.plugin.Plugins
uses gw.plugin.billing.IBillingSummaryPlugin
uses gw.plugin.billing.bc800.BCBillingSystemPlugin
uses una.logging.UnaLoggerCategory
uses una.model.LexisFirstFileData
uses java.lang.Exception
uses java.text.SimpleDateFormat
uses java.util.ArrayList


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
  static final var HOA_Ext = "HOA_Ext"
  static final var HOB_Ext = "HOB_Ext"
  static final var HCONB_Ext = "HCONB_Ext"
  static final var TDP1_Ext = "TDP1_Ext"
  static final var TDP2_Ext = "TDP2_Ext"
  static final var TDP3_Ext = "TDP3_Ext"
  static final var LPP_Ext = "LPP_Ext"
  static final var TRUE = "Y"
  static final var FALSE = "N"
  static final var NEW_BUSINESS_PAYER = "NBB"
  static final var POLICY_CHANGE = "PCH"
  static final var REINSTATE_POLICY = "REI"
  static final var NEW_BUSINESS = "NBS"
  static final var RENEWAL_POLICY_PAYER = "RWB"
  static final var RENEWAL_POLICY = "RWL"
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
  static final var COVERAGE_BUSINESS_PURSUIT= "BUSP"
  static final var COVERAGE_MOLD = "MOLD"
  static final var DIRECT_BILL_PAYMENT = "Direct Bill"
  static final var INDIVIDUAL = "I"
  static final var BUSINESS = "B"
  static final var EXTERNAL_SYSTEM = "lexisFirst"
  static final var PRIMARY_NAMED_INSURED = "PolicyPriNamedInsured"
  static final var PERSON = "person"
  static final var UNAIC ="11986"
  static final var UICNA ="10759"
  static var endorseFormNumbers = {"HO 23 56","HO 04 20","HO 04 35","HO 04 35","HO 04 36","HO 04 54","HO 04 77","HO 17 32","HO 17 52","HO-135","HO-310","HO-315","HO-382","HO-382","UI 04 20","UI 04 47","DP 05 19","HO 05 19","UN 09 90","UN 10 03","UN 30 25","UN 30 26","UN 30 27","UN 30 28","CGIA 106","DP 04 63","DP 04 63","DP 04 71","UI 04 64","UI 23 69","UIC OL","UN 09 97"}
  var matchedRecords = new ArrayList(endorseFormNumbers)
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
  function payLoadXML(policyPeriod: PolicyPeriod, eventName: String,mortgage:AddlInterestDetail,primaryPayer:AddlInterestDetail): LexisFirstFileData {
    _logger.debug(" Entering  " + CLASS_NAME + " :: " + "" + "For LexisFirst payload service  ")
    _logger.info("Lexis First generating payload XML for event ::" + eventName)
    lexisFirstFileData = new LexisFirstFileData()
    try {

      policyInfo(policyPeriod,eventName,lexisFirstFileData,mortgage,primaryPayer)
      policyInsuredInfo(policyPeriod,lexisFirstFileData)
      producerInfo(policyPeriod,lexisFirstFileData)
      mortgageInfo(policyPeriod,lexisFirstFileData,mortgage)
      coverageInfo(policyPeriod,lexisFirstFileData)
      dwellingInfo(policyPeriod,lexisFirstFileData)
      paymentInfo(policyPeriod,lexisFirstFileData)
      endorsementInfo(policyPeriod,lexisFirstFileData)
      remittanceInfo(policyPeriod,lexisFirstFileData)
      var payload = new una.gxmodels.lexisfirstfiledatamodel.LexisFirstFileData(lexisFirstFileData)
      _logger.info("Lexis First payload XML ::" + payload.asUTFString())
      _logger.debug(" Leaving  " + CLASS_NAME + " :: " + "" + "For LexisFirst payload service  ")
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
  private function policyInfo(policyPeriod: PolicyPeriod, eventName: String,lexisDTO: LexisFirstFileData,mortgage:AddlInterestDetail,primaryPayer:AddlInterestDetail) {
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
    if(primaryPayer != null && primaryPayer == mortgage){
      switch (eventName) {
        case LexisFirstMessageTransportImpl.CREATEPERIOD_LEXIS_FIRST_MSG :
            lexisDTO.ActionCode = NEW_BUSINESS_PAYER
            break
        case LexisFirstMessageTransportImpl.ISSUEPERIOD_LEXIS_FIRST_MSG:
            lexisDTO.ActionCode = NEW_BUSINESS_PAYER
            break
        case LexisFirstMessageTransportImpl.CHANGEPERIOD_LEXIS_FIRST_MSG:
            lexisDTO.ActionCode = POLICY_CHANGE
            break
        case LexisFirstMessageTransportImpl.REINSTATEPERIOD_LEXIS_FIRST_MSG:
            lexisDTO.ActionCode = REINSTATE_POLICY
            break
        case LexisFirstMessageTransportImpl.RENEWPERIOD_LEXIS_FIRST_MSG:
            lexisDTO.ActionCode = RENEWAL_POLICY_PAYER
            break
        case LexisFirstMessageTransportImpl.REWRITEPERIOD_LEXIS_FIRST_MSG:
            lexisDTO.ActionCode = NEW_BUSINESS_PAYER
            break
          default:
          lexisDTO.ActionCode = ""
      }
    } else{
      switch (eventName) {
        case LexisFirstMessageTransportImpl.CREATEPERIOD_LEXIS_FIRST_MSG :
            lexisDTO.ActionCode = NEW_BUSINESS
            break
        case LexisFirstMessageTransportImpl.ISSUEPERIOD_LEXIS_FIRST_MSG:
            lexisDTO.ActionCode = NEW_BUSINESS
            break
        case LexisFirstMessageTransportImpl.CHANGEPERIOD_LEXIS_FIRST_MSG:
            lexisDTO.ActionCode = POLICY_CHANGE
            break
        case LexisFirstMessageTransportImpl.REINSTATEPERIOD_LEXIS_FIRST_MSG:
            lexisDTO.ActionCode = REINSTATE_POLICY
            break
        case LexisFirstMessageTransportImpl.RENEWPERIOD_LEXIS_FIRST_MSG:
            lexisDTO.ActionCode = RENEWAL_POLICY
            break
        case LexisFirstMessageTransportImpl.REWRITEPERIOD_LEXIS_FIRST_MSG:
            lexisDTO.ActionCode = NEW_BUSINESS
            break
          default:
          lexisDTO.ActionCode = ""
      }

    }
    //Policy type Mapping
    if(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO3 || policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HOA_Ext ||
        policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HOB_Ext){
      lexisDTO.PolicyTypeCode = HOME_OWNERS
    }
    else if(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO4){
      lexisDTO.PolicyTypeCode = RENTERS
    }
    else if(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HO6 || policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == HCONB_Ext){
      lexisDTO.PolicyTypeCode = CONDOMINIUM
    }
    else if(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == DP3 || policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == TDP1_Ext
        || policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == TDP2_Ext || policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == TDP3_Ext
        || policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == LPP_Ext){
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

        //Remittance Details
        lexisDTO.RemittanceStreet = policyPriNamedInsured.ContactDenorm.PrimaryAddress.AddressLine1
            + " " + (policyPriNamedInsured.ContactDenorm.PrimaryAddress.AddressLine2 != null ? policyPriNamedInsured.ContactDenorm.PrimaryAddress.AddressLine2 : "")
        lexisDTO.RemittanceCity = policyPriNamedInsured.ContactDenorm.PrimaryAddress.City
        lexisDTO.RemittanceState = (policyPriNamedInsured.ContactDenorm.PrimaryAddress.State) as String
        lexisDTO.RemittanceZip = policyPriNamedInsured.ContactDenorm.PrimaryAddress.PostalCode?.length > 5 ? policyPriNamedInsured.ContactDenorm.PrimaryAddress.PostalCode.substring(0, 5)
            : policyPriNamedInsured.ContactDenorm.PrimaryAddress.PostalCode
        lexisDTO.RemittanceCountry = policyPriNamedInsured.ContactDenorm.PrimaryAddress.Country.Code
        lexisDTO.RemittancePhone = policyPriNamedInsured.ContactDenorm.WorkPhone
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
        + " " + (policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.AddressLine2 != null ? policyPeriod.ProducerCodeOfRecord.Contact_Ext.PrimaryAddress.AddressLine2 : "")
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
  private function mortgageInfo(policyPeriod: PolicyPeriod,lexisDTO: LexisFirstFileData,mortgage:AddlInterestDetail){
    //Fetching Primary payer Details from Billing Center
        lexisDTO.MortgageeName = mortgage.PolicyAddlInterest.ContactDenorm.DisplayName
        lexisDTO.MortgageeCity = mortgage.PolicyAddlInterest.ContactDenorm.PrimaryAddress.City
        lexisDTO.MortgageeCountry = mortgage.PolicyAddlInterest.ContactDenorm.PrimaryAddress.Country.Code
        lexisDTO.MortgageeStreet = mortgage.PolicyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine1 + " " +
            (mortgage.PolicyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine2 != null ?
                mortgage.PolicyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine2 : "")
        lexisDTO.MortgageeState = (mortgage.PolicyAddlInterest.ContactDenorm.PrimaryAddress.State) as String
        lexisDTO.MortgageeZip = mortgage.PolicyAddlInterest.ContactDenorm.PrimaryAddress.PostalCode?.length > 5 ? mortgage.PolicyAddlInterest.ContactDenorm.PrimaryAddress.PostalCode.substring(0, 5)
            : mortgage.PolicyAddlInterest.ContactDenorm.PrimaryAddress.PostalCode
        lexisDTO.LoanNumber = mortgage.ContractNumber
        lexisDTO.MortgageeInterestType = typecodeMapper.getAliasByInternalCode(AdditionalInterestType.Type.RelativeName, EXTERNAL_SYSTEM, mortgage.AdditionalInterestType.Code)
     }

  /**
   * This function returns coverageInfo data to lexisDTO.
   * @param policyPeriod
   * @param lexisDTO
   */
  private function coverageInfo(policyPeriod: PolicyPeriod,lexisDTO: LexisFirstFileData){
    //Mapping Coverage Details
    if(policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value != 0){
       lexisDTO.CoverageTypeCode1 = COVERAGE_DWELLING
       lexisDTO.CoverageAmount1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value) as String
      } else if(policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode1 = COVERAGE_DWELLING
      lexisDTO.CoverageAmount1 = (policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm.Value) as String
    }
    if(policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value != 0)
      lexisDTO.Deductible1 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value) as String

    if(policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode2 = COVERAGE_PERSONAL_PROPERTY
      lexisDTO.CoverageAmount2 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value) as String
      } else if(policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode2 = COVERAGE_PERSONAL_PROPERTY
      lexisDTO.CoverageAmount2 = (policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm.Value) as String
      }
    if(policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_AllPeril_HOE_ExtTerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_AllPeril_HOE_ExtTerm.Value != 0)
      lexisDTO.Deductible2 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_AllPeril_HOE_ExtTerm.Value) as String

    if(policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode3 = COVERAGE_OTHER_STRUCTURES
      lexisDTO.CoverageAmount3 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value) as String
      } else if(policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Other_Structures_HOE.DPDW_OtherStructuresLimit_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Other_Structures_HOE.DPDW_OtherStructuresLimit_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode3 = COVERAGE_OTHER_STRUCTURES
      lexisDTO.CoverageAmount3 = (policyPeriod.HomeownersLine_HOE.Dwelling.DPDW_Other_Structures_HOE.DPDW_OtherStructuresLimit_HOETerm.Value) as String
      }
    if(policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode4 = COVERAGE_LOSS_OF_USE
      lexisDTO.CoverageAmount4 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value) as String
      }
    if(policyPeriod.HomeownersLine_HOE.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode5 = COVERAGE_PERSONAL_LIABILITY
      lexisDTO.CoverageAmount5 = (policyPeriod.HomeownersLine_HOE.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value) as String
      } else if(policyPeriod.HomeownersLine_HOE.DPLI_Personal_Liability_HOE.DPLI_LiabilityLimit_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.DPLI_Personal_Liability_HOE.DPLI_LiabilityLimit_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode5 = COVERAGE_PERSONAL_LIABILITY
      lexisDTO.CoverageAmount5 = (policyPeriod.HomeownersLine_HOE.DPLI_Personal_Liability_HOE.DPLI_LiabilityLimit_HOETerm.Value) as String
      }
    if(policyPeriod.HomeownersLine_HOE.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode6 = COVERAGE_MEDICAL_PAYMENTS
      lexisDTO.CoverageAmount6 = (policyPeriod.HomeownersLine_HOE.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm.Value) as String
      } else if(policyPeriod.HomeownersLine_HOE.DPLI_Med_Pay_HOE.DPLI_MedPay_Limit_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.DPLI_Med_Pay_HOE.DPLI_MedPay_Limit_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode6 = COVERAGE_MEDICAL_PAYMENTS
      lexisDTO.CoverageAmount6 = (policyPeriod.HomeownersLine_HOE.DPLI_Med_Pay_HOE.DPLI_MedPay_Limit_HOETerm.Value) as String
      }
    if(policyPeriod.HomeownersLine_HOE.Dwelling.HODW_HurricaneCov_HOE_Ext.HODW_HurricaneConstructionType_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.HODW_HurricaneCov_HOE_Ext.HODW_HurricaneConstructionType_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode7 = COVERAGE_HURRICANE
      lexisDTO.CoverageAmount7 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_HurricaneCov_HOE_Ext.HODW_HurricaneConstructionType_HOETerm.Value) as String
      if(policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm.Value != 0)
        lexisDTO.Deductible7 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm.Value) as String
    }
    if(policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Dwelling_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Dwelling_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode8 = COVERAGE_FLOOD
      lexisDTO.CoverageAmount8 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Dwelling_HOETerm.Value) as String
      if(policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Dwelling_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Dwelling_HOETerm.Value != 0)
      lexisDTO.Deductible8 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Ded_HOETerm.Value) as String
      }
    if(policyPeriod.HomeownersLine_HOE.HOLI_BusinessPursuits_HOE_Ext.HOLI_NumClercEmp_HOE_ExtTerm.Value != null && policyPeriod.HomeownersLine_HOE.HOLI_BusinessPursuits_HOE_Ext.HOLI_NumClercEmp_HOE_ExtTerm.Value != 0) {
      lexisDTO.CoverageTypeCode9 = COVERAGE_BUSINESS_PURSUIT
      lexisDTO.CoverageAmount9 = (policyPeriod.HomeownersLine_HOE.HOLI_BusinessPursuits_HOE_Ext.HOLI_NumClercEmp_HOE_ExtTerm.Value) as String
      }
    if(policyPeriod.HomeownersLine_HOE.Dwelling.HODW_MoldRemediationCov_HOE_Ext.HODW_MoldRemedCovLimit_HOETerm.Value != null && policyPeriod.HomeownersLine_HOE.Dwelling.HODW_MoldRemediationCov_HOE_Ext.HODW_MoldRemedCovLimit_HOETerm.Value != 0){
      lexisDTO.CoverageTypeCode10 = COVERAGE_MOLD
      lexisDTO.CoverageAmount10 = (policyPeriod.HomeownersLine_HOE.Dwelling.HODW_MoldRemediationCov_HOE_Ext.HODW_MoldRemedCovLimit_HOETerm.Value) as String
      }
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
    lexisDTO.TotalPolicyPremium = policyPeriod.TotalCostRPT
    if(lexisDTO.ActionCode == NEW_BUSINESS_PAYER || lexisDTO.ActionCode == RENEWAL_POLICY_PAYER){
    var billingSummary = billingSummaryPlugin.retrievePolicyBillingSummary(policyPeriod.PolicyNumber, (policyPeriod.PolicyTerm.MostRecentTerm) as int)
    var sortedInvoices = billingSummary.Invoices.sort(\elt1, elt2 -> elt1.InvoiceDueDate.before(elt2.InvoiceDueDate))
    var firstUnpaidInvoice = sortedInvoices.firstWhere(\elt -> elt.Unpaid.Amount > 0)
    if (billingSummary.BillingMethod.DisplayName == DIRECT_BILL_PAYMENT) {
      lexisDTO.PremiumAmountDue = firstUnpaidInvoice.Amount.Amount
      lexisDTO.PremiumAmountDueDate = firstUnpaidInvoice.InvoiceDueDate != null ? sdf.format(firstUnpaidInvoice.InvoiceDueDate) : ""
    }
    }
    lexisDTO.IncreasedPremiumAmountDue = ""
    lexisDTO.MaximumPremiumAmountDue = ""
    lexisDTO.LegalDescription = ""
    lexisDTO.InsuranceCarrier = policyPeriod.UWCompany.DisplayName
    lexisDTO.PayableName = policyPeriod.UWCompany.DisplayName
    lexisDTO.InsuranceCarrierNAIC = policyPeriod.UWCompany.Code == "01"? UNAIC:UICNA
  }

  /**
   * This function returns endorsementInfo data to lexisDTO.
   * @param policyPeriod
   * @param lexisDTO
   */
  private function endorsementInfo(policyPeriod: PolicyPeriod,lexisDTO: LexisFirstFileData){
    //Endorsement Details
    try{
    matchedRecords.retainAll(policyPeriod.Forms.FormNumber)
    var size = matchedRecords.size()
    lexisDTO.Endorsement1 = (size>=1?matchedRecords[0]:"") as String
    if(lexisDTO.Endorsement1 != null && lexisDTO.Endorsement1 != "")
    lexisDTO.EndorsementState1 = policyPeriod.BaseState.Code
    lexisDTO.Endorsement2 = (size>1?matchedRecords[1]:"") as String
    if(lexisDTO.Endorsement2 != null && lexisDTO.Endorsement2 != "")
    lexisDTO.EndorsementState2 = policyPeriod.BaseState.Code
    lexisDTO.Endorsement3 = (size>2?matchedRecords[2]:"") as String
    if(lexisDTO.Endorsement3 != null && lexisDTO.Endorsement3 != "")
    lexisDTO.EndorsementState3 = policyPeriod.BaseState.Code
    lexisDTO.Endorsement4 = (size>3?matchedRecords[3]:"") as String
    if(lexisDTO.Endorsement4 != null && lexisDTO.Endorsement4 != "")
    lexisDTO.EndorsementState4 = policyPeriod.BaseState.Code
    lexisDTO.Endorsement5 = (size>4?matchedRecords[4]:"") as String
    if(lexisDTO.Endorsement5 != null && lexisDTO.Endorsement5 != "")
    lexisDTO.EndorsementState5 = policyPeriod.BaseState.Code
    }catch(exp:Exception){
      _logger.error("Lexis First creating endorsementInfo Error::::" + exp)
    }

  }

  /**
   * This function returns remittanceInfo data to lexisDTO.
   * @param policyPeriod
   * @param lexisDTO
   * TODO mapping
   */
  private function remittanceInfo(policyPeriod: PolicyPeriod,lexisDTO: LexisFirstFileData){
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