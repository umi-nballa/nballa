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
    return createGeneralLiabilityLineCoveragesInfo(glCoverages, glPreviousCoverages, glTrxs, previousGLTransactions)

  }

  function createGeneralLiabilityLineCoveragesInfo(currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>,
                                                   transactions : java.util.List<Transaction>, previousTransactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    var coverageMapper = new HPXGLCoverageMapper()
    // added or changed coverages
    for (coverage in currentCoverages) {
      var trxs = transactions.where( \ elt1 -> coverage.PatternCode.equals((elt1.Cost as GLCost).Coverage.PatternCode))
      if (trxs?.Count > 0) {
        if (previousCoverages != null) {
          var previousCoverage = previousCoverages.firstWhere( \ elt -> elt.PatternCode.equals(coverage.PatternCode))
          coverages.add(coverageMapper.createCoverageInfo(coverage, previousCoverage, trxs, previousTransactions))
        } else {
          coverages.add(coverageMapper.createCoverageInfo(coverage, null, trxs, null))
        }
      }
    }
    // removed coverages
    if (previousCoverages != null) {
      for (cov in previousCoverages) {
        if (currentCoverages.hasMatch( \ elt1 -> elt1.PatternCode.equals(cov.PatternCode)))
          continue
        var trxs = transactions.where( \ elt -> cov.PatternCode.equals((elt.Cost as GLCost).Coverage.PatternCode))
        if (trxs?.Count > 0) {
          coverages.add(coverageMapper.createCoverageInfo(cov, null, null, trxs))
        }
      }
    }
    return coverages
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
      case HomeownersCost_HOE:
        result = cost.Coverage
        break
    }

    return result
  }

  override function getCoverageMapper() : HPXCoverageMapper {
    return new HPXGLCoverageMapper()
  }
}