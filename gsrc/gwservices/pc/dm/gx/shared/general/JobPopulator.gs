package gwservices.pc.dm.gx.shared.general

uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class JobPopulator extends BaseEntityPopulator<Job, KeyableBean> {
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): Job {
    return Branch.Job
  }

  override function finish(model: XmlElement, parent: KeyableBean, child: Job) {
    super.finish(model, parent, child)
    if (child.MigrationJobInfo_Ext == null) {
      child.MigrationJobInfo_Ext = new MigrationJobInfo_Ext()
    }
  }
}