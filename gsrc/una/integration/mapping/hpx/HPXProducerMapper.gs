package una.integration.mapping.hpx
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/5/16
 * Time: 1:05 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXProducerMapper {
  function createProducer(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.Producer {
    var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
    var producer = new wsi.schema.una.hpx.hpx_application_request.Producer()
    var producerInfo = new wsi.schema.una.hpx.hpx_application_request.ProducerInfo()
    var contractNo = new wsi.schema.una.hpx.hpx_application_request.ContractNumber()
    producerInfo.addChild(createProducerRoleCode(policyPeriod))
    producer.addChild(producerInfo)
    producer.addChild(generalPartyInfoMapper.createProducerOrganization(policyPeriod.EffectiveDatedFields.ProducerCode.Organization))
    return producer
  }

  function createProducerRoleCode(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.ProducerRoleCd {
    var producerRoleCode = new wsi.schema.una.hpx.hpx_application_request.ProducerRoleCd()
    // TODO - map producer types
      producerRoleCode.setText("Producer")
    return producerRoleCode
  }



}