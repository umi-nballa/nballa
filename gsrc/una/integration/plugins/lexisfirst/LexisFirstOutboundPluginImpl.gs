package una.integration.plugins.lexisfirst

uses una.integration.framework.file.IFileDataMapping
uses una.integration.framework.file.outbound.persistence.OutboundFileData
uses una.integration.framework.file.outbound.plugin.OutboundFileDataTransport
uses una.integration.mapping.FileIntegrationMapping
uses una.logging.UnaLoggerCategory
uses una.model.LexisFirstFileData

/**
 * Created for LexisFirst MessageTransport OutBound Integration
 * Created By: pavan theegala
 * Created Date: 7/4/16
 */
class LexisFirstOutboundPluginImpl extends OutboundFileDataTransport {
  final static  var _logger = UnaLoggerCategory.INTEGRATION
  private static final var CLASS_NAME = LexisFirstOutboundPluginImpl.Type.DisplayName
  public final static var DEST_ID: int = 9

  /**
   * This function takes care of sending payload into the integration database.
   */
  override function createOutboundFileData(payload: String): OutboundFileData {
    _logger.debug(" Entering  " + CLASS_NAME + " :: " + "OutBoundFileData" + "For LexisFirst ")
    _logger.info("payload............." + payload)
    var model = una.gxmodels.lexisfirstfiledatamodel.LexisFirstFileData.parse(payload)
    var lexisFirstFileData = new LexisFirstFileData()
    lexisFirstFileData.RecordTypeIndicator = model.RecordTypeIndicator
    lexisFirstFileData.ActionEffectiveDate = model.ActionEffectiveDate
    lexisFirstFileData.PolicyEffectiveFromDate = model.PolicyEffectiveFromDate
    lexisFirstFileData.PolicyExpirationDate = model.PolicyExpirationDate
    lexisFirstFileData.PolicyNumber = model.PolicyNumber
    lexisFirstFileData.TransactionCreationDate = model.TransactionCreationDate
    lexisFirstFileData.InsuranceCarrier = model.InsuranceCarrier
    lexisFirstFileData.InsuranceCarrierNAIC = model.InsuranceCarrierNAIC
    lexisFirstFileData.ProducerName = model.ProducerName
    lexisFirstFileData.ProducerCode = model.ProducerCode
    lexisFirstFileData.ProducerStreet = model.ProducerStreet
    lexisFirstFileData.ProducerCity = model.ProducerCity
    lexisFirstFileData.ProducerState = model.ProducerState
    lexisFirstFileData.ProducerCountry = model.ProducerCountry
    lexisFirstFileData.ProducerZip = model.ProducerZip
    lexisFirstFileData.InsuredCity = model.InsuredCity
    lexisFirstFileData.InsuredCountry = model.InsuredCountry
    lexisFirstFileData.InsuredName1FirstName = model.InsuredName1FirstName
    lexisFirstFileData.InsuredName1Type = model.InsuredName1Type
    lexisFirstFileData.InsuredState = model.InsuredState
    lexisFirstFileData.InsuredStreet = model.InsuredStreet
    lexisFirstFileData.InsuredZip = model.InsuredZip
    lexisFirstFileData.Mortgagee = model.Mortgagee
    lexisFirstFileData.MortgageeCity = model.MortgageeCity
    lexisFirstFileData.MortgageeCountry = model.MortgageeCountry
    lexisFirstFileData.MortgageeStreet = model.MortgageeStreet
    lexisFirstFileData.MortgageeState = model.MortgageeState
    lexisFirstFileData.MortgageeZip = model.MortgageeZip
    lexisFirstFileData.MortgageeInterestType = model.MortgageeInterestType
    lexisFirstFileData.PropertyStreet = model.PropertyStreet
    lexisFirstFileData.PropertyCity = model.PropertyCity
    lexisFirstFileData.PropertyCountry = model.PropertyCountry
    lexisFirstFileData.PropertyState = model.PropertyState
    lexisFirstFileData.PropertyZip = model.PropertyZip
    /*lexisFirstFileData.CommercialPolicy = model.CommercialPolicy
    lexisFirstFileData.InsuranceCarrier = model.InsuranceCarrier
    lexisFirstFileData.InsuredCity = model.InsuredCity
    lexisFirstFileData.InsuredCountry = model.InsuredCountry
    lexisFirstFileData.InsuredName1FirstName = model.InsuredName1FirstName
    lexisFirstFileData.InsuredName1LastName = model.InsuredName1LastName
    lexisFirstFileData.InsuredName1Type = model.InsuredName1Type
    lexisFirstFileData.InsuredName2FirstName = model.InsuredName2FirstName
    lexisFirstFileData.InsuredName2LastName = model.InsuredName2LastName
    lexisFirstFileData.InsuredName2Type = model.InsuredName2Type
    lexisFirstFileData.InsuredState = model.InsuredState
    lexisFirstFileData.InsuredStreet = model.InsuredStreet
    lexisFirstFileData.InsuredZip = model.InsuredZip
    lexisFirstFileData.PolicyEffectiveFromDate = model.PolicyEffectiveFromDate
    lexisFirstFileData.PolicyExpirationDate = model.PolicyExpirationDate
    lexisFirstFileData.PolicyInceptionDate = model.PolicyInceptionDate
    lexisFirstFileData.PolicyTypeCode = model.PolicyTypeCode
    lexisFirstFileData.ProducerCity = model.ProducerCity
    lexisFirstFileData.ProducerCode = model.ProducerCode
    lexisFirstFileData.ProducerCountry = model.ProducerCountry
    lexisFirstFileData.ProducerName = model.ProducerName
    lexisFirstFileData.ProducerPhone = model.ProducerPhone
    lexisFirstFileData.ProducerState = model.ProducerState
    lexisFirstFileData.ProducerStreet = model.ProducerStreet
    lexisFirstFileData.ProducerZip = model.ProducerZip
    lexisFirstFileData.PropertyCity = model.PropertyCity
    lexisFirstFileData.TotalPolicyPremium = model.TotalPolicyPremium
    lexisFirstFileData.TransactionCreationDate = model.TransactionCreationDate*/
    _logger.debug(" Leaving  " + CLASS_NAME + " :: " + "OutBoundFileData" + "For LexisFirst ")
    return lexisFirstFileData
  }

  /**
   * This function takes care of mapping to FlatFile Framework.
   */
  override property get FileDataMapping(): IFileDataMapping {
    return FileIntegrationMapping.LexisFirstOutbound
  }
}