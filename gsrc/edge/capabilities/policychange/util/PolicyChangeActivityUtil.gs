package edge.capabilities.policychange.util

uses edge.capabilities.policychange.dto.PolicyChangeActivityDTO
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: dthao
 * Date: 8/4/17
 * Time: 3:42 PM
 * To change this template use File | Settings | File Templates.
 */
class PolicyChangeActivityUtil {
  //Disables static class from being constructed
  private construct(){}

  public static function constructActivityDescription(policyChangeActivityDTO : PolicyChangeActivityDTO) : String{
    var description =
    shouldIncludeInDescription(policyChangeActivityDTO.PolicyNumber,policyChangeActivityDTO.PolicyNumberLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.EffectiveDateOfChange,policyChangeActivityDTO.EffectiveDateOfChangeLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.SubmitterName,policyChangeActivityDTO.SubmitterNameLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.SubmitterEmail,policyChangeActivityDTO.SubmitterEmailLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.ChangeRequestType,policyChangeActivityDTO.ChangeRequestTypeLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.MortgageeName,policyChangeActivityDTO.MortgageeNameLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.MortgageeName1,policyChangeActivityDTO.MortgageeName1Label) +
    shouldIncludeInDescription(policyChangeActivityDTO.MortgageeName2,policyChangeActivityDTO.MortgageeName2Label) +
    shouldIncludeInDescription(policyChangeActivityDTO.Country,policyChangeActivityDTO.CountryLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.Address1,policyChangeActivityDTO.Address1Label) +
    shouldIncludeInDescription(policyChangeActivityDTO.Address2,policyChangeActivityDTO.Address2Label) +
    shouldIncludeInDescription(policyChangeActivityDTO.City,policyChangeActivityDTO.CityLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.StateProvince,policyChangeActivityDTO.StateProvinceLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.PostalCode,policyChangeActivityDTO.PostalCodeLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.LoanNumber,policyChangeActivityDTO.LoanNumberLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.MortgageType,policyChangeActivityDTO.MortgageTypeLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.Coverage,policyChangeActivityDTO.CoverageLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.Breed,policyChangeActivityDTO.BreedLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.Reason,policyChangeActivityDTO.ReasonLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.NameOfReplacementCarrier,policyChangeActivityDTO.NameOfReplacementCarrierLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.OccupancyType,policyChangeActivityDTO.OccupancyTypeLabel) +
    shouldIncludeInDescription(policyChangeActivityDTO.AdditionalDescription,policyChangeActivityDTO.AdditionalDescriptionLabel)
    return description
  }

  private static function shouldIncludeInDescription(value : String, label : String) : String{
    return (value.Empty || value == null) ? "" : label+":"+value + "\n"
  }

  private static function shouldIncludeInDescription(value : Date, label : String) : String{
    return value == null ? "" : label+":"+value.ShortFormat + "\n"
  }

  private static function shouldIncludeInDescription(value : Country, label : String) : String{
    return value == null ? "" : label+":"+value.DisplayName + "\n"
  }

  private static function shouldIncludeInDescription(value : State, label : String) : String{
    return value == null ? "" : label+":"+value.DisplayName + "\n"
  }

}