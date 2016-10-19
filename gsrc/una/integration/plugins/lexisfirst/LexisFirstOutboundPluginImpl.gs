package una.integration.plugins.lexisfirst

uses una.integration.framework.file.IFileDataMapping
uses una.integration.framework.file.outbound.persistence.OutboundFileData
uses una.integration.framework.file.outbound.plugin.OutboundFileDataTransport
uses una.integration.mapping.FileIntegrationMapping
uses una.logging.UnaLoggerCategory
uses una.model.LexisFirstFileData

uses java.lang.Exception

/**
 * Created for LexisFirst MessageTransport OutBound Integration
 * Created By: pavan theegala
 * Created Date: 7/4/16
 */
class LexisFirstOutboundPluginImpl extends OutboundFileDataTransport {
  final static  var _logger = UnaLoggerCategory.INTEGRATION
  private static final var CLASS_NAME = LexisFirstOutboundPluginImpl.Type.DisplayName
  public final static var DEST_ID: int = 9
  var lexisFirstFileData: LexisFirstFileData

  /**
   * This function takes care of sending payload into the integration database.
   */
  override function createOutboundFileData(payload: String): OutboundFileData {
    try {
      _logger.debug(" Entering  " + CLASS_NAME + " :: " + "OutBoundFileData" + "For LexisFirst ")
      _logger.info("Lexis First payload XML ::" + payload)
      var model = una.gxmodels.lexisfirstfiledatamodel.LexisFirstFileData.parse(payload)
      lexisFirstFileData = new LexisFirstFileData()
      lexisFirstFileData.RecordTypeIndicator = model.RecordTypeIndicator
      lexisFirstFileData.CustomerTransactionID = model.CustomerTransactionID
      lexisFirstFileData.TransactionCreationDate = model.TransactionCreationDate
      lexisFirstFileData.ActionEffectiveDate = model.ActionEffectiveDate
      lexisFirstFileData.PolicyEffectiveFromDate = model.PolicyEffectiveFromDate
      lexisFirstFileData.PolicyExpirationDate = model.PolicyExpirationDate
      lexisFirstFileData.PolicyNumber = model.PolicyNumber
      lexisFirstFileData.CommercialPolicy = model.CommercialPolicy
      lexisFirstFileData.ActionCode = model.ActionCode
      lexisFirstFileData.PolicyTypeCode = model.PolicyTypeCode
      lexisFirstFileData.InsuredName1Type = model.InsuredName1Type
      lexisFirstFileData.InsuredName1LastName = model.InsuredName1LastName
      lexisFirstFileData.InsuredName1FirstName = model.InsuredName1FirstName
      lexisFirstFileData.InsuredName2Type = model.InsuredName2Type
      lexisFirstFileData.InsuredName2LastName = model.InsuredName2LastName
      lexisFirstFileData.InsuredName2FirstName = model.InsuredName2FirstName
      lexisFirstFileData.InsuredState = model.InsuredState
      lexisFirstFileData.InsuredStreet = model.InsuredStreet
      lexisFirstFileData.InsuredZip = model.InsuredZip
      lexisFirstFileData.InsuredCity = model.InsuredCity
      lexisFirstFileData.InsuredCountry = model.InsuredCountry
      lexisFirstFileData.PropertyStreet = model.PropertyStreet
      lexisFirstFileData.PropertyCity = model.PropertyCity
      lexisFirstFileData.PropertyCountry = model.PropertyCountry
      lexisFirstFileData.PropertyState = model.PropertyState
      lexisFirstFileData.PropertyZip = model.PropertyZip
      lexisFirstFileData.LoanNumber = model.LoanNumber
      lexisFirstFileData.MortgageeName = model.MortgageeName
      lexisFirstFileData.MortgageeCity = model.MortgageeCity
      lexisFirstFileData.MortgageeCountry = model.MortgageeCountry
      lexisFirstFileData.MortgageeStreet = model.MortgageeStreet
      lexisFirstFileData.MortgageeState = model.MortgageeState
      lexisFirstFileData.MortgageeZip = model.MortgageeZip
      lexisFirstFileData.MortgageeInterestType = model.MortgageeInterestType
      lexisFirstFileData.CoverageTypeCode1 = model.CoverageTypeCode1
      lexisFirstFileData.CoverageAmount1 = model.CoverageAmount1
      lexisFirstFileData.Deductible1 = model.Deductible1
      lexisFirstFileData.CoverageTypeCode3 = model.CoverageTypeCode3
      lexisFirstFileData.CoverageAmount3 = model.CoverageAmount3
      lexisFirstFileData.Deductible3 = model.Deductible3
      lexisFirstFileData.CoverageTypeCode2 = model.CoverageTypeCode2
      lexisFirstFileData.CoverageAmount2 = model.CoverageAmount2
      lexisFirstFileData.Deductible2 = model.Deductible2
      lexisFirstFileData.CoverageTypeCode4 = model.CoverageTypeCode4
      lexisFirstFileData.CoverageAmount4 = model.CoverageAmount4
      lexisFirstFileData.Deductible4 = model.Deductible4
      lexisFirstFileData.CoverageTypeCode5 = model.CoverageTypeCode5
      lexisFirstFileData.CoverageAmount5 = model.CoverageAmount5
      lexisFirstFileData.Deductible5 = model.Deductible5
      lexisFirstFileData.CoverageTypeCode6 = model.CoverageTypeCode6
      lexisFirstFileData.CoverageAmount6 = model.CoverageAmount6
      lexisFirstFileData.Deductible6 = model.Deductible6
      lexisFirstFileData.CoverageTypeCode7 = model.CoverageTypeCode7
      lexisFirstFileData.CoverageAmount7 = model.CoverageAmount7
      lexisFirstFileData.Deductible7 = model.Deductible7
      lexisFirstFileData.CoverageTypeCode8 = model.CoverageTypeCode8
      lexisFirstFileData.CoverageAmount8 = model.CoverageAmount8
      lexisFirstFileData.Deductible8 = model.Deductible8
      lexisFirstFileData.CoverageTypeCode9 = model.CoverageTypeCode9
      lexisFirstFileData.CoverageAmount9 = model.CoverageAmount9
      lexisFirstFileData.Deductible9 = model.Deductible9
      lexisFirstFileData.CoverageTypeCode10 = model.CoverageTypeCode10
      lexisFirstFileData.CoverageAmount10 = model.CoverageAmount10
      lexisFirstFileData.Deductible10 = model.Deductible10
      lexisFirstFileData.LegalDescription = model.LegalDescription
      lexisFirstFileData.InsuranceCarrier = model.InsuranceCarrier
      lexisFirstFileData.InsuranceCarrierNAIC = model.InsuranceCarrierNAIC
      lexisFirstFileData.ProducerName = model.ProducerName
      lexisFirstFileData.ProducerCode = model.ProducerCode
      lexisFirstFileData.ProducerStreet = model.ProducerStreet
      lexisFirstFileData.ProducerCity = model.ProducerCity
      lexisFirstFileData.ProducerState = model.ProducerState
      lexisFirstFileData.ProducerCountry = model.ProducerCountry
      lexisFirstFileData.ProducerZip = model.ProducerZip
      lexisFirstFileData.ProducerPhone = model.ProducerPhone
      lexisFirstFileData.EndorsementState1 = model.EndorsementState1
      lexisFirstFileData.Endorsement1 = model.Endorsement1
      lexisFirstFileData.EndorsementState2 = model.EndorsementState2
      lexisFirstFileData.Endorsement2 = model.Endorsement2
      lexisFirstFileData.EndorsementState3 = model.EndorsementState3
      lexisFirstFileData.Endorsement3 = model.Endorsement3
      lexisFirstFileData.EndorsementState4 = model.EndorsementState4
      lexisFirstFileData.Endorsement4 = model.Endorsement4
      lexisFirstFileData.EndorsementState5 = model.EndorsementState5
      lexisFirstFileData.Endorsement5 = model.Endorsement5
      lexisFirstFileData.TotalPolicyPremium = model.TotalPolicyPremium
      lexisFirstFileData.PremiumAmountDue = model.PremiumAmountDue
      lexisFirstFileData.IncreasedPremiumAmountDue = model.IncreasedPremiumAmountDue
      lexisFirstFileData.MaximumPremiumAmountDue = model.MaximumPremiumAmountDue
      lexisFirstFileData.PremiumAmountDueDate = model.PremiumAmountDueDate
      lexisFirstFileData.PayableName = model.PayableName
      lexisFirstFileData.RemittanceStreet = model.RemittanceStreet
      lexisFirstFileData.RemittanceCity = model.RemittanceCity
      lexisFirstFileData.RemittanceState = model.RemittanceState
      lexisFirstFileData.RemittanceZip = model.RemittanceZip
      lexisFirstFileData.RemittanceCountry = model.RemittanceCountry
      lexisFirstFileData.RemittancePhone = model.RemittancePhone
      lexisFirstFileData.FloodZoneRated = model.FloodZoneRated
      lexisFirstFileData.FloodZoneCurrent = model.FloodZoneCurrent
      lexisFirstFileData.Grandfathered = model.Grandfathered
      lexisFirstFileData.CommunityName = model.CommunityName
      lexisFirstFileData.CommunityNumberORMapNumber = model.CommunityNumberORMapNumber
      lexisFirstFileData.Elevation = model.Elevation
      lexisFirstFileData.Notes = model.Notes
      lexisFirstFileData.LenderAccountNumber = model.LenderAccountNumber
      lexisFirstFileData.PolicyInceptionDate = model.PolicyInceptionDate
      lexisFirstFileData.DateofBirth = model.DateofBirth
      lexisFirstFileData.PropertyType = model.PropertyType
      lexisFirstFileData.ContributingAMBestNumber = model.ContributingAMBestNumber

      _logger.debug(" Leaving  " + CLASS_NAME + " :: " + "OutBoundFileData" + "For LexisFirst ")

    } catch (exp: Exception) {
      _logger.error("Lexis First Mapping Error::::"+exp)
    }
     return lexisFirstFileData
  }

  /**
   * This function takes care of mapping to FlatFile Framework.
   */
  override property get FileDataMapping(): IFileDataMapping {
    return FileIntegrationMapping.LexisFirstOutbound
  }
}