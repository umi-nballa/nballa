package una.extensions

uses  gw.pcf.accountlocation.AccountLocationAddressOwner
/**
 * Created with IntelliJ IDEA.
 * User: sghosh
 * Date: 10/24/16
 * Time: 6:25 PM
 * To change this template use File | Settings | File Templates.
 */
class UnaAccountLocationAddressOwner extends AccountLocationAddressOwner{
  construct(accountLocation: AccountLocation) {
    super(accountLocation)
  }

  override property get SelectedMode() : String {
  return "location"
}
}