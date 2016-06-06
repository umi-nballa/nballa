package una.pageprocess.search

uses gw.api.name.ContactNameOwner
uses gw.api.name.NameOwnerFieldId
uses java.util.Set
uses gw.api.name.ContactNameFields
/**
 * Created with IntelliJ IDEA.
 * User: dvillapakkam
 * Date: 6/4/16
 * Time: 4:25 PM
 * To change this template use File | Settings | File Templates.
 */
class AccountSearchNameOwner_Ext extends ContactNameOwner{

  construct(fields : ContactNameFields) {
    super(fields)
  }

  override property get RequiredFields() : Set<NameOwnerFieldId> {
    return { }.freeze()
  }

  override property get HiddenFields() : Set<NameOwnerFieldId> {
    return {NameOwnerFieldId.PREFIX,NameOwnerFieldId.PARTICLE}
        .freeze()
  }

  override property get ContactNamePhoneticLabel() : String {
    return displaykey.Web.ContactDetail.Company.CompanyNamePhonetic
  }

  override property get ContactNameLabel() : String {
    return displaykey.Web.ContactDetail.Company.CompanyName
  }

  override property get ShowNameSummary() : boolean {
    return false
  }
}