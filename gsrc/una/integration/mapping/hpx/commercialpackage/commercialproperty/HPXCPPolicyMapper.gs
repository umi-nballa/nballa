package una.integration.mapping.hpx.commercialpackage.commercialproperty

uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.common.HPXLocationMapper
uses una.integration.mapping.hpx.common.HPXPolicyPeriodHelper
uses una.integration.mapping.hpx.commercialpackage.generalliability.HPXGLPolicyMapper
uses gw.xml.XmlElement
uses gw.lang.reflect.IType
uses una.integration.mapping.hpx.common.HPXCoverageMapper

/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/14/16
 * Time: 9:11 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCPPolicyMapper extends HPXPolicyMapper {

  function createCommercialPropertyLineBusiness(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.CommercialPackageLineBusinessType {
    var commercialPropertyLineBusiness = new wsi.schema.una.hpx.hpx_application_request.types.complex.CommercialPackageLineBusinessType()
    var generalLiabilityPolicyLine = new HPXGLPolicyMapper()

    // If it contains General Liability Line, include the coverages
    if(policyPeriod.GLLineExists) {
      var glLine = generalLiabilityPolicyLine.createGeneralLiabilityLineBusiness(policyPeriod)
      for (cov in glLine) { commercialPropertyLineBusiness.addChild(new XmlElement("Coverage", cov)) }
    }
    var buildings = createBuildings(policyPeriod)
    for (building in buildings) {
      commercialPropertyLineBusiness.addChild(new XmlElement("Dwell", building))
    }
    var questions = createQuestionSet(policyPeriod)
    for (question in questions) {
      commercialPropertyLineBusiness.addChild(new XmlElement("QuestionAnswer", question))
    }
    return commercialPropertyLineBusiness
  }

  function createBuildings(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType> {
    var buildings = new java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType>()
    var buildingMapper = new HPXCPBuildingMapper()
    var locationMapper = new HPXLocationMapper()
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var bldgs = policyPeriod.CPLine.AllCoverables
    for (bldg in bldgs) {
      if(bldg typeis CPBuilding){
        var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
        var bldgCoverages = policyPeriod.CPLine.AllCoverages.where( \ elt -> elt.OwningCoverable == bldg)
        var bldgPreviousCoverages = previousPeriod?.CPLine?.AllCoverages?.where( \ elt -> elt.OwningCoverable == bldg)
        var bldgTrxs = policyPeriod.CPTransactions.where( \ elt -> elt.Cost.Coverable == bldg)
        var PreviousBldTrxs = previousPeriod?.CPTransactions?.where( \ elt -> elt.Cost.Coverable == bldg)
        var building = buildingMapper.createBuilding(bldg)
        var buildingCovs = createCommercialPropertyLineCoveragesInfo(bldgCoverages, bldgPreviousCoverages, bldgTrxs, PreviousBldTrxs)
        for (cov in buildingCovs) { building.addChild(new XmlElement("Coverage", cov))}
        // buildling location
        var buildingLoc = bldg.CPLocation
        var location = locationMapper.createLocation(bldg.CPLocation.PolicyLocation)
        var locationCoverages = policyPeriod.CPLine.AllCoverages.where( \ elt -> elt.OwningCoverable == buildingLoc)
        var locPreviousCoverages = previousPeriod?.CPLine?.AllCoverages?.where( \ elt -> elt.OwningCoverable == buildingLoc)
        var locTrxs = policyPeriod.CPTransactions.where( \ elt -> elt.Cost.Coverable == buildingLoc)
        var PreviousLocTrxs = previousPeriod?.CPTransactions?.where( \ elt -> elt.Cost.Coverable == buildingLoc)
        var locationCovs = createCommercialPropertyLineCoveragesInfo(locationCoverages, locPreviousCoverages, locTrxs, PreviousLocTrxs)
        for (loc in locationCovs) { location.addChild(new XmlElement("Coverage", loc))}
        building.addChild(new XmlElement("Location", location))

        buildings.add(building)
      }
    }
    return buildings
  }

  function createCommercialPropertyLineCoveragesInfo(currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>,
                                                     transactions : java.util.List<Transaction>, previousTransactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    var coverageMapper = new HPXCPCoverageMapper()
    // added or changed coverages
    for (coverage in currentCoverages) {
      var trxs = transactions.where( \ elt1 -> coverage.PatternCode.equals((elt1.Cost as CPCost).Coverage.PatternCode))
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
        var trxs = transactions.where( \ elt -> cov.PatternCode.equals((elt.Cost as CPCost).Coverage.PatternCode))
        if (trxs?.Count > 0) {
          coverages.add(coverageMapper.createCoverageInfo(cov, null, null, trxs))
        }
      }
    }
    return coverages
  }

  override function getCoverages(policyPeriod: PolicyPeriod): List<Coverage> {
      return policyPeriod.CPLine.AllCoverages
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<Transaction> {
      return policyPeriod.CPTransactions
  }

  override function getCostCoverage(cost : Cost) : Coverage {
    var result : Coverage

    switch(typeof cost){
      case CPCost:
          result = cost.Coverage
          break
      case HomeownersCost_HOE:
          result = cost.Coverage
          break
    }
    return result
  }

  override function getCoverageMapper() : HPXCoverageMapper {
    return new HPXCPCoverageMapper()
  }
}