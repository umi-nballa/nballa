package una.integration.mapping.hpx.commercialpackage.generalliability

uses una.integration.mapping.hpx.common.HPXCoverageMapper


/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/14/16
 * Time: 3:31 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXGLCoverageMapper extends HPXCoverageMapper {
  function createScheduleList(currentCoverage : Coverage, previousCoverage : Coverage,  transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    // General Liability does not have Scheduled Items
    return null
  }

  override function createCoverableInfo(currentCoverage: Coverage, previousCoverage: Coverage): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    var coverable = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType()
    // need to implement
    return coverable
  }

  override function getCostCoverage(cost : Cost) : Coverage {
    var result : Coverage

    switch(typeof cost){
      case GLCost:
          result = cost.Coverage
          break
      case GLCovCost:
          result = cost.Coverage
          break
      case GLCovExposureCost:
          result = cost.Coverage
          break
      case GLAddlInsuredCost:
          result = cost.Coverage
          break
      case GLStateCost:
          result = cost.Coverage
          break
    }

    return result
  }
}