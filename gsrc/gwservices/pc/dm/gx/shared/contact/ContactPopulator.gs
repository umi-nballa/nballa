package gwservices.pc.dm.gx.shared.contact

uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class ContactPopulator extends BaseEntityPopulator {
  override function addToParent(parent: KeyableBean, child: KeyableBean, name: String, childModel: XmlElement) {
    // the is an enhancement XML element to insert contacts into the database. There is no attachment to parent necessary
  }
}