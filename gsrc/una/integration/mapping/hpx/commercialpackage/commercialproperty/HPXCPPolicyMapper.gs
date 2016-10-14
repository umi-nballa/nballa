package una.integration.mapping.hpx.commercialpackage.commercialproperty

uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.common.HPXLocationMapper
uses una.integration.mapping.hpx.common.HPXPolicyPeriodHelper
uses una.integration.mapping.hpx.commercialpackage.generalliability.HPXGLPolicyMapper
uses gw.xml.XmlElement
uses gw.lang.reflect.IType
uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses una.integration.mapping.hpx.common.HPXStructureMapper
uses una.integration.mapping.hpx.common.HPXClassificationMapper

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
        var buildingCovs = createCoveragesInfo(bldgCoverages, bldgPreviousCoverages, bldgTrxs, PreviousBldTrxs)
        for (cov in buildingCovs) { building.addChild(new XmlElement("Coverage", cov))}
        // buildling location
        var buildingLoc = bldg.CPLocation
        var location = locationMapper.createLocation(bldg.CPLocation.PolicyLocation)
        var locationCoverages = policyPeriod.CPLine.AllCoverages.where( \ elt -> elt.OwningCoverable == buildingLoc)
        var locPreviousCoverages = previousPeriod?.CPLine?.AllCoverages?.where( \ elt -> elt.OwningCoverable == buildingLoc)
        var locTrxs = policyPeriod.CPTransactions.where( \ elt -> elt.Cost.Coverable == buildingLoc)
        var PreviousLocTrxs = previousPeriod?.CPTransactions?.where( \ elt -> elt.Cost.Coverable == buildingLoc)
        var locationCovs = createCoveragesInfo(locationCoverages, locPreviousCoverages, locTrxs, PreviousLocTrxs)
        for (loc in locationCovs) { location.addChild(new XmlElement("Coverage", loc))}
        building.addChild(new XmlElement("Location", location))

        buildings.add(building)
      }
    }
    return buildings
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
      case CPBuildingCovCost:
          result = cost.Coverage
          break
      case CPBuildingCovGrp1Cost:
          result = cost.Coverage
          break
      case CPBuildingCovGrp2Cost:
          result = cost.Coverage
          break
    }
    return result
  }

  override function getCoverageMapper() : HPXCoverageMapper {
    return new HPXCPCoverageMapper()
  }

  override function getStructureMapper() : HPXStructureMapper {
    return new HPXCPBuildingMapper()
  }

  override function getClassificationMapper() : HPXClassificationMapper {
    return null
  }

  override function getStructures(policyPeriod : PolicyPeriod) : java.util.List<Coverable> {
    var structures = new java.util.ArrayList<Coverable>()
    var buildings = policyPeriod.CPLine.AllCoverables.where( \ elt -> elt typeis CPBuilding)
    for (building in buildings) {
      structures.add(building)
    }
    return structures
  }

  override function getLocation(coverable : Coverable) : PolicyLocation {
    return (coverable as CPBuilding).Building.PolicyLocation
  }

  override function getLocationCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return getCoverages(policyPeriod).where( \ elt -> elt.OwningCoverable == (coverable as CPBuilding).CPLocation as Coverable)
  }

  override function getLocationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    var transactions = getTransactions(policyPeriod).where( \ elt -> elt.Cost.Coverable == (coverable as CPBuilding).CPLocation as Coverable)
    return transactions
  }

  override  function getStructureCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return getCoverages(policyPeriod).where( \ elt -> elt.OwningCoverable == coverable)
  }

  override  function getStructureCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    var transactions = getTransactions(policyPeriod).where( \ elt -> elt.Cost.Coverable == coverable)
    return transactions
  }

  override function getClassifications(coverable : Coverable) : java.util.List<BP7Classification> {
    return null
  }

  override function getClassificationCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return null
  }

  override function getClassificationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    return null
  }

  override function getAdditionalInterests(coverable : Coverable) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.AdditionalInterestType> {
    return null
  }

  override function getPolicyLine(policyPeriod : PolicyPeriod) : Coverable {
    return policyPeriod.CPLine
  }

  override function getLineCoverages(line : Coverable) : java.util.List<Coverage> {
    var lineCovs = (line as CPLine).CoveragesFromCoverable
    return lineCovs
  }

  override function getLineCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    var transactions = getTransactions(policyPeriod)?.where( \ elt -> elt.Cost.Coverable == coverable)
    return transactions
  }
}