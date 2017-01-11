package gwservices.pc.dm.gx.lob.bop

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.lob.bop.bp7buildingmodel.anonymous.elements.BP7Building_BldgUnits_Entry

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 1/5/17
 * Time: 10:04 AM
 * To change this template use File | Settings | File Templates.
 */
class BP7BldngUnitsPopulator extends BaseEntityPopulator<BuildingUnits_Ext, KeyableBean>{
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : BuildingUnits_Ext{
    if (model typeis BP7Building_BldgUnits_Entry) {
      var bp7BldngUnts = new BuildingUnits_Ext(Branch)
      return bp7BldngUnts
    }
    return null
  }
}