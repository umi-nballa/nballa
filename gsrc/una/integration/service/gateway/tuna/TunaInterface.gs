package una.integration.service.gateway.tuna

uses una.integration.mapping.tuna.TunaAppResponse

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 5/11/16
 * Time: 1:40 PM
 */
interface TunaInterface {

 public function fetchPropertyInformationComplete(policyPeriod : PolicyPeriod): TunaAppResponse
 public function fetchPropertyInformation(policyPeriod : PolicyPeriod): TunaAppResponse
 public function fetchPropertyInformationScrubOnly(policyPeriod : PolicyPeriod) : TunaAppResponse
 public function fetchPropertyInformationGeoLookUp(policyPeriod : PolicyPeriod) : TunaAppResponse
 public function fetchPropertyInformation360ValueLookUpOnlyExl(policyPeriod : PolicyPeriod): TunaAppResponse
 public function fetchPropertyInformation360ValueLookUpOnlyInc(policyPeriod : PolicyPeriod) : TunaAppResponse

}