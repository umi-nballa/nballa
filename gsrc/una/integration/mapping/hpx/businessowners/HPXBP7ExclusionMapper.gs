package una.integration.mapping.hpx.businessowners

uses una.integration.mapping.hpx.common.HPXExclusionMapper


/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 10/24/16
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXBP7ExclusionMapper extends HPXExclusionMapper {

  override function createCoverableInfo(currentExclusion: Exclusion, previousExclusion: Exclusion): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    return null
  }

  function createScheduleList(currentExclusion: Exclusion, previousExclusion: Exclusion, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()

    switch (currentExclusion.PatternCode) {
      case "BP7BusinessLiabilityExclusion_EXT" :
          var comprehensiveBusinessLiabilityExclusion = createComprehensiveBusinessLiabilityExclusion(currentExclusion, previousExclusion, transactions)
          for (item in comprehensiveBusinessLiabilityExclusion) { limits.add(item)}
          break
    }
    return limits
  }

  override function createDeductibleScheduleList(currentExclusion: Exclusion, previousExclusion: Exclusion, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType> {
    return null
  }

  function createComprehensiveBusinessLiabilityExclusion(currentExclusion: Exclusion, previousExclusion: Exclusion, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.CoverageCd = currentExclusion.PatternCode
    limit.CoverageSubCd = ""
    limit.CurrentTermAmt.Amt = 0.00
    limit.NetChangeAmt.Amt = 0.00
    limit.FormatPct = 0
    limit.FormatText = ""
    limit.LimitDesc = "Premises: " + currentExclusion.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
                      "| Operations: " + (currentExclusion.OwningCoverable as BP7Line).AssociatedPolicyPeriod.PrimaryNamedInsured.IndustryCode + " - " +
                                            (currentExclusion.OwningCoverable as BP7Line).AssociatedPolicyPeriod.PrimaryNamedInsured.IndustryCode.Classification
    limit.WrittenAmt.Amt = 0.00
    limits.add(limit)
    return limits
  }
}