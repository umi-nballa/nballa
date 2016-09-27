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
uses gw.xml.XmlElement

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/23/16
 * Time: 1:36 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXBusinessOwnersPolicyMapper extends HPXPolicyMapper {

  function createBusinessOwnersPolicy(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.BusinessOwnerPolicyType {
    var businessOwnersPolicy = new wsi.schema.una.hpx.hpx_application_request.types.complex.BusinessOwnerPolicyType()
    var additionalNamedInsuredMapper = new HPXAdditionalNameInsuredMapper()
    var locationMapper = new HPXLocationMapper()
    var producerMapper = new HPXProducerMapper()
    businessOwnersPolicy.addChild(new XmlElement(createPolicySummaryInfo(policyPeriod)))
    businessOwnersPolicy.addChild(new XmlElement(createInsuredOrPrincipal(policyPeriod)))
    var additionalNamedInsureds = additionalNamedInsuredMapper.createAdditionalNamedInsureds(policyPeriod)
    for (additionalNamedInsured in additionalNamedInsureds) {
      businessOwnersPolicy.addChild(new XmlElement(additionalNamedInsured))
    }
    businessOwnersPolicy.addChild(new XmlElement(createBusinessOwnersLineBusiness(policyPeriod)))
    businessOwnersPolicy.addChild(new XmlElement(createPolicyDetails(policyPeriod)))
    businessOwnersPolicy.addChild(new XmlElement(producerMapper.createProducer(policyPeriod)))
    businessOwnersPolicy.addChild(new XmlElement(locationMapper.createBillingLocation(policyPeriod)))
    return businessOwnersPolicy
  }

  function createBusinessOwnersLineBusiness(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.BusinessOwnerLineBusinessType {
    var dwellingLineBusiness = new wsi.schema.una.hpx.hpx_application_request.types.complex.BusinessOwnerLineBusinessType()
    var buildings = createBuildings(policyPeriod)
    for (building in buildings) {
      dwellingLineBusiness.addChild(new XmlElement(building))
    }
    var questions = createQuestionSet(policyPeriod)
    for (question in questions) {
      dwellingLineBusiness.addChild(new XmlElement(question))
    }
    return dwellingLineBusiness
  }

  /************************************** Dwell  ******************************************************/

  function createBuildings(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType> {
    var buildings = new java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType>()
    var buildingMapper = new HPXBP7BuildingMapper()
    var locationMapper = new HPXLocationMapper()
    var classificationMapper = new HPXBP7ClassificationMapper ()
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var bldgs = policyPeriod.BP7Line.AllBuildings
    for (bldg in bldgs) {
      var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
      var bldgCoverages = policyPeriod.BP7Line.AllCoverages.where( \ elt -> elt.OwningCoverable == bldg)
      var bldgPreviousCoverages = previousPeriod?.BP7Line?.AllCoverages?.where( \ elt -> elt.OwningCoverable == bldg)
      var bldgTrxs = policyPeriod.BP7Transactions.where( \ elt -> elt.Cost.Coverable == bldg)
      var building = buildingMapper.createBuilding(bldg)
      var buildingCovs = createCoveragesInfo(bldgCoverages, bldgPreviousCoverages, bldgTrxs)
      for (cov in buildingCovs) { building.addChild(new XmlElement(cov))}
      // buildling location
      var buildingLoc = bldg.Location
      var location = locationMapper.createLocation(bldg.Location.Location)
      var locationCoverages = policyPeriod.BP7Line.AllCoverages.where( \ elt -> elt.OwningCoverable == buildingLoc)
      var locPreviousCoverages = previousPeriod?.BP7Line?.AllCoverages?.where( \ elt -> elt.OwningCoverable == buildingLoc)
      var locTrxs = policyPeriod.BP7Transactions.where( \ elt -> elt.Cost.Coverable == buildingLoc)
      var locationCovs = createCoveragesInfo(locationCoverages, locPreviousCoverages, locTrxs)
      for (loc in locationCovs) { location.addChild(new XmlElement(loc))}
      building.addChild(new XmlElement(location))
      // building classifications
      var bldgClassifications = bldg.Classifications
      for (bldgClassification in bldgClassifications) {
        //var classifcation = new wsi.schema.una.hpx.hpx_application_request.BP7Classification()
        var buildlingClassification = classificationMapper.createClassification(bldgClassification)
        var classifcnCoverages = policyPeriod.BP7Line.AllCoverages.where( \ elt -> elt.OwningCoverable == buildingLoc)
        var classifcnPreviousCoverages = previousPeriod?.BP7Line?.AllCoverages?.where( \ elt -> elt.OwningCoverable == buildingLoc)
        var classifcnTrxs = policyPeriod.BP7Transactions.where( \ elt -> elt.Cost.Coverable == buildingLoc)
        var classifcnCovs = createCoveragesInfo(classifcnCoverages, classifcnPreviousCoverages, classifcnTrxs)
        for (classifcn in classifcnCovs) { buildlingClassification.addChild(new XmlElement(classifcn))}
        building.addChild(new XmlElement(buildlingClassification))
      }

      buildings.add(building)
    }
    return buildings
  }

  function createCoveragesInfo(currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>,
                               transactions : java.util.List<Transaction>)
                                                    : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    var coverageMapper = new HPXBP7CoverageMapper()
    for (coverage in currentCoverages) {
      var trxs = transactions.where( \ elt1 -> coverage.equals((elt1.Cost as BP7Cost).Coverage.PatternCode))
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
    return policyPeriod.BP7Line.AllCoverages
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<Transaction> {
    return policyPeriod.BP7Transactions
  }


}