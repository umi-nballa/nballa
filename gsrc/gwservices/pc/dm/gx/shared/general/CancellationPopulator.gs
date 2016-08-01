package gwservices.pc.dm.gx.shared.general

uses gw.lang.reflect.ITypeInfo
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class CancellationPopulator extends BaseEntityPopulator<Cancellation,KeyableBean> {
  override function initialize(xmlTypeInfo: ITypeInfo) {
  }

  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): Cancellation {
    return null
  }

  override function create(model: XmlElement, parent: KeyableBean, bundle: Bundle): Cancellation {
    return new Cancellation(bundle)
  }
}