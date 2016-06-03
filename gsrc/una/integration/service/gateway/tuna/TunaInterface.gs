package una.integration.service.gateway.tuna

uses una.integration.mapping.tuna.TunaAppResponse
uses gw.api.address.AddressFillable
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel
uses una.model.AddressDTO

/**
 * Created with IntelliJ IDEA.
 * User: Prathyush
 * Date: 5/11/16
 * Time: 1:40 PM
 */
interface TunaInterface {

  /**
  *  the method is for when user clicks on new submission in GW
  * @param address is of type AddressDTO
  *
  * */
  public function fetchPropertyInformationComplete(address: AddressDTO): PropertyGeographyModel

  /* TBD - Yet to be Implemented*/
  public function fetchPropertyInformation(policyPeriod: PolicyPeriod): TunaAppResponse

  /**
  * The purpose of the method is to validate Address in GW
  * @param address is Address Entity in GW
  *
  * */
  public function fetchPropertyInformationScrubOnly(address: AddressFillable): PropertyGeographyModel

  /* TBD - Yet to be Implemented */
  public function fetchPropertyInformationGeoLookUp(policyPeriod: PolicyPeriod): TunaAppResponse

  /* TBD - Yet to be Implemented */
  public function fetchPropertyInformation360ValueLookUpOnlyExl(policyPeriod: PolicyPeriod): TunaAppResponse

  /* TBD - Yet to be Implemented */
  public function fetchPropertyInformation360ValueLookUpOnlyInc(policyPeriod: PolicyPeriod): TunaAppResponse
}