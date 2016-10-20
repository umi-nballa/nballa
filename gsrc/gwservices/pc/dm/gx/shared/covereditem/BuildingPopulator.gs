package gwservices.pc.dm.gx.shared.covereditem

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.lob.cpp.cpbuildingmodel.anonymous.elements.CPBuilding_Building

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 9/29/16
 * Time: 8:42 AM
 * To change this template use File | Settings | File Templates.
 */
class BuildingPopulator extends BaseEntityPopulator<Building, KeyableBean> {
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : Building{
    if (model typeis CPBuilding_Building) {
      return new Building(Branch)
    }
    return null
  }
}