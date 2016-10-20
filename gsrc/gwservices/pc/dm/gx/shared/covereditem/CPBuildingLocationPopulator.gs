package gwservices.pc.dm.gx.shared.covereditem

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.lob.cpp.cpbuildingmodel.anonymous.elements.CPBuilding_CPLocation

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 9/30/16
 * Time: 10:10 AM
 * To change this template use File | Settings | File Templates.
 */
class CPBuildingLocationPopulator extends BaseEntityPopulator<CPLocation, KeyableBean >{
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : CPLocation{
    if (model typeis CPBuilding_CPLocation) {
      return CPLocation(Branch)
    }
    return null
  }

}