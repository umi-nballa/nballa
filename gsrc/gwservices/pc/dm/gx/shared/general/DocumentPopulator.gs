package gwservices.pc.dm.gx.shared.general

uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class DocumentPopulator extends BaseEntityPopulator<Document, Account> {
  override function addToParent(parent: Account, child: Document, name: String, childModel: XmlElement) {
    child.Level = parent
  }
}