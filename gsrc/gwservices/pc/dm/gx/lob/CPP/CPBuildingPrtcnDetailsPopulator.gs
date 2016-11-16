package gwservices.pc.dm.gx.lob.CPP

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.lob.cpp.cpbuildingmodel.anonymous.elements.CPBuilding_ProtectionDetails

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 11/8/16
 * Time: 2:35 AM
 * To change this template use File | Settings | File Templates.
 */
class CPBuildingPrtcnDetailsPopulator extends BaseEntityPopulator<CPProtDetails_Ext, KeyableBean >{

  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : CPProtDetails_Ext{
    if (model typeis CPBuilding_ProtectionDetails) {
      var cpPrtcnDtls = new CPProtDetails_Ext(Branch)
      return cpPrtcnDtls
    }
    return null
  }

}