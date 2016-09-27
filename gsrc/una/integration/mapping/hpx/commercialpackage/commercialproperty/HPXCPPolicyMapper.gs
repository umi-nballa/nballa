package una.integration.mapping.hpx.commercialpackage.commercialproperty

uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.common.HPXLocationMapper
uses una.integration.mapping.hpx.common.HPXPolicyPeriodHelper
uses una.integration.mapping.hpx.commercialpackage.generalliability.HPXGLPolicyMapper
uses gw.xml.XmlElement

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
      for (cov in glLine) { commercialPropertyLineBusiness.addChild(new XmlElement(cov)) }
    }
    var buildings = createBuildings(policyPeriod)
    for (building in buildings) {
      commercialPropertyLineBusiness.addChild(new XmlElement(building))
    }
    var questions = createQuestionSet(policyPeriod)
    for (question in questions) {
      commercialPropertyLineBusiness.addChild(new XmlElement(question))
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
        var building = buildingMapper.createBuilding(bldg)
        var buildingCovs = createCommercialPropertyLineCoveragesInfo(bldgCoverages, bldgPreviousCoverages, bldgTrxs)
        for (cov in buildingCovs) { building.addChild(new XmlElement(cov))}
        // buildling location
        var buildingLoc = bldg.CPLocation
        var location = locationMapper.createLocation(bldg.CPLocation.PolicyLocation)
        var locationCoverages = policyPeriod.CPLine.AllCoverages.where( \ elt -> elt.OwningCoverable == buildingLoc)
        var locPreviousCoverages = previousPeriod?.CPLine?.AllCoverages?.where( \ elt -> elt.OwningCoverable == buildingLoc)
        var locTrxs = policyPeriod.CPTransactions.where( \ elt -> elt.Cost.Coverable == buildingLoc)
        var locationCovs = createCommercialPropertyLineCoveragesInfo(locationCoverages, locPreviousCoverages, locTrxs)
        for (loc in locationCovs) { location.addChild(new XmlElement(loc))}
        building.addChild(new XmlElement(location))

        buildings.add(building)
      }
    }
    return buildings
  }

  function createCommercialPropertyLineCoveragesInfo(currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>,
                                                     transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    var coverageMapper = new HPXCPCoverageMapper()
    for (coverage in currentCoverages) {
      var trxs = transactions.where( \ elt1 -> coverage.equals((elt1.Cost as CPCost).Coverage.PatternCode))
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
      return policyPeriod.CPLine.AllCoverages
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<Transaction> {
      return policyPeriod.CPTransactions
  }

}