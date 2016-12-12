package una.integration.plugins.lexisfirst

uses una.model.LexisFirstFileData
uses java.text.SimpleDateFormat
uses una.logging.UnaLoggerCategory
uses java.lang.Exception

/**
 * Created with IntelliJ IDEA.
 * User: ptheegala
 * Date: 9/30/16
 *
 */
class LexisFirstServicePayload {
  final static  var _logger = UnaLoggerCategory.INTEGRATION
  private static final var CLASS_NAME = LexisFirstServicePayload.Type.DisplayName
  public static final var CREATEPERIOD_MSG: String = "CreatePeriod"
  public static final var CANCELPERIOD_MSG: String = "CancelPeriod"
  public static final var CHANGEPERIOD_MSG: String = "ChangePeriod"
  public static final var ISSUEPERIOD_MSG: String = "IssuePeriod"
  public static final var REINSTATEPERIOD_MSG: String = "ReinstatePeriod"
  public static final var RENEWPERIOD_MSG: String = "RenewPeriod"
  public static final var REWRITEPERIOD_MSG: String = "RewritePeriod"

   /**
   * This function takes care of creating payload to the LexisFirst message transport.
   */
  function payLoadXML(policyPeriod: PolicyPeriod, eventName: String): LexisFirstFileData {
    var lexisFirstFileData: LexisFirstFileData
    try {
      _logger.debug(" Entering  " + CLASS_NAME + " :: " + "" + "For LexisFirst payload service  ")
      _logger.info("Lexis First generating payload XML for event ::" + eventName)
      policyPeriod = policyPeriod.getSlice(policyPeriod.EditEffectiveDate)
      var sdf = new SimpleDateFormat("yyyyMMdd")
      lexisFirstFileData = new LexisFirstFileData()
      lexisFirstFileData.RecordTypeIndicator = "1"
      lexisFirstFileData.CustomerTransactionID = ""
      lexisFirstFileData.TransactionCreationDate = sdf.format(policyPeriod.CreateTime)
      lexisFirstFileData.ActionEffectiveDate = sdf.format(policyPeriod.EditEffectiveDate)
      lexisFirstFileData.PolicyEffectiveFromDate = sdf.format(policyPeriod.PolicyStartDate)
      lexisFirstFileData.PolicyExpirationDate = sdf.format(policyPeriod.PolicyEndDate)
      lexisFirstFileData.PolicyNumber = policyPeriod.PolicyNumber
      if (policyPeriod.BOPLineExists || policyPeriod.CPLineExists) {
        lexisFirstFileData.CommercialPolicy = "Y"
      } else {
        lexisFirstFileData.CommercialPolicy = "N"
      }
      if (eventName == CREATEPERIOD_MSG || eventName == ISSUEPERIOD_MSG) {
        lexisFirstFileData.ActionCode = "NBS"
      }
      else if (eventName == CHANGEPERIOD_MSG) {
        lexisFirstFileData.ActionCode = "PCH"
      }
      else if (eventName == CANCELPERIOD_MSG) {
          lexisFirstFileData.ActionCode = "XLO"
        }
        else if (eventName == REINSTATEPERIOD_MSG) {
            lexisFirstFileData.ActionCode = "REI"
          }
          else if (eventName == RENEWPERIOD_MSG) {
              lexisFirstFileData.ActionCode = "RWL"
            }
            else if (eventName == REWRITEPERIOD_MSG) {
                lexisFirstFileData.ActionCode = "NBS"
              }
              else {
                lexisFirstFileData.ActionCode = ""
              }
      if (policyPeriod.HomeownersLine_HOE.HOPolicyType.DisplayName == "Homeowners (HO3)") {
        lexisFirstFileData.PolicyTypeCode = "HOME"
      }
      else if (policyPeriod.HomeownersLine_HOE.HOPolicyType.DisplayName == "Renters (HO4)") {
        lexisFirstFileData.PolicyTypeCode = "PPTHO"
      }
      else if (policyPeriod.HomeownersLine_HOE.HOPolicyType.DisplayName == "Condominium (HO6)") {
          lexisFirstFileData.PolicyTypeCode = "PPCHO"
        }
        else if (policyPeriod.HomeownersLine_HOE.HOPolicyType.DisplayName == "Fire Dwelling (DP3)") {
            lexisFirstFileData.PolicyTypeCode = "DFIRE"
          }

          else {
            lexisFirstFileData.PolicyTypeCode = ""
          }

      for (policyPriNamedInsured in policyPeriod.PolicyContactRoles.whereTypeIs(PolicyNamedInsured)) {

        if (policyPriNamedInsured.Subtype == "PolicyPriNamedInsured"){
          if (policyPriNamedInsured.AccountContactRole.AccountContact.ContactType == "person") {
            lexisFirstFileData.InsuredName1Type = "I"
          }
          else {
            lexisFirstFileData.InsuredName1Type = "B"
          }
          lexisFirstFileData.InsuredName1LastName = policyPriNamedInsured.LastName
          lexisFirstFileData.InsuredName1FirstName = policyPriNamedInsured.FirstName
          lexisFirstFileData.InsuredStreet = policyPriNamedInsured.ContactDenorm.PrimaryAddress.AddressLine1
          lexisFirstFileData.InsuredCountry = policyPriNamedInsured.ContactDenorm.PrimaryAddress.Country
          lexisFirstFileData.InsuredCity = policyPriNamedInsured.ContactDenorm.PrimaryAddress.City
          lexisFirstFileData.InsuredState = policyPriNamedInsured.ContactDenorm.PrimaryAddress.State
          lexisFirstFileData.InsuredZip = policyPriNamedInsured.ContactDenorm.PrimaryAddress.PostalCode.substring(0, 5)
          if (null != policyPriNamedInsured.DateOfBirth) {
            lexisFirstFileData.DateofBirth = sdf.format(policyPriNamedInsured.DateOfBirth)
          }
          else {
            lexisFirstFileData.DateofBirth = ""
          }
        }
      }
      for (PolicyAddlNamedInsured in policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)) {
        lexisFirstFileData.InsuredName2FirstName = PolicyAddlNamedInsured.FirstName
        lexisFirstFileData.InsuredName2LastName = PolicyAddlNamedInsured.LastName
        if (PolicyAddlNamedInsured.AccountContactRole.AccountContact.ContactType == "person") {
          lexisFirstFileData.InsuredName2Type = "I"
        }
        else {
          lexisFirstFileData.InsuredName2Type = "B"
        }
      }
      lexisFirstFileData.PropertyStreet = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.AddressLine1
      lexisFirstFileData.PropertyCity = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.City
      lexisFirstFileData.PropertyCountry = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.Country
      lexisFirstFileData.PropertyState = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.State
      lexisFirstFileData.PropertyZip = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation.PostalCode.substring(0, 5)
      lexisFirstFileData.LoanNumber = policyPeriod.HomeownersLine_HOE.Dwelling.AdditionalInterests.ContractNumber.first()
      //30
      for (policyAddlInterest in policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlInterest)) {

        lexisFirstFileData.MortgageeName = policyAddlInterest.DisplayName
        lexisFirstFileData.PayableName = policyAddlInterest.DisplayName
        lexisFirstFileData.MortgageeCity = policyAddlInterest.ContactDenorm.PrimaryAddress.City
        lexisFirstFileData.MortgageeCountry = policyAddlInterest.ContactDenorm.PrimaryAddress.Country
        lexisFirstFileData.MortgageeStreet = policyAddlInterest.ContactDenorm.PrimaryAddress.AddressLine1
        lexisFirstFileData.MortgageeState = policyAddlInterest.ContactDenorm.PrimaryAddress.State
        lexisFirstFileData.MortgageeZip = policyAddlInterest.ContactDenorm.PrimaryAddress.PostalCode.substring(0, 5)
        lexisFirstFileData.MortgageeInterestType = "FM"
        //policyAddlInterest.AccountContactRole.AccountContact.ContactType
      }
      //if(policyPeriod.HomeownersLine_HOE.HOPolicyType.Code == "HO3")
      lexisFirstFileData.CoverageTypeCode1 = "COVA"
      lexisFirstFileData.CoverageAmount1 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
      lexisFirstFileData.Deductible1 = ""
      lexisFirstFileData.CoverageTypeCode3 = "COVB"
      lexisFirstFileData.CoverageAmount3 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value
      lexisFirstFileData.Deductible3 = ""
      lexisFirstFileData.CoverageTypeCode2 = "COVC"
      lexisFirstFileData.CoverageAmount2 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value
      lexisFirstFileData.Deductible2 = ""
      lexisFirstFileData.CoverageTypeCode4 = "COVD"
      lexisFirstFileData.CoverageAmount4 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm.Value
      lexisFirstFileData.Deductible4 = ""
      lexisFirstFileData.CoverageTypeCode5 = "COVE"
      lexisFirstFileData.CoverageAmount5 = policyPeriod.HomeownersLine_HOE.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value
      lexisFirstFileData.Deductible5 = ""
      lexisFirstFileData.CoverageTypeCode6 = "COVF"
      lexisFirstFileData.CoverageAmount6 = policyPeriod.HomeownersLine_HOE.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm.Value
      lexisFirstFileData.Deductible6 = ""
      lexisFirstFileData.CoverageTypeCode7 = "HURR"
      lexisFirstFileData.CoverageAmount7 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_HurricaneCov_HOE_Ext.TotalCovLimit
      lexisFirstFileData.Deductible7 = ""
      lexisFirstFileData.CoverageTypeCode8 = "FLOD"
      lexisFirstFileData.CoverageAmount8 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FllodCovPP_HOETerm.Value
      lexisFirstFileData.Deductible8 = policyPeriod.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Ded_HOETerm.Value
      lexisFirstFileData.CoverageTypeCode9 = ""
      lexisFirstFileData.CoverageAmount9 = ""
      lexisFirstFileData.Deductible9 = ""
      lexisFirstFileData.CoverageTypeCode10 = ""
      //4
      lexisFirstFileData.CoverageAmount10 = ""
      //10
      lexisFirstFileData.Deductible10 = ""
      //10
      lexisFirstFileData.LegalDescription = ""
      //50
      lexisFirstFileData.InsuranceCarrier = policyPeriod.UWCompany.DisplayName
      //50
      lexisFirstFileData.InsuranceCarrierNAIC = policyPeriod.UWCompany.Code
      //policyPeriod.UWCompanyCode.DisplayName //5
      lexisFirstFileData.ProducerName = policyPeriod.ProducerCodeOfRecord.Description
      //50
      lexisFirstFileData.ProducerCode = policyPeriod.ProducerCodeOfRecord.Code
      //15
      lexisFirstFileData.ProducerStreet = policyPeriod.ProducerCodeOfRecord.Address.AddressLine1
      lexisFirstFileData.ProducerCity = policyPeriod.ProducerCodeOfRecord.Address.City
      lexisFirstFileData.ProducerState = policyPeriod.ProducerCodeOfRecord.Address.State
      lexisFirstFileData.ProducerCountry = policyPeriod.ProducerCodeOfRecord.Address.Country
      lexisFirstFileData.ProducerZip = policyPeriod.ProducerCodeOfRecord.Address.PostalCode?.substring(0, 5)
      lexisFirstFileData.ProducerPhone = ""
      //15
      lexisFirstFileData.EndorsementState1 = ""
      lexisFirstFileData.Endorsement1 = ""
      lexisFirstFileData.EndorsementState2 = ""
      lexisFirstFileData.Endorsement2 = ""
      lexisFirstFileData.EndorsementState3 = ""
      lexisFirstFileData.Endorsement3 = ""
      lexisFirstFileData.EndorsementState4 = ""
      lexisFirstFileData.Endorsement4 = ""
      lexisFirstFileData.EndorsementState5 = ""
      //2
      lexisFirstFileData.Endorsement5 = ""
      //10
      lexisFirstFileData.TotalPolicyPremium = policyPeriod.TotalPremiumRPT_amt
      lexisFirstFileData.PremiumAmountDue = "2929 USD"
      //8
      lexisFirstFileData.IncreasedPremiumAmountDue = "1929 USD"
      //8
      lexisFirstFileData.MaximumPremiumAmountDue = "4929 USD"
      //8
      lexisFirstFileData.PremiumAmountDueDate = "09292016"
      //8

