package una.lob.bp7
/**
 * Created with IntelliJ IDEA.
 * User: svallabhapurapu
 * Date: 9/6/16
 * Time: 8:31 AM
 * To change this template use File | Settings | File Templates.
 */

uses gw.globalization.PolicyLocationAddressAdapter
uses gw.pcf.contacts.AbstractInputSetAddressOwner
uses java.lang.UnsupportedOperationException
uses java.util.Set
uses gw.api.address.AddressOwnerFieldId

class BP7LocationAddressOwner extends AbstractInputSetAddressOwner{

  construct(policyLocation: PolicyLocation) {
    super(policyLocation.AccountLocation.NonSpecific, policyLocation != null ? policyLocation.canChangeState() : false)
    setInternalDelegate(policyLocation)
  }
  /*var _isNonSpecific : boolean
  private static final var ALWAYS_REQUIRED_FIELDS: Set <AddressOwnerFieldId> = { AddressOwnerFieldId.STATE }.freeze()
  private static final var SPECIFIC_REQUIRED_FIELDS: Set <AddressOwnerFieldId> = {
      AddressOwnerFieldId.ADDRESSLINE1,
      AddressOwnerFieldId.CITY,
      AddressOwnerFieldId.POSTALCODE,
      AddressOwnerFieldId.COUNTY
  }.union(ALWAYS_REQUIRED_FIELDS).freeze()*/

  //prevents calling an overridable function from within the constructor
  private static final var requiredFields : Set<AddressOwnerFieldId> = {
      AddressOwnerFieldId.ADDRESSLINE1,
      AddressOwnerFieldId.CITY,
      AddressOwnerFieldId.POSTALCODE,
      AddressOwnerFieldId.COUNTY
  }.freeze()

  private function setInternalDelegate(policyLocation: PolicyLocation) {
    setDelegateInternal(new PolicyLocationAddressAdapter(policyLocation))
  }

  override property get Address(): entity.Address {
    return null
  }

  override property set Address(value: entity.Address) {
    throw new UnsupportedOperationException("Setting Address is not supported.")
  }
  override function isRequired(fieldId : AddressOwnerFieldId) : boolean {
    return requiredFields.contains(fieldId)//RequiredFields.contains(fieldId)
  }

  /*override property get RequiredFields(): Set <AddressOwnerFieldId> {
    return  requiredFields
  }*/

}