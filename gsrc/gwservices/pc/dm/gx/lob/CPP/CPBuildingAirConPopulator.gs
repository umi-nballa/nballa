package gwservices.pc.dm.gx.lob.CPP

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.lob.cpp.cpbuildingmodel.anonymous.elements.CPBuilding_AirCondProt

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 11/8/16
 * Time: 2:46 AM
 * To change this template use File | Settings | File Templates.
 */
class CPBuildingAirConPopulator extends BaseEntityPopulator<CPAirCondProt_Ext, KeyableBean>{

    override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : CPAirCondProt_Ext{
  if (model typeis CPBuilding_AirCondProt) {
  var cpAirCondProt = new CPAirCondProt_Ext(Branch)
  return cpAirCondProt
  }
  return null
  }
}