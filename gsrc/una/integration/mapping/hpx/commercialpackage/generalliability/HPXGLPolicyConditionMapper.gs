package una.integration.mapping.hpx.commercialpackage.generalliability

uses una.integration.mapping.hpx.common.HPXPolicyConditionMapper




/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 10/24/16
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXGLPolicyConditionMapper extends HPXPolicyConditionMapper {

  override function createCoverableInfo(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    return null
  }

  function createScheduleList(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
     return null
  }
}