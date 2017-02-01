package una.integration.mapping.hpx.commercialpackage.generalliability

uses una.integration.mapping.hpx.common.HPXExclusionMapper


/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 10/24/16
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXGLExclusionMapper extends HPXExclusionMapper {

  override function createCoverableInfo(currentExclusion: Exclusion): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    return null
  }

  function createScheduleList(currentExclusion: Exclusion, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    switch (currentExclusion.PatternCode) {
      case "CPAddPropExclusion_EXT" :
          var additionalPropertyNotCoveredExclusion = createAdditionalPropertyNotCoveredExclusion(currentExclusion, transactions)
          for (item in additionalPropertyNotCoveredExclusion) { limits.add(item)}
          break
    }
    return limits
  }

  private function createAdditionalPropertyNotCoveredExclusion(currentExclusion: Exclusion, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.CoverageCd = currentExclusion.PatternCode
    limit.CoverageSubCd = ""
    limit.CurrentTermAmt.Amt = 0
    limit.NetChangeAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.FormatText = ""
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0
    limits.add(limit)
    return limits
  }

  override function createDeductibleScheduleList(currentExclusion: Exclusion, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType> {
    return null
  }
}