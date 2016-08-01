package gwservices.pc.dm.gx.shared.location

uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.shared.location.policyaddressmodel.anonymous.elements.PolicyAddress_Address

class AddressModelPopulator extends BaseEntityPopulator<entity.Address, KeyableBean> {
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): Address {
    if (parent typeis PolicyAddress and model typeis PolicyAddress_Address) {
      var pniAddresses = getPNIContact(parent).AllAddresses
      return pniAddresses.firstWhere(\address -> address.PublicID == model.PublicID)
    } else {
      return super.findEntity(model, parent, bundle)
    }
  }

  override function create(model: XmlElement, parent: KeyableBean, bundle: Bundle): entity.Address {
    if (parent typeis Account) {
      return parent.newLocation()
    } else if (parent typeis PolicyLocation) {
      return parent.Branch.Policy.Account.newLocation()
    } else if (parent typeis PolicyAddress) {
      // since this address was not found on PNI, add it
      var address = new Address()
      getPNIContact(parent).addAddress(address)
      return address
    } else {
      throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_PARENT, typeof(parent) as String)
    }
  }

  /**
   * Retrieve the PNI contact
   */
  private function getPNIContact(pa: PolicyAddress): Contact {
    return pa.Branch.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact
  }
}