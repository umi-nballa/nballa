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

  override function createScheduleList(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()

    switch (currentPolicyCondition.PatternCode) {
      case "LimitationofCovDesignatedPremises_EXT" :
          var limitationOfCovToDesigPremisesOrProject = createlimitationOfCovToDesigPremisesOrProjectSchedule(currentPolicyCondition, previousPolicyCondition, transactions)
          for (item in limitationOfCovToDesigPremisesOrProject) { limits.add(item)}
          break
    }
    return limits
  }

  override function createDeductibleScheduleList(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType> {
    return null
  }

  function createlimitationOfCovToDesigPremisesOrProjectSchedule(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.CoverageCd = currentPolicyCondition.PatternCode
    limit.CoverageSubCd = ""
    limit.CurrentTermAmt.Amt = 0.00
    limit.NetChangeAmt.Amt = 0.00
    limit.FormatPct = 0
    limit.FormatText = ""
    limit.LimitDesc = "Premises: " + currentPolicyCondition.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
                      "| Project: " + (currentPolicyCondition.OwningCoverable as GLLine).Exposures.first().ClassCode + " - " +
                                      (currentPolicyCondition.OwningCoverable as GLLine).Exposures.first().ClassCode.Classification
    limit.WrittenAmt.Amt = 0.00
    limits.add(limit)
    return limits
  }
}