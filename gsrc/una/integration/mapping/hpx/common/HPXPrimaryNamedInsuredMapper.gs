package una.integration.mapping.hpx.common
uses java.util.ArrayList
uses gw.xml.XmlElement
uses gw.xml.date.XmlDate
uses java.util.Date

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
    insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.TitleRelationshipCd = entityType
    insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.TitleRelationshipDesc = entityType.Description
    insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.BirthDt = (contact typeis Person) ? new XmlDate(contact.DateOfBirth) : new XmlDate(new Date().addYears(-100))
    insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.MaritalStatusCd = (contact typeis Person) ? contact.MaritalStatus : ""
    insuredOrPrincipal.InsuredOrPrincipalInfo.PersonInfo.MaritalStatusDesc = (contact typeis Person) ? contact.MaritalStatus.Description : ""
    insuredOrPrincipal.InsuredOrPrincipalInfo.InsuredOrPrincipalRoleCd = typekey.PolicyContactRole.TC_POLICYPRINAMEDINSURED
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