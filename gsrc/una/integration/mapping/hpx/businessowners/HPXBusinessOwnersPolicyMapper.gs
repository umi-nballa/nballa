package una.integration.mapping.hpx.businessowners

uses java.util.List
uses java.util.List
uses java.util.List
uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.common.HPXAdditionalNameInsuredMapper
uses una.integration.mapping.hpx.common.HPXLocationMapper
uses una.integration.mapping.hpx.common.HPXProducerMapper
uses una.integration.mapping.hpx.common.HPXAdditionalInterestMapper
uses una.integration.mapping.hpx.common.HPXPolicyPeriodHelper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/23/16
 * Time: 1:36 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXBusinessOwnersPolicyMapper extends HPXPolicyMapper {

  function createBusinessOwnersPolicy(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.BusinessOwnerPolicy {
    var businessOwnersPolicy = new wsi.schema.una.hpx.hpx_application_request.BusinessOwnerPolicy()
    var additionalNamedInsuredMapper = new HPXAdditionalNameInsuredMapper()
    var locationMapper = new HPXLocationMapper()
    var producerMapper = new HPXProducerMapper()
    businessOwnersPolicy.addChild(createPolicySummaryInfo(policyPeriod))
    businessOwnersPolicy.addChild(createInsuredOrPrincipal(policyPeriod))
    var additionalNamedInsureds = additionalNamedInsuredMapper.createAdditionalNamedInsureds(policyPeriod)
    for (additionalNamedInsured in additionalNamedInsureds) {
      businessOwnersPolicy.addChild(additionalNamedInsured)
    }
    businessOwnersPolicy.addChild(createBusinessOwnersLineBusiness(policyPeriod))
    businessOwnersPolicy.addChild(createPolicyDetails(policyPeriod))
    businessOwnersPolicy.addChild(producerMapper.createProducer(policyPeriod))
    businessOwnersPolicy.addChild(locationMapper.createBillingLocation(policyPeriod))
    return businessOwnersPolicy
  }

  function createBusinessOwnersLineBusiness(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.BusinessOwnerLineBusiness {
    var dwellingLineBusiness = new wsi.schema.una.hpx.hpx_application_request.BusinessOwnerLineBusiness()
    var buildings = createBuildings(policyPeriod)
    for (building in buildings) {
      dwellingLineBusiness.addChild(building)
    }
    var questions = createQuestionSet(policyPeriod)
    for (question in questions) {
      dwellingLineBusiness.addChild(question)
    }
    return dwellingLineBusiness
  }

  /************************************** Dwell  ******************************************************/

  function createBuildings(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.Dwell> {
    var buildings = new java.util.List<wsi.schema.una.hpx.hpx_application_request.Dwell>()
    var locationMapper = new HPXLocationMapper()
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var buildingMapper = new HPXBP7BuildingMapper()
    var buildingConstructionMapper = new HPXBP7BuildingConstructionMapper ()
    var bldgs = policyPeriod.BP7Line.AllBuildings

    for (bldg in bldgs) {
      var building = buildingMapper.createBuilding(bldg)
      building.addChild(buildingConstructionMapper.createBuildingConstructionInfo(bldg))
      /*var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
      var transactions = policyPeriod.BP7Transactions
      var covs = createCoveragesInfo(policyPeriod, getCoverages(policyPeriod), getCoverages(previousPeriod))
      var locs = locationMapper.createLocations(policyPeriod.BP7Line.BP7Locations.PolicyLocations) */
      buildings.add(building)
    }
    return buildings
  }



  function createCoveragesInfo(policyPeriod : PolicyPeriod, currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.Coverage> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Coverage>()
    var coverageMapper = new HPXBP7CoverageMapper()
    for (cov in currentCoverages) {
      var bopTransactions = getTransactions(policyPeriod)
      var trxs = bopTransactions.where( \ elt1 -> cov.equals((elt1.Cost as BP7Cost).Coverage.PatternCode))
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
    return policyPeriod.BP7Line.AllCoverages
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<Transaction> {
    return policyPeriod.BP7Transactions
  }


}