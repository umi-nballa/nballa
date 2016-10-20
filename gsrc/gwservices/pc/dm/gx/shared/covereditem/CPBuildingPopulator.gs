package gwservices.pc.dm.gx.shared.covereditem

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.lob.cpp.cplocationmodel.anonymous.elements.CPLocation_Buildings_Entry
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 9/29/16
 * Time: 8:27 AM
 * To change this template use File | Settings | File Templates.
 */
class CPBuildingPopulator extends BaseEntityPopulator<CPBuilding, KeyableBean> {
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : CPBuilding{
    if (model typeis CPLocation_Buildings_Entry) {
      var b = new CPBuilding(Branch)
      if (parent typeis CPLocation)
        b.CPLocation = parent
      return b
    }
    return null
  }
}