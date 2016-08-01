package gwservices.pc.dm.gx.shared.general

uses gw.lang.reflect.ITypeInfo
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class ReinstatementPopulator extends BaseEntityPopulator<Reinstatement, KeyableBean> {
  override function initialize(xmlTypeInfo: ITypeInfo) {
  }

  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): Reinstatement {
    return null
  }

  override function create(model: XmlElement, parent: KeyableBean, bundle: Bundle): Reinstatement {
    return new Reinstatement(bundle)
  }
}