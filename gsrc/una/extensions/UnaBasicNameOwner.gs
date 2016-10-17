package una.extensions

uses gw.search.BasicNameOwner
uses gw.api.name.NameOwnerFieldId
uses java.util.Set
uses gw.api.name.ContactNameFields
/**
 * Created with IntelliJ IDEA.
 * User: sghosh
 * Date: 10/14/16
 * Time: 5:45 PM
 * To change this template use File | Settings | File Templates.
 */
class UnaBasicNameOwner extends BasicNameOwner{
  construct(fields : ContactNameFields) {
    super(fields)
  }

  override property get HiddenFields() : Set<NameOwnerFieldId> {
    return {NameOwnerFieldId.PREFIX, NameOwnerFieldId.SUFFIX, NameOwnerFieldId.PARTICLE}.freeze()
  }
}