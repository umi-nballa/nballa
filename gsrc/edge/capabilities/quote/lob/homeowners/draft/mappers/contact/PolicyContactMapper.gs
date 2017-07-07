package edge.capabilities.quote.lob.homeowners.draft.mappers.contact

uses edge.capabilities.quote.draft.dto.PolicyContactDTO
uses java.lang.Integer
uses edge.capabilities.policycommon.accountcontact.IAccountContactPlugin

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/6/17
 * Time: 10:46 AM
 * To change this template use File | Settings | File Templates.
 */
abstract class PolicyContactMapper<T extends PolicyContactRole, E extends PolicyContactDTO>{
  public abstract function updateContactRole(entity : T, dto : E)

  public function toDTO(period: PolicyPeriod, contactPlugin : IAccountContactPlugin): List<E> {
    var results : List<E> = {}

    period.PolicyContactRoles.whereTypeIs(T)?.each( \ contact -> {
      var dto = toDTO(contact)
      dto.Contact = contactPlugin.toDTO(contact.ContactDenorm)
      results.add(dto)
    })

    return results
  }

  public function createContact(period: PolicyPeriod, previousIndex: Integer, dto: E) : Contact{
    var result : Contact

    if(dto.Contact.Subtype?.equalsIgnoreCase("Person")){
      result = new Person()
    }else if(dto.Contact.Subtype?.equalsIgnoreCase("Company")){
      result = new Company()
    }

    createContactRole(period, (previousIndex != null) ? previousIndex + 1 : 0, result)

    return result
  }

  protected abstract function createContactRole(period : PolicyPeriod, portalIndex : Integer, contact : Contact)
  protected abstract function toDTO(role : T) : E
}