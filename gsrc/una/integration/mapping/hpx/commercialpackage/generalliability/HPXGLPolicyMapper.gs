package una.integration.mapping.hpx.commercialpackage.generalliability

uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.common.HPXPolicyPeriodHelper
uses gw.lang.reflect.IType
uses una.integration.mapping.hpx.common.HPXCoverageMapper

/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/14/16
 * Time: 9:12 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXGLPolicyMapper extends HPXPolicyMapper {

  function createGeneralLiabilityLineBusiness(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    var glCoverages = policyPeriod.GLLine.AllCoverages
    var glPreviousCoverages = previousPeriod.GLLine.AllCoverages
    var glTrxs = policyPeriod.GLTransactions
    var previousGLTransactions = getTransactions(previousPeriod)
    return createCoveragesInfo(glCoverages, glPreviousCoverages, glTrxs, previousGLTransactions)

  }

  override function getCoverages(policyPeriod: PolicyPeriod): List<Coverage> {
      return policyPeriod.GLLine.AllCoverages
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<Transaction> {
      return policyPeriod.GLTransactions
  }


  function getCostCoverage(cost : Cost) : Coverage {
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

  override function getCoverageMapper() : HPXCoverageMapper {
    return new HPXGLCoverageMapper()
  }
}