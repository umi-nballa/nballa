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
uses una.integration.mapping.hpx.common.HPXStructureMapper
uses una.integration.mapping.hpx.common.HPXClassificationMapper
uses una.integration.mapping.hpx.common.HPXExclusionMapper
uses una.integration.mapping.hpx.commercialpackage.generalliability.HPXGLExclusionMapper
uses una.integration.mapping.hpx.common.HPXPolicyConditionMapper

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
    var bopLineBusiness = new wsi.schema.una.hpx.hpx_application_request.types.complex.BusinessOwnerLineBusinessType()
    var buildings = createStructuresInfo(policyPeriod) //createBuildings(policyPeriod)
    for (building in buildings) {
      bopLineBusiness.addChild(new XmlElement("Dwell", building))
    }
    var questions = createQuestionSet(policyPeriod)
    for (question in questions) {
      bopLineBusiness.addChild(new XmlElement("QuestionAnswer", question))
    }
    var lineCovs = createLineCoverages(policyPeriod, policyPeriod.BP7Line)
    for (lineCov in lineCovs) {
      bopLineBusiness.addChild(new XmlElement("Coverage", lineCov))
    }
    var lineExcls = createLineExclusions(policyPeriod, policyPeriod.BP7Line)
    for (lineExcl in lineExcls) {
      bopLineBusiness.addChild(new XmlElement("Coverage", lineExcl))
    }
    var lineConds = createLinePolicyConditions(policyPeriod, policyPeriod.BP7Line)
    for (lineCond in lineConds) {
      bopLineBusiness.addChild(new XmlElement("Coverage", lineCond))
    }
    return bopLineBusiness
  }

  override function getCoverages(policyPeriod: PolicyPeriod): List<Coverage> {
    return policyPeriod.BP7Line.AllCoverages
  }

  override function getExclusions(policyPeriod: PolicyPeriod): List<Exclusion> {
    return policyPeriod.BP7Line.AllExclusions
  }

  override function getPolicyConditions(policyPeriod: PolicyPeriod): List<PolicyCondition> {
    return policyPeriod.BP7Line.AllConditions
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<Transaction> {
    return policyPeriod.BP7Transactions
  }

  override function getCoverageMapper() : HPXCoverageMapper {
    return new HPXBP7CoverageMapper()
  }

  override function getStructureMapper() : HPXStructureMapper {
    return new HPXBP7BuildingMapper()
  }

  override function getClassificationMapper() : HPXClassificationMapper {
    return new HPXBP7ClassificationMapper()
  }

  override function getExclusionMapper() : HPXExclusionMapper {
    return new HPXBP7ExclusionMapper()
  }

  override function getPolicyConditionMapper() : HPXPolicyConditionMapper {
    return new HPXBP7PolicyConditionMapper()
  }

  override function getStructures(policyPeriod : PolicyPeriod) : java.util.List<Coverable> {
    var structures = new java.util.ArrayList<Coverable>()
    var buildings = policyPeriod.BP7Line.AllBuildings
    for (building in buildings) {
      structures.add(building)
    }
    return structures
  }

  override function getLocation(coverable : Coverable) : PolicyLocation {
    return (coverable as BP7Building).Location.PolicyLocation
  }

  override function getLocationCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return getCoverages(policyPeriod)?.where( \ elt -> elt.OwningCoverable == (coverable as BP7Building).Location as Coverable)
  }

  override function getLocationExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion> {
    return getExclusions(policyPeriod)?.where( \ elt -> elt.OwningCoverable == (coverable as BP7Building).Location as Coverable)
  }

  override function getLocationPolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition> {
    return getPolicyConditions(policyPeriod)?.where( \ elt -> elt.OwningCoverable == (coverable as BP7Building).Location as Coverable)
  }

  override function getLocationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    var transactions = getTransactions(policyPeriod)?.where( \ elt -> elt.Cost.Coverable == (coverable as BP7Building).Location as Coverable)
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
    return (coverable as BP7Building).Classifications
  }

  override function getClassificationCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return getCoverages(policyPeriod)?.where( \ elt -> elt.OwningCoverable == coverable)
  }

  override function getClassificationExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion> {
    return getExclusions(policyPeriod)?.where( \ elt -> elt.OwningCoverable == coverable)
  }

  override function getClassificationPolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition> {
    return getPolicyConditions(policyPeriod)?.where( \ elt -> elt.OwningCoverable == coverable)
  }

  override function getClassificationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    var transactions = getTransactions(policyPeriod)?.where( \ elt -> elt.Cost.Coverable == coverable)
    return transactions
  }

  override function getAdditionalInterests(coverable : Coverable, mapper : HPXStructureMapper) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.AdditionalInterestType> {
    var additionalInterestMapper = new HPXAdditionalInterestMapper()
    var additionalInterests = additionalInterestMapper.createAdditionalInterests((coverable as BP7Building).AdditionalInterests, mapper, coverable)// AdditionalInterestDetails)
    return additionalInterests
  }

  override function getPolicyLine(policyPeriod : PolicyPeriod) : Coverable {
    return policyPeriod.BP7Line
  }

  override function getLineCoverages(line : Coverable) : java.util.List<Coverage> {
    var lineCovs = (line as BP7Line).CoveragesFromCoverable
    return lineCovs
  }

  override function getLineExclusions(line : Coverable) : java.util.List<Exclusion> {
    var lineExcls = (line as BP7Line).ExclusionsFromCoverable
    return lineExcls
  }

  override function getLinePolicyConditions(line : Coverable) : java.util.List<PolicyCondition> {
    var lineConds = (line as BP7Line).AllConditions
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
}