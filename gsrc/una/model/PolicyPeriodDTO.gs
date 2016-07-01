package una.model

uses una.integration.framework.file.outbound.persistence.OutboundFileData

uses java.math.BigDecimal
uses java.util.Date

/**
 * This class is DTO for IVANS policy period flat file
 */
class PolicyPeriodDTO extends OutboundFileData   {
  var recordID: String as RecordID
  var policyNumber: String as PolicyNumber
  var agencyNumber: String as AgencyNumber
  var writingCompanyCode: String as WritingCompanyCode
  var lineOfBusinessCode: String as LineOfBusinessCode
  var lineOfBusinessSubCode: String as LineOfBusinessSubCode
  var policyEffectiveDate: Date as PolicyEffectiveDate
  var policyExpirationDate: Date as PolicyExpirationDate
  var originalPolicyInceptionDate: Date as OriginalPolicyInceptionDate
  var policyTerm: int as PolicyTerm
  var fullTermAnnualPremium: BigDecimal as FullTermAnnualPremium
  var netChangePremium: BigDecimal as NetChangePremium
  var companyProductCode: String as CompanyProductCode
  var transactionTypeCode: String as TransactionTypeCode
  var cancelOrChangeReasonCode: String as CancelOrChangeReasonCode
  var cancellationMethod: String as CancellationMethod
  var transactionEffectiveDate: Date as TransactionEffectiveDate
  var agentSystemID: String as AgentSystemID
  var producerSubCode: String as ProducerSubCode
  var reservedForFutureUse: String as ReservedForFutureUse
}

