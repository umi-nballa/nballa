package una.integration.mapping.hpx.homeowners

uses una.integration.mapping.hpx.common.HPXPolicyConditionMapper


/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 10/24/16
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwelllingPolicyConditionMapper extends HPXPolicyConditionMapper {

  override function createCoverableInfo(currentPolicyCondition: PolicyCondition): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    return null
  }

  override function createScheduleList(currentPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    switch (currentPolicyCondition.PatternCode) {

    }
    return limits
  }

  override function createDeductibleScheduleList(currentPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)
        : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType> {
     return null
  }

}