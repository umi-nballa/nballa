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
uses una.integration.mapping.hpx.common.HPXAdditionalInsuredMapper
uses una.integration.mapping.hpx.commercialpackage.commercialproperty.HPXCPCoverageMapper
uses una.integration.mapping.hpx.common.HPXCoverageMapper

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
    var additionalInsuredMapper = new HPXAdditionalInsuredMapper()
    var locationMapper = new HPXLocationMapper()
    var producerMapper = new HPXProducerMapper()
    businessOwnersPolicy.addChild(new XmlElement("PolicySummaryInfo", createPolicySummaryInfo(policyPeriod)))
    businessOwnersPolicy.addChild(new XmlElement("InsuredOrPrincipal", createInsuredOrPrincipal(policyPeriod)))
    var additionalNamedInsureds = additionalNamedInsuredMapper.createAdditionalNamedInsureds(policyPeriod)
    for (additionalNamedInsured in additionalNamedInsureds) {
      businessOwnersPolicy.addChild(new XmlElement("InsuredOrPrincipal", additionalNamedInsured))
    }
    var additionalInsureds = additionalInsuredMapper.createAdditionalInsureds(policyPeriod)
    for (additionalInsured in additionalInsureds) {
      businessOwnersPolicy.addChild(new XmlElement("InsuredOrPrincipal", additionalInsured))
    }
    businessOwnersPolicy.addChild(new XmlElement("BusinessOwnerLineBusiness", createBusinessOwnersLineBusiness(policyPeriod)))
    businessOwnersPolicy.addChild(new XmlElement("PolicyInfo", createPolicyDetails(policyPeriod)))
    businessOwnersPolicy.addChild(new XmlElement("Producer", producerMapper.createProducer(policyPeriod)))
    businessOwnersPolicy.addChild(new XmlElement("Location", locationMapper.createBillingLocation(policyPeriod)))
    return businessOwnersPolicy
  }

  function createBusinessOwnersLineBusiness(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.BusinessOwnerLineBusinessType {
    var dwellingLineBusiness = new wsi.schema.una.hpx.hpx_application_request.types.complex.BusinessOwnerLineBusinessType()
    var buildings = createBuildings(policyPeriod)
    for (building in buildings) {
      dwellingLineBusiness.addChild(new XmlElement("Dwell", building))
    }
    var questions = createQuestionSet(policyPeriod)
    for (question in questions) {
      dwellingLineBusiness.addChild(new XmlElement("QuestionAnswer", question))
    }
    /*
    var lineCoverages = createLineCoveragesInfo(policyPeriod)
    for (coverage in lineCoverages) {
      dwellingLineBusiness.addChild(new XmlElement("Coverage", coverage))
    }
    */
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    var line = policyPeriod.BP7Line
    var lineCovs = policyPeriod.BP7Line.AllCoverages.where( \ elt -> elt.OwningCoverable == line)
    var previousLineCovs = previousPeriod?.BP7Line?.AllCoverages?.where( \ elt -> elt.OwningCoverable == line)
    var lineTrxs = policyPeriod.BP7Transactions.where( \ elt -> elt.Cost.Coverable == line)
    var previousTrxs = getTransactions(previousPeriod)
    var lineCoverages = createCoveragesInfo(lineCovs, previousLineCovs, lineTrxs, previousTrxs)
    for (coverage in lineCoverages) {
      dwellingLineBusiness.addChild(new XmlElement("Coverage", coverage))
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
      var previousBldgTrxs = previousPeriod?.BP7Transactions?.where( \ elt -> elt.Cost.Coverable == bldg)
      var building = buildingMapper.createBuilding(bldg)
      var buildingCovs = createCoveragesInfo(bldgCoverages, bldgPreviousCoverages, bldgTrxs, previousBldgTrxs)
      for (cov in buildingCovs) { building.addChild(new XmlElement("Coverage", cov))}
      // buildling location
      var buildingLoc = bldg.Location
      var location = locationMapper.createLocation(bldg.Location.Location)
      var locationCoverages = policyPeriod.BP7Line.AllCoverages.where( \ elt -> elt.OwningCoverable == buildingLoc)
      var locPreviousCoverages = previousPeriod?.BP7Line?.AllCoverages?.where( \ elt -> elt.OwningCoverable == buildingLoc)
      var locTrxs = policyPeriod.BP7Transactions.where( \ elt -> elt.Cost.Coverable == buildingLoc)
      var PreviousLocTrxs = previousPeriod?.BP7Transactions?.where( \ elt -> elt.Cost.Coverable == buildingLoc)
      var locationCovs = createCoveragesInfo(locationCoverages, locPreviousCoverages, locTrxs, PreviousLocTrxs)
      for (loc in locationCovs) { location.addChild(new XmlElement("Coverage", loc))}
      building.addChild(new XmlElement("Location", location))
      // building classifications
      var bldgClassifications = bldg.Classifications
      for (bldgClassification in bldgClassifications) {
        //var classifcation = new wsi.schema.una.hpx.hpx_application_request.BP7Classification()
        var buildlingClassification = classificationMapper.createClassification(bldgClassification)
        var classifcnCoverages = policyPeriod.BP7Line.AllCoverages.where( \ elt -> elt.OwningCoverable == bldgClassification)
        var classifcnPreviousCoverages = previousPeriod?.BP7Line?.AllCoverages?.where( \ elt -> elt.OwningCoverable == bldgClassification)
        var classifcnTrxs = policyPeriod.BP7Transactions.where( \ elt -> elt.Cost.Coverable == bldgClassification)
        var previousClassifcnTrxs = previousPeriod?.BP7Transactions?.where( \ elt -> elt.Cost.Coverable == bldgClassification)
        var classifcnCovs = createCoveragesInfo(classifcnCoverages, classifcnPreviousCoverages, classifcnTrxs, previousClassifcnTrxs)
        for (classifcn in classifcnCovs) { buildlingClassification.addChild(new XmlElement("Coverage", classifcn))}
        building.addChild(new XmlElement("BP7Classification", buildlingClassification))
      }

      buildings.add(building)
    }
    return buildings
  }

  function createCoveragesInfo(currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>,
                               transactions : java.util.List<Transaction>, previousTransactions : java.util.List<Transaction>)
                                                    : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    var coverageMapper = new HPXBP7CoverageMapper()
    // added or changed coverages
    for (coverage in currentCoverages) {
      var trxs = transactions.where( \ elt1 -> coverage.PatternCode.equals((elt1.Cost as BP7Cost).Coverage.PatternCode))
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
        var trxs = transactions.where( \ elt -> cov.PatternCode.equals((elt.Cost as BP7Cost).Coverage.PatternCode))
        if (trxs?.Count > 0) {
          coverages.add(coverageMapper.createCoverageInfo(cov, null, null, trxs))
        }
      }
    }
    return coverages
  }
  /*
  function createLineCoveragesInfo(policyPeriod : PolicyPeriod)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    var line = policyPeriod.BP7Line
    var lineCoverages = policyPeriod.BP7Line.AllCoverages.where( \ elt -> elt.OwningCoverable == line)
    var previousCoverages = previousPeriod?.BP7Line?.AllCoverages?.where( \ elt -> elt.OwningCoverable == line)
    var lineTrxs = policyPeriod.BP7Transactions.where( \ elt -> elt.Cost.Coverable == line)
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    var coverageMapper = new HPXBP7CoverageMapper()
    // added or changed coverages
    for (coverage in lineCoverages) {
      var trxs = lineTrxs.where( \ elt1 -> coverage.PatternCode.equals((elt1.Cost as BP7Cost).Coverage.PatternCode))
      if (trxs?.Count > 0) {
        if (previousCoverages != null) {
          var previousCoverage = previousCoverages.firstWhere( \ elt -> elt.PatternCode.equals(coverage.PatternCode))
          var previousBOPTransactions = getTransactions(previousPeriod)
          var prevTrxs = previousBOPTransactions.where( \ elt -> coverage.PatternCode.equals((elt as BP7Transaction).BP7Cost.Coverage.PatternCode))
          coverages.add(coverageMapper.createCoverageInfo(coverage, previousCoverage, trxs, prevTrxs))
        } else {
          coverages.add(coverageMapper.createCoverageInfo(coverage, null, trxs, null))
        }
      }
    }
    // removed coverages
    if (previousCoverages != null) {
      for (cov in previousCoverages) {
        if (lineCoverages.hasMatch( \ elt1 -> elt1.PatternCode.equals(cov.PatternCode)))
          continue
        var bp7Transactions = getTransactions(policyPeriod)
        var trxs = bp7Transactions.where( \ elt -> cov.PatternCode.equals((elt.Cost as BP7Cost).Coverage.PatternCode))
        if (trxs?.Count > 0) {
          coverages.add(coverageMapper.createCoverageInfo(cov, null, null, trxs))
        }
      }
    }
    return coverages
  }
  */
  override function getCoverages(policyPeriod: PolicyPeriod): List<Coverage> {
    return policyPeriod.BP7Line.AllCoverages
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<Transaction> {
    return policyPeriod.BP7Transactions
  }

  override function getCostCoverage(cost : Cost) : Coverage {
    var result : Coverage

    switch(typeof cost){
      case BP7Cost:
          result = cost.Coverage
          break
      case HomeownersCost_HOE:
          result = cost.Coverage
          break
    }
    return result
  }

  override function getCoverageMapper() : HPXCoverageMapper {
    return new HPXBP7CoverageMapper()
  }
}