package gwservices.pc.dm.gx.shared.policy

uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class PolicyPopulator extends BaseEntityPopulator<Policy, PolicyPeriod> {
  override function findEntity(model: XmlElement, parent: PolicyPeriod, bundle: Bundle): Policy {
    return parent.Policy
  }
}