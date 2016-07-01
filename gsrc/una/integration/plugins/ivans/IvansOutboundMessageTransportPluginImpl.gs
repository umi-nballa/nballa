package una.integration.plugins.ivans

uses una.integration.framework.file.outbound.plugin.OutboundFileDataTransport
uses una.logging.UnaLoggerCategory
uses una.integration.framework.file.outbound.persistence.OutboundFileData
uses una.model.PolicyPeriodDTO
uses una.integration.mapping.FileIntegrationMapping
uses una.integration.framework.file.IFileDataMapping

/**
 * IvansOutboundMessageTransportPluginImpl is Plugin Implementation class ,it create DTO object from input payload
 * User:JGupta
 */
class IvansOutboundMessageTransportPluginImpl extends OutboundFileDataTransport {
  final static  var _logger = UnaLoggerCategory.INTEGRATION
  public final static var DEST_ID: int = 8
  override function createOutboundFileData(payload: String): OutboundFileData {
    _logger.info("Entering into createIvansOutbound")
    var model = una.integration.gxmodel.policyperioddtomodel.PolicyPeriodDTO.parse(payload)
    var policyPeriodDTO = new PolicyPeriodDTO()
    policyPeriodDTO.RecordID = model.RecordID
    policyPeriodDTO.PolicyNumber = model.PolicyNumber
    policyPeriodDTO.AgencyNumber = model.AgencyNumber
    policyPeriodDTO.LineOfBusinessCode = model.LineOfBusinessCode
    policyPeriodDTO.LineOfBusinessSubCode = model.LineOfBusinessSubCode
    policyPeriodDTO.PolicyEffectiveDate = model.PolicyEffectiveDate
    policyPeriodDTO.PolicyExpirationDate = model.PolicyExpirationDate
    policyPeriodDTO.OriginalPolicyInceptionDate = model.OriginalPolicyInceptionDate
    policyPeriodDTO.PolicyTerm = model.PolicyTerm
    policyPeriodDTO.FullTermAnnualPremium = model.FullTermAnnualPremium
    policyPeriodDTO.NetChangePremium = model.NetChangePremium
    policyPeriodDTO.CompanyProductCode = model.CompanyProductCode
    policyPeriodDTO.TransactionTypeCode = model.TransactionTypeCode
    policyPeriodDTO.CancelOrChangeReasonCode = model.CancelOrChangeReasonCode
    policyPeriodDTO.CancellationMethod = model.CancellationMethod
    policyPeriodDTO.TransactionEffectiveDate = model.TransactionEffectiveDate
    policyPeriodDTO.AgentSystemID = model.AgentSystemID
    policyPeriodDTO.ProducerSubCode = model.ProducerSubCode
    policyPeriodDTO.ReservedForFutureUse = model.ReservedForFutureUse
    _logger.info("Existing from createIvansOutbound")
    return policyPeriodDTO
  }

  override property get FileDataMapping(): IFileDataMapping {
    return FileIntegrationMapping.IVANSPolicyPeriodOutbound
  }
}