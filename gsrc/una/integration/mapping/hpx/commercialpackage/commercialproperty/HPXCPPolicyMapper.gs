package una.integration.mapping.hpx.commercialpackage.commercialproperty

uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.common.HPXLocationMapper
uses una.integration.mapping.hpx.helper.HPXPolicyPeriodHelper
uses una.integration.mapping.hpx.commercialpackage.generalliability.HPXGLPolicyMapper
uses gw.xml.XmlElement
uses gw.lang.reflect.IType
uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses una.integration.mapping.hpx.common.HPXStructureMapper
uses una.integration.mapping.hpx.common.HPXClassificationMapper
uses una.integration.mapping.hpx.common.HPXExclusionMapper
uses una.integration.mapping.hpx.commercialpackage.generalliability.HPXGLExclusionMapper
uses una.integration.mapping.hpx.commercialpackage.generalliability.HPXGLPolicyConditionMapper
uses una.integration.mapping.hpx.common.HPXPolicyConditionMapper
uses una.integration.mapping.hpx.common.HPXAdditionalInterestMapper
uses una.integration.mapping.hpx.common.HPXEstimatedDiscount

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
      var glLineCovs = generalLiabilityPolicyLine.createGeneralLiabilityLineCoverages(policyPeriod)
      for (cov in glLineCovs) { commercialPropertyLineBusiness.addChild(new XmlElement("Coverage", cov)) }
    }
    if(policyPeriod.GLLineExists) {
      var glLineExlcs = generalLiabilityPolicyLine.createGeneralLiabilityLineExclusions(policyPeriod)
      for (glLineExlc in glLineExlcs) { commercialPropertyLineBusiness.addChild(new XmlElement("Coverage", glLineExlc)) }
    }
    if(policyPeriod.GLLineExists) {
      var glLineConds = generalLiabilityPolicyLine.createGeneralLiabilityLinePolicyConditions(policyPeriod)
      for (glLineCond in glLineConds) { commercialPropertyLineBusiness.addChild(new XmlElement("Coverage", glLineCond)) }
    }
    if(policyPeriod.CPLineExists) {
      var glLineCovs = createCommericalPropertyLineCoverages(policyPeriod)
      for (cov in glLineCovs) { commercialPropertyLineBusiness.addChild(new XmlElement("Coverage", cov)) }
    }
    if(policyPeriod.CPLineExists) {
      var glLineExlcs = createCommericalPropertyLineExclusions(policyPeriod)
      for (glLineExlc in glLineExlcs) { commercialPropertyLineBusiness.addChild(new XmlElement("Coverage", glLineExlc)) }
    }
    if(policyPeriod.CPLineExists) {
      var glLineConds = createCommericalPropertyLinePolicyConditions(policyPeriod)
      for (glLineCond in glLineConds) { commercialPropertyLineBusiness.addChild(new XmlElement("Coverage", glLineCond)) }
    }
    var buildings = createStructuresInfo(policyPeriod)
    for (building in buildings) {
      commercialPropertyLineBusiness.addChild(new XmlElement("Dwell", building))
    }
    var questions = createQuestionSet(policyPeriod)
    for (question in questions) {
      commercialPropertyLineBusiness.addChild(new XmlElement("QuestionAnswer", question))
    }
    return commercialPropertyLineBusiness
  }

  override function getCoverages(policyPeriod: PolicyPeriod): List<Coverage> {
      return policyPeriod.CPLine.AllCoverages
  }

  override function getExclusions(policyPeriod: PolicyPeriod): List<Exclusion> {
    return policyPeriod.CPLine.AllExclusions
  }

  override function getPolicyConditions(policyPeriod: PolicyPeriod): List<PolicyCondition> {
    return policyPeriod.CPLine.AllConditions
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<Transaction> {
      return policyPeriod.CPTransactions
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

  override function getExclusionMapper() : HPXExclusionMapper {
    return new HPXGLExclusionMapper()
  }

  override function getPolicyConditionMapper() : HPXPolicyConditionMapper {
    return new HPXCPPolicyConditionMapper()
  }

  override function getStructures(policyPeriod : PolicyPeriod) : java.util.List<Coverable> {
    var structures = new java.util.ArrayList<Coverable>()
    var buildings = policyPeriod?.CPLine?.AllCoverables?.where( \ elt -> elt typeis CPBuilding)
    for (building in buildings) {
      structures.add(building)
    }
    return structures
  }

  function createCommericalPropertyLineCoverages(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    return createLineCoverages(policyPeriod, policyPeriod.CPLine)
  }

  function createCommericalPropertyLineExclusions(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    return createLineExclusions(policyPeriod, policyPeriod.CPLine)
  }

  function createCommericalPropertyLinePolicyConditions(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    return createLinePolicyConditions(policyPeriod, policyPeriod.CPLine)
  }

  override function getLocation(coverable : Coverable) : PolicyLocation {
    return (coverable as CPBuilding).Building.PolicyLocation
  }

  override function getLocationCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return getCoverages(policyPeriod)?.where( \ elt -> elt.OwningCoverable == (coverable as CPBuilding).CPLocation as Coverable)
  }

  override function getLocationExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion> {
    return getExclusions(policyPeriod)?.where( \ elt -> elt.OwningCoverable == (coverable as CPBuilding).CPLocation as Coverable)
  }

  override function getLocationPolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition> {
    return getPolicyConditions(policyPeriod)?.where( \ elt -> elt.OwningCoverable == (coverable as CPBuilding).CPLocation as Coverable)
  }

  override function getLocationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    var transactions = getTransactions(policyPeriod)?.where( \ elt -> elt.Cost.Coverable == (coverable as CPBuilding).CPLocation as Coverable)
    return transactions
  }

  override  function getStructureCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return getCoverages(policyPeriod)?.where( \ elt -> elt.OwningCoverable == coverable)
  }

  override  function getStructureExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion> {
    return getExclusions(policyPeriod)?.where( \ elt -> elt.OwningCoverable == coverable)
  }

  override  function getStructurePolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition> {
    return getPolicyConditions(policyPeriod)?.where( \ elt -> elt.OwningCoverable == coverable)
  }

  override  function getStructureCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    var transactions = getTransactions(policyPeriod)?.where( \ elt -> elt.Cost.Coverable == coverable)
    return transactions
  }

  override function getScheduleTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    return getTransactions(policyPeriod)?.where( \ elt -> elt.Cost typeis ScheduleCovCost_HOE)
  }

  override function getClassifications(coverable : Coverable) : java.util.List<BP7Classification> {
    return null
  }

  override function getClassificationCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return null
  }

  override function getClassificationExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion> {
    return null
  }

  override function getClassificationPolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition> {
    return null
  }

  override function getClassificationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    return null
  }

  override function getAdditionalInterests(coverable : Coverable) : AddlInterestDetail [] {
    var additionalInterests = (coverable as CPBuilding).AdditionalInterests
    return additionalInterests
  }

  override function getPolicyLine(policyPeriod : PolicyPeriod) : Coverable {
    return policyPeriod.CPLine
  }

  override function getLineCoverages(line : Coverable) : java.util.List<Coverage> {
    var lineCovs = (line as CPLine).CoveragesFromCoverable
    return lineCovs
  }

  override function getLineExclusions(line : Coverable) : java.util.List<Exclusion> {
    var lineExcls = (line as CPLine).ExclusionsFromCoverable
    return lineExcls
  }

  override function getLinePolicyConditions(line : Coverable) : java.util.List<PolicyCondition> {
    var lineConds = (line as CPLine).ConditionsFromCoverable
    return lineConds
  }

  override function getLineCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    var transactions = getTransactions(policyPeriod)?.where( \ elt -> elt.Cost.Coverable == coverable)
    return transactions
  }

  override function getCostType(cost : Cost) :  String {
    return null
  }

  override function getDiscountCostTypes() : String[] {
    return null
  }

  override function getEstimatedDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    return null
  }
}