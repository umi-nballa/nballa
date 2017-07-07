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

  override function toDTO(period: PolicyPeriod): List<AdditionalNamedInsuredDTO> {
    var results : List<AdditionalNamedInsuredDTO> = {}

    period.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)?.each( \ additionalNamedInsured -> {
      results.add(toDTO(additionalNamedInsured))
    })

    return results
  }

  override function toDTO(role: PolicyAddlNamedInsured): AdditionalNamedInsuredDTO {
    var result : AdditionalNamedInsuredDTO

    result.RelationshipToPrimaryInsured = role.ContactRelationship_Ext
    result.DescriptionOfInterest = role.DescOfInterest_HOE
    result.DBAName = role.ContactDenorm.DbaName_Ext

    return result
  }
}