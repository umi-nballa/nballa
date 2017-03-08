package una.integration.mapping.hpx.common

uses gw.xml.XmlElement
uses gw.xml.date.XmlDate

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 10/20/16
 * Time: 8:21 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXPrimaryNamedInsuredMapper {
  function createPrimaryNamedInsured(contact : Contact, policyContactRole : PolicyContactRole, entityType : AccountOrgType) : wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalType {
    var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
    var creditScoreMapper = new HPXCreditScoreMapper()
    var role = policyContactRole.Subtype
    var insuredOrPrincipal = new wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalType()
    insuredOrPrincipal.addChild(new XmlElement("GeneralPartyInfo", generalPartyInfoMapper.createGeneralPartyInfo(contact,
        policyContactRole)))
    insuredOrPrincipal.InsuredOrPrincipalInfo.InsuredInterestDesc = ""
    insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.TitleRelationshipCd = entityType.Code
    insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.TitleRelationshipDesc = entityType.Description
    if (contact typeis Person) {
      var dob = contact.DateOfBirth
      if (dob != null) {
        insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.BirthDt = new XmlDate(contact.DateOfBirth)
      }
    }
    insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.MaritalStatusCd = (contact typeis Person) ? contact.MaritalStatus.Code : ""
    insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.MaritalStatusDesc = (contact typeis Person) ? contact.MaritalStatus.Description : ""
    insuredOrPrincipal.InsuredOrPrincipalInfo.InsuredOrPrincipalRoleCd = typekey.PolicyContactRole.TC_POLICYPRINAMEDINSURED.Code
    var principalInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PrincipalInfoType()
    if(policyContactRole.CreditReportsExt != null and policyContactRole.CreditReportsExt.length > 0)   {
      var creditScores = creditScoreMapper.createCreditScoreInfo(policyContactRole.CreditReportsExt)

      for (score in creditScores) {
        principalInfo.addChild(new XmlElement("CreditScoreInfo", score))
      }
    }
    insuredOrPrincipal.InsuredOrPrincipalInfo.addChild(new XmlElement("PrincipalInfo" , principalInfo))
    return insuredOrPrincipal
  }
}