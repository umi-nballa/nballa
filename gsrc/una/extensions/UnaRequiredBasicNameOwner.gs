package una.extensions

uses java.util.Set
uses gw.api.name.RequiredBasicNameOwner
uses gw.api.name.NameOwnerFieldId
uses gw.api.name.ContactNameFields

/**
 * Extended for UNA
*/
@Export
class UnaRequiredBasicNameOwner extends RequiredBasicNameOwner {
  construct(fields : ContactNameFields) {
    super(fields)
  }

  override property get HiddenFields() : Set<NameOwnerFieldId> {
    return {NameOwnerFieldId.PREFIX}.freeze()
  }

}