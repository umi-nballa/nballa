package una.integration.mapping.hpx.common

uses java.util.ArrayList
uses gw.xml.XmlElement
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 10/4/16
 * Time: 5:38 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXAdditionalInsuredMapper {
  function createAdditionalInsureds(policyPeriod : PolicyPeriod) : List<wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalType> {
    var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
    var creditScoreMapper = new HPXCreditScoreMapper()
    var additionalInsureds = new ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalType>()
    for (addtlInsured in policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlInsured).PolicyAdditionalInsuredDetails) {
      var insuredOrPrincipal = new wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalType()
      insuredOrPrincipal.addChild(new XmlElement("GeneralPartyInfo", generalPartyInfoMapper.createGeneralPartyInfo(addtlInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact,
          addtlInsured.PolicyAddlInsured)))
      insuredOrPrincipal.InsuredOrPrincipalInfo.InsuredInterestDesc = ""
      insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.TitleRelationshipCd = addtlInsured.AdditionalInsuredType
      insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.TitleRelationshipDesc = addtlInsured.AdditionalInsuredType.Description
      insuredOrPrincipal.InsuredOrPrincipalInfo.InsuredOrPrincipalRoleCd = typekey.PolicyContactRole.TC_POLICYADDLINSURED
      var creditScores = creditScoreMapper.createCreditScoreInfo(addtlInsured.PolicyAddlInsured.CreditReportsExt)
      var principalInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PrincipalInfoType()
      for (score in creditScores) {
        principalInfo.addChild(new XmlElement("CreditScoreInfo", score))
      }
      insuredOrPrincipal.InsuredOrPrincipalInfo.addChild(new XmlElement("PrincipalInfo" , principalInfo))
      additionalInsureds.add(insuredOrPrincipal)
    }
    return additionalInsureds
  }
}