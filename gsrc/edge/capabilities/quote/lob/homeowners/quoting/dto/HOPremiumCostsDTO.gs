package edge.capabilities.quote.lob.homeowners.quoting.dto

uses edge.capabilities.quote.lob.dto.IQuoteLobExtensionDTO
uses edge.jsonmapper.JsonProperty
uses edge.capabilities.quote.coverage.dto.CoverageDTO
uses edge.capabilities.currency.dto.AmountDTO
uses edge.aspects.validation.annotations.Context
uses edge.el.Expr
uses edge.capabilities.quote.lob.homeowners.quoting.internal.HOQuoteUtilities
uses edge.aspects.validation.Validation
uses edge.aspects.validation.annotations.Ensure
uses edge.capabilities.policychange.lob.homeowners.draft.dto.DwellingAdditionalInterestDTO
uses edge.capabilities.policy.coverages.UNACoverageDTO
uses java.math.BigDecimal

class HOPremiumCostsDTO implements IQuoteLobExtensionDTO {
  @JsonProperty
  var _basePremium : AmountDTO as BasePremium

  @JsonProperty
  var _baseCovs : UNACoverageDTO[] as BaseCoverages

  @JsonProperty
  var _additionalCovs : UNACoverageDTO[] as AdditionalCoverages

  @JsonProperty
  var discountsAndSurcharges : List< AdditionalChargeDTO > as DiscountsAndSurcharges

  @JsonProperty
  var fees : List<AdditionalChargeDTO> as Fees

  @JsonProperty
  @Context("DuplicatePropertyDescrs",
    Expr.call(HOQuoteUtilities#getDuplicatedPropertyDescrs(), {Validation.VALUE}))
  @Ensure(
    Expr.call(HOQuoteUtilities#isEmpty(), {
        Validation.getContext("DuplicatePropertyDescrs")}),
    Expr.translate("Edge.Web.Api.Quote.HO.DescriptionUnique", {})
  )
  var _scheduledProperties : ScheduledPropertyDTO[] as ScheduledProperties

  @JsonProperty
  var _additionalInterest : DwellingAdditionalInterestDTO as AdditionalInterest

  @JsonProperty
  var _floodPremium : BigDecimal as FloodPremium
}
