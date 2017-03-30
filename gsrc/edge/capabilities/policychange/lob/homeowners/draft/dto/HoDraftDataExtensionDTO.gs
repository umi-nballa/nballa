package edge.capabilities.policychange.lob.homeowners.draft.dto

uses edge.capabilities.policychange.dto.IDraftLobExtensionDTO
uses edge.jsonmapper.JsonProperty
uses edge.capabilities.address.dto.AddressDTO
uses edge.aspects.validation.annotations.Required
uses edge.el.Expr
uses edge.aspects.validation.annotations.Ensure
uses edge.aspects.validation.annotations.Context
uses edge.aspects.validation.Validation
uses edge.capabilities.policychange.lob.homeowners.draft.util.HOPolicyChangeUtilities

/**
 * Homeowners extension for policy change draft.
 */
class HoDraftDataExtensionDTO implements IDraftLobExtensionDTO {

  /* Policy Address */
  @JsonProperty @Required
  var _policyAddress: AddressDTO as PolicyAddress

  /* Covered dwelling */
  @JsonProperty
  var _dwelling : DwellingDTO as Dwelling

  /** Collection of scheduled properties for the dwelling */
  @JsonProperty
  @Context("DuplicatePropertyDescrsPolicyChange",
      Expr.call(HOPolicyChangeUtilities#getDuplicatedPropertyDescrs(), {Validation.VALUE}))
  @Ensure(
      Expr.call(HOPolicyChangeUtilities#isEmpty(), {
          Validation.getContext("DuplicatePropertyDescrsPolicyChange")}),
          Expr.translate("Edge.Web.Api.Quote.HO.DescriptionUnique", {})
  )
  var _scheduledProperties : ScheduledPropertyDTO[] as ScheduledProperties

}
