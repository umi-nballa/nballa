package gwservices.pc.dm.gx.shared.general

uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class HistoryPopulator extends BaseEntityPopulator<History, KeyableBean> {
  override function create(model: XmlElement, parent: KeyableBean, bundle: Bundle): History {
    var customType = findElement(History#CustomType, model).SimpleValue.GosuValue as CustomHistoryType
    if (parent typeis Account) {
      return parent.createCustomHistoryEvent(customType, null)
    } else if (parent typeis Policy) {
      var historyEvent = parent.createCustomHistoryEvent(customType, null)
      historyEvent.PolicyTerm = parent.LatestPeriod.PolicyTerm
      return historyEvent
    } else {
      throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_PARENT, typeof(parent) as String)
    }
  }

  override function populate(model: XmlElement, entity: History) {
    super.populate(model, entity)
    if (entity typeis History) {
      entity.User = findUser(model)
    }
  }

  override function addToParent(parent: KeyableBean, child: History, name: String, childModel: XmlElement) {
    // this should already be done
  }
}
