package edge.capabilities.quote.lob.homeowners.quoting.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required
uses edge.aspects.validation.annotations.Ensure
uses edge.el.Expr
uses edge.capabilities.quote.lob.homeowners.quoting.internal.HOQuoteUtilities
uses edge.aspects.validation.Validation

class ScheduledPropertyDTO {
  @JsonProperty
  var _id : String as FixedId

  @JsonProperty @Required
  var _type : ScheduleType_HOE as Type

  @JsonProperty @Required
  @Ensure(
      Expr.call(HOQuoteUtilities#notIn(), {
        Validation.VALUE,
        Validation.getContext("DuplicatePropertyDescrs")}),
      Expr.translate("Edge.Web.Api.Quote.HO.DescriptionUnique", {})
  )
  var _description : String as Description

  @JsonProperty @Required
  var _exposureValue : int as ExposureValue
}
