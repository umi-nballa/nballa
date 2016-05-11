package una.integration.service.gateway.tuna

uses una.integration.mapping.tuna.TunaAppResponse

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 5/11/16
 * Time: 1:40 PM
 */
interface TunaInterface {

 public function getPropertyInformationComplete(policyPeriod : PolicyPeriod): TunaAppResponse
 public function getPropertyInformation(policyPeriod : PolicyPeriod): TunaAppResponse
 public function getPropertyInformationScrubOnly(policyPeriod : PolicyPeriod) : TunaAppResponse
 public function getPropertyInformationGeoLookUp(policyPeriod : PolicyPeriod) : TunaAppResponse
 public function getPropertyInformation360ValueLookUpOnlyExl(policyPeriod : PolicyPeriod): TunaAppResponse
 public function getPropertyInformation360ValueLookUpOnlyInc(policyPeriod : PolicyPeriod) : TunaAppResponse

}