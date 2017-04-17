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

  var _addressScrub_Ext: boolean = true
  var _policyLocation: PolicyLocation as PolicyLocation

  public var pperiod : PolicyPeriod
  construct(policyLocation: PolicyLocation) {
    super(policyLocation)

    this._policyLocation = policyLocation
  }

  construct(policyLocation: PolicyLocation,period:PolicyPeriod) {
    super(policyLocation)
    pperiod = period
    this._policyLocation = policyLocation
  }


  override property get SelectedMode() : String {
    return "location"
  }

  public property get AddressScrub_Ext(): boolean{
    return this._addressScrub_Ext
  }

  public property set AddressScrub_Ext(value:boolean){
    this._addressScrub_Ext = value
  }

}