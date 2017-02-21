package gwservices.pc.dm.gx.lob.ho

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.lob.ho.dwelling_hoemodel.anonymous.elements.Dwelling_HOE_DwellingProtectionDetails
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 2/10/17
 * Time: 5:22 AM
 * To change this template use File | Settings | File Templates.
 */
class DwellingProtctnDetailsPopulator extends BaseEntityPopulator<HODwellingProtDetails_Ext,KeyableBean>{

  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): HODwellingProtDetails_Ext {
    if (model typeis Dwelling_HOE_DwellingProtectionDetails) {
      var dwellingProtctnDtls = new HODwellingProtDetails_Ext(Branch)
      return dwellingProtctnDtls
    }
    return null
  }

}