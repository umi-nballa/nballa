package edge.capabilities.quote.lob.homeowners.draft.mappers

uses java.lang.Comparable
uses edge.capabilities.quote.draft.dto.PolicyContactDTO
uses java.lang.Integer
uses edge.capabilities.policycommon.accountcontact.IAccountContactPlugin
uses edge.capabilities.quote.lob.homeowners.draft.mappers.contact.PolicyContactMapper
uses edge.capabilities.quote.lob.homeowners.draft.mappers.contact.PolicyAdditionalNamedInsuredMapper
uses edge.capabilities.quote.lob.homeowners.draft.mappers.contact.PolicyAdditionalInterestMapper
uses edge.capabilities.quote.lob.homeowners.draft.mappers.contact.PolicyAdditionalInsuredMapper

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/30/17
 * Time: 12:41 PM
 * To change this template use File | Settings | File Templates.
 */
class EdgePolicyContactMapper<T extends PolicyContactRole, E extends PolicyContactDTO> {
  private static final var PORTAL_INDEX_FIELD_NAME = "PortalIndex"
  private var _mapper : PolicyContactMapper
  private var _contactPlugin : IAccountContactPlugin

  construct(contactPlugin : IAccountContactPlugin){
    _contactPlugin = contactPlugin
    _mapper = getPolicyContactMapper()
  }

  public function updateFrom(period : PolicyPeriod, dtos : List<E>){
    var contactRoles = period.PolicyContactRoles.whereTypeIs(T.Type).orderBy(\ role -> role.getFieldValue(PORTAL_INDEX_FIELD_NAME) as Comparable)
    var entityCount = contactRoles.Count
    var dtoCount = dtos.Count

    if(dtoCount > entityCount){
      for(i in entityCount..dtoCount - 1){
        _mapper.createContact(period, contactRoles?.last()?.getFieldValue(PORTAL_INDEX_FIELD_NAME) as Integer, dtos[i])
      }
    }else if(dtoCount < entityCount){
      for(i in dtoCount..entityCount - 1){
        contactRoles[i].remove()
      }
    }

    contactRoles = period.PolicyContactRoles.whereTypeIs(T.Type).orderBy(\ role -> role.getFieldValue(PORTAL_INDEX_FIELD_NAME) as Comparable)

    dtos?.eachWithIndex( \ dto, i -> {
      _contactPlugin.updateContact(contactRoles[i].ContactDenorm, dto.Contact)
      _mapper.updateContactRole(contactRoles[i], dto)
    })

    //renumber portal indices after updating
    var newIndex = 0
    contactRoles.each( \ contactRole -> {
      contactRole.setFieldValue(PORTAL_INDEX_FIELD_NAME, newIndex)
      newIndex++
    })
  }

  public function fillBaseProperties(period : PolicyPeriod) : List<PolicyContactDTO>{
    return _mapper.toDTO(period, _contactPlugin)
  }

  private function getPolicyContactMapper() : PolicyContactMapper{
    var result : PolicyContactMapper

    if(T.Type == PolicyAddlNamedInsured){
      result = new PolicyAdditionalNamedInsuredMapper()
    }else if(T.Type == PolicyAddlInterest){
      result = new PolicyAdditionalInterestMapper()
    }else if(T.Type == PolicyAddlInsured){
      result = new PolicyAdditionalInsuredMapper()
    }

    return result
  }
}