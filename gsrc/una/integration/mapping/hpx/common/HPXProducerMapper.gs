package una.integration.mapping.hpx.common

uses gw.xml.XmlElement


/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/5/16
 * Time: 1:05 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXProducerMapper {
  function createProducer(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.ProducerType {
    var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
    var producer = new wsi.schema.una.hpx.hpx_application_request.types.complex.ProducerType()
    producer.ProducerInfo.ProducerRoleCd = "Producer" // TODO - map producer types
    producer.addChild(new XmlElement("GeneralPartyInfo",generalPartyInfoMapper.createProducerOrganization(policyPeriod.EffectiveDatedFields.ProducerCode.Organization)))
    return producer
  }
 /*
  function createProducerTierInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.PolicyInfo {
    var policyInfo = new wsi.schema.una.hpx.hpx_application_request.PolicyInfo()
    var tier = new wsi.schema.una.hpx.hpx_application_request.TierCd()
    var tierDesc = new wsi.schema.una.hpx.hpx_application_request.TierDesc()
    var org = policyPeriod.EffectiveDatedFields.ProducerCode.Organization
    if(org.tier != null) {
      tier.setText(org.Tier)
      tierDesc.setText(org.Tier.Description)
      policyInfo.addChild(tier)
      policyInfo.addChild(tierDesc)
    }
    return policyInfo
  }


  function createProducerBranchInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.PolicyInfo {
    var policyInfo = new wsi.schema.una.hpx.hpx_application_request.PolicyInfo()
    if (policyPeriod.EffectiveDatedFields.ProducerCode.Branch != null) {
      var branch = new wsi.schema.una.hpx.hpx_application_request.BranchDesc()
      branch.setText(policyPeriod.EffectiveDatedFields.ProducerCode.Branch)
      policyInfo.addChild(branch)
    }
    return policyInfo
  }
 */
}