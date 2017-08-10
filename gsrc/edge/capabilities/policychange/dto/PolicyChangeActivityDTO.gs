package edge.capabilities.policychange.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Email
uses java.util.Date
uses edge.aspects.validation.annotations.Required

/**
 * Created with IntelliJ IDEA.
 * User: dthao
 * Date: 8/4/17
 * Time: 2:12 PM
 * To change this template use File | Settings | File Templates.
 */
class PolicyChangeActivityDTO {

  @JsonProperty @Required
  var _policyNumber : String as PolicyNumber

  @JsonProperty @Required
  var _policyNumberLabel : String as PolicyNumberLabel

  @JsonProperty
  var _effectiveDateOfChange : Date as EffectiveDateOfChange

  @JsonProperty
  var _effectiveDateOfChangeLabel : String as EffectiveDateOfChangeLabel

  @JsonProperty
  var _submitterName : String as SubmitterName

  @JsonProperty
  var _submitterNameLAbel : String as SubmitterNameLabel

  @JsonProperty @Email
  var _submitterEmail : String as SubmitterEmail

  @JsonProperty
  var _submitterEmailLabel : String as SubmitterEmailLabel

  @JsonProperty
  var _changeRequestType : String as ChangeRequestType

  @JsonProperty
  var _changeRequestTypeLabel : String as ChangeRequestTypeLabel

  @JsonProperty
  var _additionalDescription : String as AdditionalDescription

  @JsonProperty
  var _additionalDescriptionLabel : String as AdditionalDescriptionLabel

  @JsonProperty
  var _mortgageeName : String as MortgageeName

  @JsonProperty
  var _mortgageeNameLabel : String as MortgageeNameLabel

  @JsonProperty
  var _mortgageeName1 : String as MortgageeName1

  @JsonProperty
  var _mortgageeName1Label : String as MortgageeName1Label

  @JsonProperty
  var _mortgageeName2 : String as MortgageeName2

  @JsonProperty
  var _mortgageeName2Label : String as MortgageeName2Label

  @JsonProperty
  var _country : Country as Country

  @JsonProperty
  var _countryLabel : String as CountryLabel

  @JsonProperty
  var _address1 : String as Address1

  @JsonProperty
  var _address1Label : String as Address1Label

  @JsonProperty
  var _address2 : String as Address2

  @JsonProperty
  var _address2Label : String as Address2Label

  @JsonProperty
  var _city : String as City

  @JsonProperty
  var _cityLabel : String as CityLabel

  @JsonProperty
  var _stateProvince : State as StateProvince

  @JsonProperty
  var _stateProvinceLabel : String as StateProvinceLabel

  @JsonProperty
  var _postalCode : String as PostalCode

  @JsonProperty
  var _postalCodeLabel : String as PostalCodeLabel

  @JsonProperty
  var _loanNumber : String as LoanNumber

  @JsonProperty
  var _loanNumberLabel : String as LoanNumberLabel

  @JsonProperty
  var _mortgageType : String as MortgageType

  @JsonProperty
  var _mortgageTypeLabel : String as MortgageTypeLabel

  @JsonProperty
  var _coverage : String as Coverage

  @JsonProperty
  var _coverageLabel : String as CoverageLabel

  @JsonProperty
  var _breed : String as Breed

  @JsonProperty
  var _breedLabel : String as BreedLabel

  @JsonProperty
  var _reason : String as Reason

  @JsonProperty
  var _reasonLabel : String as ReasonLabel

  @JsonProperty
  var _nameOfReplacementCarrier : String as NameOfReplacementCarrier

  @JsonProperty
  var _nameOfReplacementCarrierLabel : String as NameOfReplacementCarrierLabel

  @JsonProperty
  var _occupancyType : String as OccupancyType

  @JsonProperty
  var _occupancyTypeLabel : String as OccupancyTypeLabel
}