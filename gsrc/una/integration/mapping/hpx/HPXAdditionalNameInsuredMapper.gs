package una.integration.mapping.hpx

uses java.util.ArrayList
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/3/16
 * Time: 2:57 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXAdditionalNameInsuredMapper {

  function createAdditionalNamedInsureds(policyPeriod : PolicyPeriod) : List<wsi.schema.una.hpx.hpx_application_request.InsuredOrPrincipal> {

  var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
  var dwellingPolicyMapper = new HPXDwellingPolicyMapper()
  var additionalNameInsureds = new ArrayList<wsi.schema.una.hpx.hpx_application_request.InsuredOrPrincipal>()
  for (addtlNamedInsured in policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)) {
    var insuredOrPrincipal = new wsi.schema.una.hpx.hpx_application_request.InsuredOrPrincipal()
    insuredOrPrincipal.addChild(dwellingPolicyMapper.createItemIdInfo())
    insuredOrPrincipal.addChild(generalPartyInfoMapper.createGeneralPartyInfo(addtlNamedInsured.AccountContactRole.AccountContact.Contact,
        addtlNamedInsured))
    var insuredOrPrincipleInfo = new wsi.schema.una.hpx.hpx_application_request.InsuredOrPrincipalInfo()
    if (addtlNamedInsured.DescOfInterest_HOE != null) {
      var insuredInterestDesc = new wsi.schema.una.hpx.hpx_application_request.InsuredInterestDesc()
      insuredInterestDesc.setText(addtlNamedInsured.DescOfInterest_HOE)
      insuredOrPrincipleInfo.addChild(insuredInterestDesc)
    }
    if (addtlNamedInsured.Relationship != null) {
      var personInfo = new wsi.schema.una.hpx.hpx_application_request.PersonInfo()
      var titleRelationshipDesc = new wsi.schema.una.hpx.hpx_application_request.TitleRelationshipDesc()
      titleRelationshipDesc.setText(addtlNamedInsured.Relationship)
      personInfo.addChild(titleRelationshipDesc)
      insuredOrPrincipleInfo.addChild(personInfo)
    }
    insuredOrPrincipal.addChild(insuredOrPrincipleInfo)
    additionalNameInsureds.add(insuredOrPrincipal)
  }
  return additionalNameInsureds
}



}