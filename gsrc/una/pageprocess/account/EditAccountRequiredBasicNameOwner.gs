package una.pageprocess.account

uses java.util.Set
uses gw.search.BasicNameOwner
uses gw.api.name.ContactNameFields
uses gw.api.name.NameOwnerFieldId

@Export
class EditAccountRequiredBasicNameOwner extends BasicNameOwner {

  construct(fields : ContactNameFields) {
    super(fields)
  }

  override property get RequiredFields() : Set<NameOwnerFieldId> {
    return { NameOwnerFieldId.LASTNAME }.freeze()
  }

  override property get HiddenFields() : Set<NameOwnerFieldId> {
    return {NameOwnerFieldId.PREFIX}.freeze()
  }
}