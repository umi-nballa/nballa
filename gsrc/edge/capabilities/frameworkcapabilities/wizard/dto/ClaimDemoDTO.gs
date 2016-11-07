package edge.capabilities.frameworkcapabilities.wizard.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.*
uses edge.el.Expr
uses edge.aspects.validation.Validation

class ClaimDemoDTO {

  @JsonProperty
  @Size(0, 50)
  var _publicId : String as PublicID

  @JsonProperty
  @Required(Expr.neq(Expr.getProperty("PublicID", Validation.PARENT), null))
  @Size(0, 40)
  @Pattern("(CP-[0-9]{4})?([0-9]{3}-[0-9]{2}-[0-9]{6})?")
  var _claimNumber : String as ClaimNumber

  @JsonProperty
  @Required
  @Pattern("PersonalAuto$|Homeowners$")
  var _policyType : String as PolicyType

  @JsonProperty
  @Required
  var _step1PropA : String as Step1PropA

  @JsonProperty
  var _step1PropB : String as Step1PropB

  @JsonProperty
  var _step2PropA : String as Step2PropA

  @JsonProperty
  var _step2PropB : String as Step2PropB

  @JsonProperty
  var _step3PropA : String as Step3PropA

  @JsonProperty
  var _step3PropB : String as Step3PropB

  @JsonProperty
  var _lobs : ClaimDemoLobDTO as Lobs


}
