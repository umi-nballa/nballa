package una.integration.mapping.hpx.commercialpackage.commercialproperty

uses una.integration.mapping.hpx.common.HPXExclusionMapper


/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 10/24/16
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCPExclusionMapper extends HPXExclusionMapper {

  override function createCoverableInfo(currentExclusion: Exclusion): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    return null
  }

  function createScheduleList(currentExclusion: Exclusion, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
     return null
  }

  override function createDeductibleScheduleList(currentExclusion: Exclusion, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType> {
    return null
  }
}