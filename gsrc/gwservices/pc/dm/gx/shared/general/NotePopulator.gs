package gwservices.pc.dm.gx.shared.general

uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class NotePopulator extends BaseEntityPopulator<Note, KeyableBean> {
  override function create(model: XmlElement, parent: KeyableBean, bundle: Bundle): Note {
    if (parent typeis Account) {
      return parent.newNote()
    } else if (parent typeis PolicyPeriod) {
      return parent.newNote()
    } else {
      throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
    }
  }
}