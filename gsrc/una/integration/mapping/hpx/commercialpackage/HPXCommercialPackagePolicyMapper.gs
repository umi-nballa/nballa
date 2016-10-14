package una.integration.mapping.hpx.commercialpackage

uses una.integration.mapping.hpx.common.HPXPolicyMapper
uses una.integration.mapping.hpx.commercialpackage.commercialproperty.HPXCPPolicyMapper
uses una.integration.mapping.hpx.common.HPXLocationMapper
uses una.integration.mapping.hpx.common.HPXAdditionalNameInsuredMapper
uses una.integration.mapping.hpx.commercialpackage.generalliability.HPXGLPolicyMapper
uses una.integration.mapping.hpx.common.HPXProducerMapper
uses gw.xml.XmlElement
uses una.integration.mapping.hpx.common.HPXAdditionalInsuredMapper
uses una.integration.mapping.hpx.commercialpackage.commercialproperty.HPXCPCoverageMapper
uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses una.integration.mapping.hpx.commercialpackage.generalliability.HPXGLCoverageMapper

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
    commercialPackagePolicy.addChild(new XmlElement("PolicySummaryInfo", commercialPropertyPolicyLine.createPolicySummaryInfo(policyPeriod)))
    commercialPackagePolicy.addChild(new XmlElement("CommercialPackageLineBusiness", commercialPropertyPolicyLine.createCommercialPropertyLineBusiness(policyPeriod)))
    return commercialPackagePolicy
  }

  override function getCoverages(policyPeriod: PolicyPeriod): List<Coverage> {
    return null
  }

  override function getTransactions(policyPeriod: PolicyPeriod): List<Transaction> {
    return null
  }

  override function getCostCoverage(cost : Cost) : Coverage {
    var result : Coverage

    switch(typeof cost){
      case GLCost:
          result = cost.Coverage
          break
      case CPCost:
          result = cost.Coverage
          break
    }
    return result
  }

  override function getCoverageMapper() : HPXCoverageMapper {
    return new HPXGLCoverageMapper()
  }
}