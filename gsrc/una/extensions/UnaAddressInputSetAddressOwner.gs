package una.extensions

uses gw.pcf.contacts.AddressInputSetAddressOwner
/**
 * Created with IntelliJ IDEA.
 * User: sghosh
 * Date: 10/25/16
 * Time: 4:01 PM
 * To change this template use File | Settings | File Templates.
 */
class UnaAddressInputSetAddressOwner extends AddressInputSetAddressOwner{

  construct(theAddress : Address, isNonSpecific : boolean, isMovable : boolean) {
    super(theAddress,isNonSpecific, isMovable)
  }
    override property get SelectedMode() : String {
    return "location"
  }
}