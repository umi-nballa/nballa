package una.integration.mapping.hpx.commercialpackage

uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.commercialpackage.commercialproperty.HPXCPPolicyMapper
uses una.integration.mapping.hpx.common.HPXLocationMapper
uses una.integration.mapping.hpx.common.HPXAdditionalNameInsuredMapper
uses una.integration.mapping.hpx.commercialpackage.generalliability.HPXGLPolicyMapper
uses una.integration.mapping.hpx.common.HPXProducerMapper
uses gw.xml.XmlElement
uses una.integration.mapping.hpx.common.HPXAdditionalInsuredMapper
uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses una.integration.mapping.hpx.common.HPXStructureMapper
uses una.integration.mapping.hpx.common.HPXClassificationMapper
uses una.integration.mapping.hpx.common.HPXExclusionMapper
uses una.integration.mapping.hpx.common.HPXPolicyConditionMapper
uses una.integration.mapping.hpx.common.HPXEstimatedDiscount
uses java.math.BigDecimal
uses una.integration.mapping.hpx.common.HPXEstimatedPremium

/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/13/16
 * Time: 2:41 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCommercialPackagePolicyMapper extends HPXPolicyMapper {

  function createCommercialPackagePolicy(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.CommercialPackagePolicyType {
    var commercialPackagePolicy = new wsi.schema.una.hpx.hpx_application_request.types.complex.CommercialPackagePolicyType()
    var commercialPackageLineBusiness = createCommercialPackageLineBusiness(policyPeriod)
    var commercialPropertyPolicyLine = new HPXCPPolicyMapper()
    var additionalNamedInsuredMapper = new HPXAdditionalNameInsuredMapper()
    var additionalInsuredMapper = new HPXAdditionalInsuredMapper()
    var generalLiabilityPolicyLine = new HPXGLPolicyMapper()
    var locationMapper = new HPXLocationMapper()
    var producerMapper = new HPXProducerMapper()
    commercialPackagePolicy.addChild(new XmlElement("InsuredOrPrincipal", createInsuredOrPrincipal(policyPeriod)))
    var additionalNamedInsureds = additionalNamedInsuredMapper.createAdditionalNamedInsureds(policyPeriod)
    for (additionalNamedInsured in additionalNamedInsureds) {
      commercialPackagePolicy.addChild(new XmlElement("InsuredOrPrincipal", additionalNamedInsured))
    }
    var additionalInsureds = additionalInsuredMapper.createAdditionalInsureds(policyPeriod)
    for (additionalInsured in additionalInsureds) {
      commercialPackagePolicy.addChild(new XmlElement("InsuredOrPrincipal", additionalInsured))
    }
    commercialPackagePolicy.addChild(new XmlElement("PolicyInfo", createPolicyDetails(policyPeriod)))
    commercialPackagePolicy.addChild(new XmlElement("Producer", producerMapper.createProducer(policyPeriod)))
    commercialPackagePolicy.addChild(new XmlElement("Location", locationMapper.createBillingLocation(policyPeriod)))
    commercialPackagePolicy.addChild(new XmlElement("PolicySummaryInfo", createPolicySummaryInfo(policyPeriod)))
    var commericalProperties = commercialPropertyPolicyLine.createCommercialProperties(policyPeriod)
    for (dwell in commericalProperties.$Children) {commercialPackageLineBusiness.addChild(dwell)}
    commercialPackagePolicy.addChild(new XmlElement("CommercialPackageLineBusiness", commercialPackageLineBusiness))
    return commercialPackagePolicy
  }

  function createCommercialPackageLineBusiness(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.CommercialPackageLineBusinessType {
    var commercialPropertyLineBusiness = new wsi.schema.una.hpx.hpx_application_request.types.complex.CommercialPackageLineBusinessType()
    var generalLiabilityPolicyLine = new una.integration.mapping.hpx.commercialpackage.generalliability.HPXGLPolicyMapper()
    // If it contains General Liability Line, include the coverages along with the Commercial Property Line Level Coverages
    if(policyPeriod.GLLineExists) {
      var glLineExposures = generalLiabilityPolicyLine.createGeneralLiabilityLineExposures(policyPeriod)
      for (exposure in glLineExposures) { commercialPropertyLineBusiness.addChild(new XmlElement("GLExposure", exposure)) }
    }
    if(policyPeriod.GLLineExists) {
      var glLineCovs = generalLiabilityPolicyLine.createGeneralLiabilityLineCoverages(policyPeriod)
      for (cov in glLineCovs) { commercialPropertyLineBusiness.addChild(new XmlElement("Coverage", cov)) }
    }
    if(policyPeriod.GLLineExists) {
      var glLineExlcs = generalLiabilityPolicyLine.createGeneralLiabilityLineExclusions(policyPeriod)
      for (glLineExlc in glLineExlcs) { commercialPropertyLineBusiness.addChild(new XmlElement("Exclusion", glLineExlc)) }
    }
    if(policyPeriod.GLLineExists) {
      var glLineConds = generalLiabilityPolicyLine.createGeneralLiabilityLinePolicyConditions(policyPeriod)
      for (glLineCond in glLineConds) { commercialPropertyLineBusiness.addChild(new XmlElement("PolicyCondition", glLineCond)) }
    }
    if(policyPeriod.CPLineExists) {
      var cpLineCovs = createCommericalPropertyLineCoverages(policyPeriod)
      for (cov in cpLineCovs) { commercialPropertyLineBusiness.addChild(new XmlElement("Coverage", cov)) }
    }
    if(policyPeriod.CPLineExists) {
      var cpLineExlcs = createCommericalPropertyLineExclusions(policyPeriod)
      for (cpLineExlc in cpLineExlcs) { commercialPropertyLineBusiness.addChild(new XmlElement("Exclusion", cpLineExlc)) }
    }
    if(policyPeriod.CPLineExists) {
      var cpLineConds = createCommericalPropertyLinePolicyConditions(policyPeriod)
      for (cpLineCond in cpLineConds) { commercialPropertyLineBusiness.addChild(new XmlElement("PolicyCondition", cpLineCond)) }
    }
    var questions = createQuestionSet(policyPeriod)
    for (question in questions) {
      commercialPropertyLineBusiness.addChild(new XmlElement("QuestionAnswer", question))
    }
    return commercialPropertyLineBusiness
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

  override function getCoverages(policyPeriod: PolicyPeriod): List<Coverage> {
    return null
  }

  override function getExclusions(policyPeriod: PolicyPeriod): List<Exclusion> {
    return null
  }

  override function getPolicyConditions(policyPeriod: PolicyPeriod): List<PolicyCondition> {
    return null
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<Transaction> {
    return null
  }

  override function getCoverageMapper() : HPXCoverageMapper {
    return null
  }

  override function getStructureMapper() : HPXStructureMapper {
    return null
  }

  override function getClassificationMapper() : HPXClassificationMapper {
    return null
  }

  override function getExclusionMapper() : HPXExclusionMapper {
    return null
  }

  override function getPolicyConditionMapper() : HPXPolicyConditionMapper {
    return null
  }

  override function getStructures(policyPeriod : PolicyPeriod) : java.util.List<Coverable> {
    return null
  }

  override function getLocation(coverable : Coverable) : PolicyLocation {
    return null
  }

  override function getLocationCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return null
  }

  override function getLocationExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion> {
    return null
  }

  override function getLocationPolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition> {
    return null
  }

  override function getLocationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    return null
  }

  override  function getStructureCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage> {
    return null
  }

  override  function getStructureExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion> {
    return null
  }

  override  function getStructurePolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition> {
    return null
  }

  override  function getStructureCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    return null
  }

  override function getScheduleTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    return null
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
    return null
  }

  override function getPolicyLine(policyPeriod : PolicyPeriod) : Coverable {
    return null
  }

  override function getLineCoverages(line : Coverable) : java.util.List<Coverage> {
    return null
  }

  override function getLineExclusions(line : Coverable) : java.util.List<Exclusion> {
    return null
  }

  override function getLinePolicyConditions(line : Coverable) : java.util.List<PolicyCondition> {
    return null
  }

  override function getLineCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction> {
    return null
  }

  override function getDiscountCostType(cost : Cost) :  String {
    return null
  }

  override function getDiscountCostTypes() : String[] {
    return null
  }

  override function getEstimatedInsScoreDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    return null
  }

  override function getEstimatedWindDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    return null
  }

  override function getEstimatedBCEGDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    return null
  }

  override function getEstimatedPremiums(policyPeriod : PolicyPeriod) : List<HPXEstimatedPremium> {
    return null
  }

  override function getHurricaneWindPremium(policyPeriod : PolicyPeriod) : BigDecimal {
    return null
  }
}