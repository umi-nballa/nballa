package edge.capabilities.policychange.dto

uses edge.jsonmapper.JsonProperty
uses edge.capabilities.address.dto.AddressDTO
uses java.util.Date
uses edge.capabilities.currency.dto.AmountDTO
uses edge.capabilities.quote.lob.dto.QuoteLobDataDTO
uses edge.aspects.validation.annotations.Context
uses edge.el.Expr
uses edge.aspects.validation.annotations.Required
uses edge.aspects.validation.annotations.DateRange
uses edge.aspects.validation.Validation
uses edge.aspects.validation.annotations.Augment

@Context("policyCountry",Expr.getProperty("Country",Expr.getProperty("PolicyAddress",Context.VALUE)))
class PolicyChangeDTO {

  /** The id for the PolicyChange job in PC, it is null when there is no PolicyChange for the policy identified by PolicyNumber. */
  @JsonProperty
  var _jobId : String as JobID

  /** The number of the policy this policy change refers to. */
  @JsonProperty
  var _policyNumber : String as PolicyNumber

  /** The number of the account this policy change refers to. */
  @JsonProperty
  var _accountNumber : String as AccountNumber

  /** The name of the account this policy change refers to. */
  @JsonProperty
  var _accountName : String as AccountName

  /** The type of product of this policy change. */
  @JsonProperty
  var _productCode : String as ProductCode

  /** The total permium for the policy this change refers to. */
  @JsonProperty
  var _previousTotalCost : AmountDTO as PreviousTotalCost

  /** The total premium for the changed policy. It will be null for non-quoted policy changes. */
  @JsonProperty
  var _totalCost : AmountDTO as TotalCost

  /** The difference between TotalCost and PreviousTotalCost */
  @JsonProperty
  var _transactionCost : AmountDTO as TransactionCost

   /** The status of the selected policy period in this policy change. */
  @JsonProperty
  var _status : PolicyPeriodStatus as Status

   /** The effective date of the policy change. */
  @JsonProperty @DateRange(Expr.getProperty("MinimumEffectiveDate",Validation.PARENT),
                           Expr.getProperty("PeriodEnd",Validation.PARENT))
  @Required
  var _effectiveDate : Date as EffectiveDate

  /** Computed as the earliest date at which the policy change is allowed to start. */
  @JsonProperty
  var _minimumEffectiveDate : Date as MinimumEffectiveDate

  /** When the policy period is due to expire. */
  @JsonProperty @Required
  var _periodEnd : Date as PeriodEnd

  /** When the policy period is due to start. */
  @JsonProperty @Required
  var _periodStart : Date as PeriodStart

  /** The home address of the policy. */
  @JsonProperty
  @Augment({"AddressLine1"}, {new Required()})
  var _address : AddressDTO as PolicyAddress

  /** Unused : Indicates whether or not the policy change was submitted by an agent. */
  @JsonProperty
  var _isSubmitAgent : boolean as IsSubmitAgent

  /** Container for Line of Business specific policy data. For 'PersonalAuto' policies, it contains driver/vehicle information.
   * @see edge.capabilities.policychange.lob.personalauto.draft.dto.PaDraftDataExtensionDTO */
  @JsonProperty
  var _lobs : DraftLobDataDTO as Lobs

  /** Container for Line of Business specific quoting information. For 'PersonalAuto' policies, it contains line and vehicle coverage information.
  * @see edge.capabilities.policychange.lob.personalauto.draft.dto.PaDraftLobDataDTOEnhancement*/
  @JsonProperty
  var _coverageLobs : QuoteLobDataDTO as CoverageLobs

  /**  Changes between this policy change and the policy it is based on. */
  @JsonProperty
  var _history : PolicyChangeHistoryDTO[] as History

}
