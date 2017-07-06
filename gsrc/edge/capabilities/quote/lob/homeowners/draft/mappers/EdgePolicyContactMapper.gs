package edge.capabilities.quote.lob.homeowners.draft.mappers

uses java.lang.Comparable
uses edge.capabilities.quote.draft.dto.PolicyContactDTO
uses java.lang.Integer
uses edge.capabilities.policycommon.accountcontact.IAccountContactPlugin
uses edge.capabilities.policychange.lob.homeowners.draft.dto.DwellingAdditionalInterestDTO
uses java.lang.UnsupportedOperationException
uses edge.capabilities.policycommon.accountcontact.dto.AccountContactDTO
uses edge.capabilities.quote.lob.homeowners.draft.mappers.contact.PolicyContactMapper
uses edge.capabilities.quote.lob.homeowners.draft.mappers.contact.PolicyAdditionalNamedInsuredMapper
uses edge.capabilities.quote.lob.homeowners.draft.mappers.contact.PolicyAdditionalInterestMapper
uses edge.capabilities.quote.draft.dto.AdditionalNamedInsuredDTO

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
  private var _toDTO : block(role : T) : E
  private var _contactPlugin : IAccountContactPlugin

  construct(contactPlugin : IAccountContactPlugin){
    _contactPlugin = contactPlugin
    _mapper = getPolicyContactMapper()

    if(T.Type == entity.PolicyAddlInterest){
      _toDTO = \ a -> {return toAdditionalInterestDTO(a)}
    }else if(T.Type == PolicyAddlNamedInsured){
      _toDTO = \ a -> {return toAdditionalNamedInsuredDTO(a)}
    }else{
      throw new UnsupportedOperationException("Type of Policy Contact Role is not supported.")
    }
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
  }

  public function fillBaseProperties(period : PolicyPeriod) : List<E>{
    var results : List<E> = {}

    period.PolicyContactRoles.whereTypeIs(T)?.each( \ role -> {
      results.add(_toDTO(role))
    })

    return results
  }

  private function toAdditionalNamedInsuredDTO(role: T) : E{
    var result : E

    result.Contact = mapContactDetails(role.ContactDenorm)
    (result as AdditionalNamedInsuredDTO ).RelationshipToPrimaryInsured = (role as PolicyAddlNamedInsured).ContactRelationship_Ext

    return result
  }

  private function toAdditionalInterestDTO(role : T) : E{
    var result : E

    result.Contact = mapContactDetails(role.ContactDenorm)
    (result as DwellingAdditionalInterestDTO).ContractNumber = (role as PolicyAddlInterest).AdditionalInterestDetails.first().ContractNumber
    (result as DwellingAdditionalInterestDTO).Type = (role as PolicyAddlInterest).AdditionalInterestDetails.first().AdditionalInterestType
    (result as DwellingAdditionalInterestDTO).InterestTypeIfOther = (role as PolicyAddlInterest).AdditionalInterestDetails.first().InterestTypeIfOther_Ext
    (result as DwellingAdditionalInterestDTO).Description = ((role as PolicyAddlInterest).AdditionalInterestDetails.first() as HODwellingAddlInt_HOE).AddlInterestDesc
    (result as DwellingAdditionalInterestDTO).CertificateRequired = (role as PolicyAddlInterest).AdditionalInterestDetails.first().CertRequired
    (result as DwellingAdditionalInterestDTO).EffectiveDate = ((role as PolicyAddlInterest).AdditionalInterestDetails.first() as HODwellingAddlInt_HOE).AddlIntEffDate
    (result as DwellingAdditionalInterestDTO).IsVestingInfoRequired = (role as PolicyAddlInterest).AdditionalInterestDetails.first().VestingInfoRequired_Ext
    (result as DwellingAdditionalInterestDTO).VestingInfo = (role as PolicyAddlInterest).AdditionalInterestDetails.first().VestingInfo_Ext

    return result
  }

  private function mapContactDetails(contact : Contact) : AccountContactDTO{
    return _contactPlugin.toDTO(contact)
  }

  private function getPolicyContactMapper() : PolicyContactMapper{
    var result : PolicyContactMapper

    if(T.Type == PolicyAddlNamedInsured){
      result = new PolicyAdditionalNamedInsuredMapper()
    }else if(T.Type == PolicyAddlInterest){
      result = new PolicyAdditionalInterestMapper()
    }

    return result
  }
}