package gwservices.pc.dm.gx.lob.CPP

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.lob.cpp.cpbuildingmodel.anonymous.elements.CPBuilding_AdditionalInterests_Entry

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 10/20/16
 * Time: 7:18 AM
 * To change this template use File | Settings | File Templates.
 */
class CPBldngAddlPopulator extends BaseEntityPopulator<CPBldgAddlInterest, KeyableBean>{
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : CPBldgAddlInterest{
    if (model typeis CPBuilding_AdditionalInterests_Entry) {
      var cpAddlIntrst = new CPBldgAddlInterest(Branch)
      if(parent typeis CPBuilding)
        cpAddlIntrst.CPBuilding = parent
      return cpAddlIntrst
    }
    return null
  }

}