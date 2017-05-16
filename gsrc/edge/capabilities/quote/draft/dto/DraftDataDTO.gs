package edge.capabilities.quote.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.capabilities.quote.questionset.dto.QuestionSetAnswersDTO
uses java.util.Date
uses edge.capabilities.quote.lob.dto.DraftLobDataDTO
uses edge.capabilities.address.dto.AddressDTO
uses edge.el.Expr
uses edge.aspects.validation.annotations.Required
uses edge.aspects.validation.annotations.FutureDate
uses edge.aspects.validation.annotations.Context
uses edge.aspects.validation.annotations.Augment
uses edge.aspects.validation.Validation
uses edge.aspects.validation.annotations.NotSet
uses edge.capabilities.policycommon.accountcontact.dto.AccountContactDTO

/**
 * Basic (general) information about the sumbission. Includes
 * account, question sets and lob-specific general data 
 * (for example, drivers and vehicles). This one does
 * not include "quote-related" data like particular coverages.
 */
@Context("policyCountry",Expr.getProperty("Country",Expr.getProperty("PolicyAddress",Context.VALUE)))
class DraftDataDTO {
  /** Account holder personal. */
  @JsonProperty
  @Augment({"DateOfBirth"},
      Expr.all({Expr.eq(Expr.getProperty("ProductCode",Validation.PARENT),Expr.const("PersonalAuto")) ,
      Expr.eq(Validation.getContext("AccountDOBRequired"), true)}),
      {new Required()}
  )

  var _accountHolder : AccountContactDTO as AccountHolder

  /**
   * Address of the policy holder. This one is stored separately from
   * person as other persons (like drivers) do not have their addresses.
   * Policy address may be different from account holder address, however, this support should be added
   * by LOBs and is not present in OOB implementation.
   */
  @JsonProperty
  @Augment({"AddressLine1"}, {new Required()})
  var _policyAddress : AddressDTO as PolicyAddress

  @JsonProperty
  var _productCode : String as ProductCode

  @JsonProperty
  var _accountNumber : String as AccountNumber
  
  @JsonProperty   // ReadOnly
  var _productName : String as ProductName
  
  @JsonProperty @Required @FutureDate
  var _periodStartDate : Date as PeriodStartDate

  @JsonProperty @FutureDate
  var _periodEndDate : Date as PeriodEndDate
  
  @JsonProperty
  var _preQualQuestionSets : QuestionSetAnswersDTO[] as PreQualQuestionSets
  
  /** Line-of-business extensions for the draft object. */
  @JsonProperty
  var _lobs : DraftLobDataDTO as Lobs

  /** The term type of the submission e.g. Annual, HalfYear, Other, etc. */
  @JsonProperty
  var _termType : typekey.TermType as TermType

  @JsonProperty
  var _ratingStyle : String as RatingStyle

  @JsonProperty
  var _quoteType : typekey.QuoteType as QuoteType

  @JsonProperty
  var _policyType : String as PolicyType

  @JsonProperty
  var _generatePaymentPlan : Boolean as GeneratePaymentPlan

  @JsonProperty
  var _premiumOnly : Boolean as PremiumOnly
}
