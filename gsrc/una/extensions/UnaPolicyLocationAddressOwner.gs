package una.extensions

uses gw.pcf.policylocation.PolicyLocationAddressOwner
uses gw.globalization.PolicyLocationAddressAdapter
uses gw.pcf.contacts.AbstractInputSetAddressOwner
/**
 * Created with IntelliJ IDEA.
 * User: sghosh
 * Date: 10/24/16
 * Time: 6:03 PM
 * To change this template use File | Settings | File Templates.
 */
class UnaPolicyLocationAddressOwner extends PolicyLocationAddressOwner{
  construct(policyLocation: PolicyLocation) {
    super(policyLocation)
  }

  override property get SelectedMode() : String {
    return "location"
  }
}