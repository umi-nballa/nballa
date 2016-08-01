package gwservices.pc.dm.gx.shared.location

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.lang.reflect.ITypeInfo
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement

class PolicyAddressPopulator extends BaseEntityPopulator<PolicyAddress, PolicyPeriod> {
  override function initialize(xmlTypeInfo: ITypeInfo) {
  }

  override function findEntity(model: XmlElement, parent: PolicyPeriod, bundle: Bundle): PolicyAddress {
    return parent.PolicyAddress
  }

  override function create(model: XmlElement, parent: PolicyPeriod, bundle: Bundle): PolicyAddress {
    return new PolicyAddress(parent)
  }

  override function addToParent(parent: PolicyPeriod, child: PolicyAddress, name: String, childModel: XmlElement) {
    parent.changePolicyAddressTo(child.Address)
  }
}