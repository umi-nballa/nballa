package gwservices.pc.dm.gx.shared.covereditem

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.lob.cpp.cpbuildingmodel.anonymous.elements.CPBuilding_Building
uses gwservices.pc.dm.gx.lob.bop.bp7buildingmodel.anonymous.elements.BP7Building_Building
uses java.lang.System

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
      var building = new Building(this.Branch)
      if ( parent typeis CPBuilding){
        parent.Building = building
      }
      return building
    }else if(model typeis BP7Building_Building) {
      var bopBuilding = new Building(this.Branch)
      if ( parent typeis BP7Building){
        parent.Building = bopBuilding
        }
      return bopBuilding
    }
    return null
  }
}