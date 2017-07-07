package edge.capabilities.quote.lob.homeowners.draft.mappers.contact

uses edge.capabilities.quote.draft.dto.AdditionalInsuredDTO
uses java.lang.Integer

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/6/17
 * Time: 2:36 PM
 * To change this template use File | Settings | File Templates.
 */
class PolicyAdditionalInsuredMapper extends PolicyContactMapper<PolicyAddlInsured, AdditionalInsuredDTO> {
  override function updateContactRole(additionalInsured : PolicyAddlInsured, dto: AdditionalInsuredDTO) {
    additionalInsured.PolicyAdditionalInsuredDetails.first().AdditionalInsuredType = dto.Type
  }

  override function createContactRole(period: PolicyPeriod, portalIndex : Integer, contact: Contact) {
    if(period.HomeownersLine_HOEExists){
      var insuredDetail = period.HomeownersLine_HOE.addNewAdditionalInsuredDetailForContact(contact)
      insuredDetail.PolicyAddlInsured.PortalIndex = portalIndex
      insuredDetail.PolicyAddlInsured.ContactDenorm = contact
    }
  }

  override function toDTO(role: PolicyAddlInsured): AdditionalInsuredDTO {
    var result = new AdditionalInsuredDTO()

    result.Type = role.PolicyAdditionalInsuredDetails.first().AdditionalInsuredType

    return result
  }
}