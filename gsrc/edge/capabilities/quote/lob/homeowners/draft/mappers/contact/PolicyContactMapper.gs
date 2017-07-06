package edge.capabilities.quote.lob.homeowners.draft.mappers.contact

uses edge.capabilities.quote.draft.dto.PolicyContactDTO
uses java.lang.Integer

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/6/17
 * Time: 10:46 AM
 * To change this template use File | Settings | File Templates.
 */
abstract class PolicyContactMapper<T extends PolicyContactRole, E extends PolicyContactDTO>{
  public abstract function updateContactRole(entity : T, dto : E)

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

  //public abstract function toDTO(period : PolicyPeriod) : List<E>

//  public function toDTO(period : PolicyPeriod) : List<E>{
//    var results : List<E> = {}
//
//    period.PolicyContactRoles.whereTypeIs(T)?.each( \ role -> {
//      results.add(toDTO(role))
//    })
//
//    return results
//  }

  protected abstract function createContactRole(period : PolicyPeriod, previousIndex : Integer, contact : Contact)
//  protected abstract function toDTO(role : T) : E
}