      //50
      lexisFirstFileData.RemittanceStreet = ""
      //60
      lexisFirstFileData.RemittanceCity = ""
      //30
      lexisFirstFileData.RemittanceState = ""
      //2
      lexisFirstFileData.RemittanceZip = ""
      //5
      lexisFirstFileData.RemittanceCountry = ""
      //3
      lexisFirstFileData.RemittancePhone = ""
      //15
      lexisFirstFileData.FloodZoneRated = ""
      //3
      lexisFirstFileData.FloodZoneCurrent = ""
      //3
      lexisFirstFileData.Grandfathered = "Y"
      //1
      lexisFirstFileData.CommunityName = ""
      //50
      lexisFirstFileData.CommunityNumberORMapNumber = ""
      //15
      lexisFirstFileData.Elevation = ""
      //3
      if(policyPeriod.Notes.DisplayName.first() != null){
      lexisFirstFileData.Notes = policyPeriod.Notes.DisplayName.first()
      } else {
        lexisFirstFileData.Notes = ""
      }
      //policyPeriod.Notes.Subject //190
      lexisFirstFileData.LenderAccountNumber = ""
      //20
      lexisFirstFileData.PolicyInceptionDate = sdf.format(policyPeriod.PolicyStartDate)
      //8
      lexisFirstFileData.PropertyType = "Y"
      //1
      lexisFirstFileData.ContributingAMBestNumber = ""
      //5

      _logger.debug(" Leaving  " + CLASS_NAME + " :: " + "" + "For LexisFirst payload service  ")
    } catch (exp: Exception) {
      _logger.error("Lexis First creating payload Error::::" + exp)
    }
    return lexisFirstFileData
  }
}