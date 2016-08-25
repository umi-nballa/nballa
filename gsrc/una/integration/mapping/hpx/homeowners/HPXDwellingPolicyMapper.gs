package una.integration.mapping.hpx.homeowners

uses java.util.List
uses java.util.List
uses java.util.List
uses una.integration.mapping.hpx.common.HPXAdditionalNameInsuredMapper
uses una.integration.mapping.hpx.common.HPXLocationMapper
uses una.integration.mapping.hpx.common.HPXProducerMapper
uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.common.HPXAdditionalInterestMapper
uses una.integration.mapping.hpx.common.HPXPolicyPeriodHelper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/2/16
 * Time: 9:47 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwellingPolicyMapper extends HPXPolicyMapper {

  function createDwellingPolicy(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.DwellingPolicy
  {
    var dwellingPolicy = new wsi.schema.una.hpx.hpx_application_request.DwellingPolicy()
    var additionalNamedInsuredMapper = new HPXAdditionalNameInsuredMapper()
    var locationMapper = new HPXLocationMapper()
    var producerMapper = new HPXProducerMapper()
    dwellingPolicy.addChild(createPolicySummaryInfo(policyPeriod))
    dwellingPolicy.addChild(createInsuredOrPrincipal(policyPeriod))
    var additionalNamedInsureds = additionalNamedInsuredMapper.createAdditionalNamedInsureds(policyPeriod)
    for (additionalNamedInsured in additionalNamedInsureds) {
      dwellingPolicy.addChild(additionalNamedInsured)
    }
    dwellingPolicy.addChild(createDwellingLineBusiness(policyPeriod))
    dwellingPolicy.addChild(createPolicyDetails(policyPeriod))
    dwellingPolicy.addChild(producerMapper.createProducer(policyPeriod))
    dwellingPolicy.addChild(locationMapper.createBillingLocation(policyPeriod))
    return dwellingPolicy
  }

  function createDwellingLineBusiness(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.DwellingLineBusiness {
    var dwellingLineBusiness = new wsi.schema.una.hpx.hpx_application_request.DwellingLineBusiness()
    dwellingLineBusiness.addChild(createDwell(policyPeriod))
    var questions = createQuestionSet(policyPeriod)
    for (question in questions) {
      dwellingLineBusiness.addChild(question)
    }
    return dwellingLineBusiness
  }

  /************************************** Dwell  ******************************************************/
  function createDwell(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.Dwell {
    var additionalInterestMapper = new HPXAdditionalInterestMapper()
    var locationMapper = new HPXLocationMapper()
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var additionalInterests = additionalInterestMapper.createAdditionalInterests(policyPeriod.HomeownersLine_HOE.Dwelling.AdditionalInterestDetails)
    var loc = locationMapper.createLocation(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.PolicyLocation)
    for (additionalInterest in additionalInterests) {
      loc.addChild(additionalInterest)
    }
    var dwellMapper = new HPXDwellMapper()
    var dwellConstructionMapper = new HPXHODwellConstructionMapper ()
    var dwell = dwellMapper.createDwell(policyPeriod)
    dwell.addChild(dwellConstructionMapper.createDwellConstruction(policyPeriod))
    dwell.addChild(loc)
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    var transactions = policyPeriod.HOTransactions
    var covs = createCoveragesInfo(policyPeriod, getCoverages(policyPeriod), getCoverages(previousPeriod))
    for (cov in covs) {
      dwell.addChild(cov)
    }
    return dwell
  }

  function createCoveragesInfo(policyPeriod : PolicyPeriod, currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.Coverage> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Coverage>()
    var coverageMapper = new HPXDwellingCoverageMapper()
    for (cov in currentCoverages) {
      var hoTransactions = getTransactions(policyPeriod)
      var trxs = hoTransactions.where( \ elt -> cov.equals(elt.HomeownersCost.Coverage.PatternCode))
      if (previousCoverages != null) {
        var previousCoverage = previousCoverages.firstWhere( \ elt -> elt.PatternCode.equals(cov.PatternCode))
        coverages.add(coverageMapper.createCoverageInfo(cov, previousCoverage, trxs))
      } else {
        coverages.add(coverageMapper.createCoverageInfo(cov, null, trxs))
      }
    }
    return coverages
  }

  override function getCoverages(policyPeriod: PolicyPeriod): List<Coverage> {
    return policyPeriod.HomeownersLine_HOE.AllCoverages
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<HOTransaction_HOE> {
    return policyPeriod.HOTransactions
  }
}