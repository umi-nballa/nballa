package una.integration.mapping.hpx.common

uses java.util.ArrayList
uses gw.xml.XmlElement

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/3/16
 * Time: 2:57 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXAdditionalNameInsuredMapper {

  function createAdditionalNamedInsureds(policyPeriod : PolicyPeriod) : List<wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalType> {
    var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
    var creditScoreMapper = new HPXCreditScoreMapper()
    var additionalNameInsureds = new ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalType>()
    for (addtlNamedInsured in policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)) {
      var insuredOrPrincipal = new wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalType()
      insuredOrPrincipal.addChild(new XmlElement("GeneralPartyInfo", generalPartyInfoMapper.createGeneralPartyInfo(addtlNamedInsured.AccountContactRole.AccountContact.Contact,
      addtlNamedInsured)))
      insuredOrPrincipal.InsuredOrPrincipalInfo.InsuredInterestDesc = addtlNamedInsured.DescOfInterest_HOE != null ? addtlNamedInsured.DescOfInterest_HOE : ""
      insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.TitleRelationshipCd = ""
      insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.TitleRelationshipDesc = addtlNamedInsured.ContactRelationship_Ext != null ? addtlNamedInsured.ContactRelationship_Ext.DisplayName : ""
      insuredOrPrincipal.InsuredOrPrincipalInfo.InsuredOrPrincipalRoleCd = typekey.PolicyContactRole.TC_POLICYADDLNAMEDINSURED
      var creditScores = creditScoreMapper.createCreditScoreInfo(addtlNamedInsured.CreditReportsExt)
      var principalInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PrincipalInfoType()
      for (score in creditScores) {
        principalInfo.addChild(new XmlElement("CreditScoreInfo", score))
      }
      insuredOrPrincipal.InsuredOrPrincipalInfo.addChild(new XmlElement("PrincipalInfo" , principalInfo))
      additionalNameInsureds.add(insuredOrPrincipal)
    }
    return additionalNameInsureds
}



}