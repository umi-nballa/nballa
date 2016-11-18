package una.integration.mapping.hpx.common

uses java.util.ArrayList
uses gw.xml.XmlElement

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/3/16
 * Time: 8:15 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXAdditionalInterestMapper {

function createAdditionalInterests(additlInterests : AddlInterestDetail []) : List<wsi.schema.una.hpx.hpx_application_request.types.complex.AdditionalInterestType>  {

    var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
    var additionalInterests = new ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.AdditionalInterestType>()

    for (addtlInterest in additlInterests) {
      var additionalInterest = new wsi.schema.una.hpx.hpx_application_request.types.complex.AdditionalInterestType()
      additionalInterest.addChild(new XmlElement("GeneralPartyInfo", generalPartyInfoMapper.createGeneralPartyInfo(addtlInterest.PolicyAddlInterest.AccountContactRole.AccountContact.Contact,
          addtlInterest.PolicyAddlInterest)))
      var additionalInterestInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.AdditionalInterestInfoType()
      additionalInterestInfo.NatureInterestCd = addtlInterest.AdditionalInterestType.Code
      additionalInterestInfo.Description = addtlInterest.AdditionalInterestType.Description
      additionalInterestInfo.ContractNumber = addtlInterest.ContractNumber
      additionalInterest.addChild(new XmlElement("AdditionalInterestInfo", additionalInterestInfo))
      additionalInterests.add(additionalInterest)
    }
    return additionalInterests
  }
}