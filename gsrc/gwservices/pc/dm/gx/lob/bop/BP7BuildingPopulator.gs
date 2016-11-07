package gwservices.pc.dm.gx.lob.bop

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.lob.bop.bp7locationmodel.anonymous.elements.BP7Location_Buildings_Entry

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 10/25/16
 * Time: 9:00 AM
 * To change this template use File | Settings | File Templates.
 */
class BP7BuildingPopulator extends BaseEntityPopulator<BP7Building, KeyableBean> {
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : BP7Building{
    if (model typeis BP7Location_Buildings_Entry) {
      var bp7Building = new BP7Building(Branch)
      if (parent typeis BP7Location)
        bp7Building.Location = parent
      return bp7Building
    }
    return null
  }

}