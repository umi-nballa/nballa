package gwservices.pc.dm.gx.shared.general

uses gw.lang.reflect.ITypeInfo
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class UserPopulator extends BaseEntityPopulator<User, KeyableBean> {
  override function initialize(xmlTypeInfo: ITypeInfo) {
  }

  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): User {
    return findUser(model)
  }

  override function create(model: XmlElement, parent: KeyableBean, bundle: Bundle): User {
    var msg = "missing user for " + model.asUTFString()
    throw new DataMigrationNonFatalException(CODE.MISSING_STATIC_ENTITY, msg)
  }
}
