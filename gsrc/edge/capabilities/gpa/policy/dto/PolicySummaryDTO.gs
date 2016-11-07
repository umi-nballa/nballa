package edge.capabilities.gpa.policy.dto

uses edge.jsonmapper.JsonProperty
uses java.util.Date
uses edge.capabilities.currency.dto.AmountDTO

class PolicySummaryDTO {

  @JsonProperty
  var _policyLines : PolicyLineDTO[] as PolicyLines

  @JsonProperty
  var _policyId : String as PolicyId

  @JsonProperty
  var _policyNumber : String as PolicyNumber

  @JsonProperty
  var _primaryInsuredName : String as PrimaryInsuredName

  @JsonProperty
  var _effective : Date   as Effective

  @JsonProperty
  var _expiration : Date as Expiration

  @JsonProperty
  var _premium : AmountDTO as Premium

  @JsonProperty
  var _displayStatus : String as DisplayStatus

  @JsonProperty
  var _isCancelled : Boolean as isCancelled

  @JsonProperty
  var _isIssued : Boolean as isIssued

  @JsonProperty
  var _canUserView : Boolean as CanUserView

  @JsonProperty
  var _producerCodeOfRecord: String as ProducerCodeOfRecord

  @JsonProperty
  var _producerCodeOfService: String as ProducerCodeOfService

  @JsonProperty
  var _createdByMe : Boolean as CreatedByMe

  @JsonProperty
  var _delinquent : Boolean as Delinquent

  @JsonProperty
  var _accountNumber : String as AccountNumber

  @JsonProperty
  var _accountHolderName : String as AccountHolderName
}
