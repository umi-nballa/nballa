package una.integration.mapping.hpx.commercialpackage.generalliability

uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.common.HPXPolicyPeriodHelper

/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/14/16
 * Time: 9:12 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXGLPolicyMapper extends HPXPolicyMapper {

  function createGeneralLiabilityLineBusiness(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.Coverage> {
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    var glCoverages = policyPeriod.GLLine.AllCoverages
    var glPreviousCoverages = previousPeriod.GLLine.AllCoverages
    var glTrxs = policyPeriod.GLTransactions
    return createGeneralLiabilityLineCoveragesInfo(glCoverages, glPreviousCoverages, glTrxs)

  }

  function createGeneralLiabilityLineCoveragesInfo(currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>,
                                                   transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.Coverage> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Coverage>()
    var coverageMapper = new HPXGLCoverageMapper()
    for (coverage in currentCoverages) {
      var trxs = transactions.where( \ elt1 -> coverage.equals((elt1.Cost as GLCost).Coverage.PatternCode))
      if (previousCoverages != null) {
        var previousCoverage = previousCoverages.firstWhere( \ elt -> elt.PatternCode.equals(coverage.PatternCode))
        coverages.add(coverageMapper.createCoverageInfo(coverage, previousCoverage, trxs))
      } else {
        coverages.add(coverageMapper.createCoverageInfo(coverage, null, trxs))
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

}