package edge.capabilities.policychange.lob.homeowners.draft.dto

uses edge.aspects.validation.annotations.Required
uses edge.aspects.validation.annotations.Ensure
uses edge.aspects.validation.Validation
uses edge.capabilities.policychange.lob.homeowners.draft.util.HOPolicyChangeUtilities
uses edge.el.Expr
uses edge.jsonmapper.JsonProperty
uses java.lang.Long

class ScheduledPropertyDTO {

  /** Unique fixed ID representing this scheduled property */
  @JsonProperty
  var _id : Long as FixedId

  /** The type of the scheduled property */
  @JsonProperty @Required
  var _type : ScheduleType_HOE as Type

  /** Description of the scheduled property */
  @JsonProperty @Required
  @Ensure(
      Expr.call(HOPolicyChangeUtilities#notIn(), {
        Validation.VALUE,
        Validation.getContext("DuplicatePropertyDescrsPolicyChange")}),
      Expr.translate("Edge.Web.Api.Quote.HO.DescriptionUnique", {})
  )
  var _description : String as Description

  /** Value of the scheduled property */
  @JsonProperty @Required
  var _exposureValue : int as ExposureValue
}
