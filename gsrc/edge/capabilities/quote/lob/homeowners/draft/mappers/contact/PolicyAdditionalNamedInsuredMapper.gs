package edge.capabilities.quote.lob.homeowners.draft.mappers.contact

uses java.lang.Integer
uses edge.capabilities.quote.draft.dto.AdditionalNamedInsuredDTO

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/6/17
 * Time: 10:59 AM
 * To change this template use File | Settings | File Templates.
 */
class PolicyAdditionalNamedInsuredMapper extends PolicyContactMapper<PolicyAddlNamedInsured, AdditionalNamedInsuredDTO > {
  override function createContactRole(period: PolicyPeriod, portalIndex: Integer, contact: Contact) {
    var policyAdditionalInsured = period.addNewPolicyAddlNamedInsuredForContact(contact)
    policyAdditionalInsured.ContactDenorm = contact

    policyAdditionalInsured.PortalIndex = portalIndex
  }

  override function updateContactRole(entity: PolicyAddlNamedInsured, dto: AdditionalNamedInsuredDTO) {
    entity.ContactDenorm.DbaName_Ext = dto.DBAName
    entity.ContactRelationship_Ext = dto.RelationshipToPrimaryInsured
    entity.DescOfInterest_HOE = dto.DescriptionOfInterest
  }
}