package gwservices.pc.dm.gx.lob.bop

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.lob.bop.bp7buildingmodel.anonymous.elements.BP7Building_Classifications_Entry

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 10/25/16
 * Time: 9:06 AM
 * To change this template use File | Settings | File Templates.
 */
class BP7classificationPopulator extends BaseEntityPopulator<BP7Classification, KeyableBean >{

  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : BP7Classification{
      if(model typeis BP7Building_Classifications_Entry){
        var bp7Classification = new BP7Classification(Branch)
        if(parent typeis BP7Building)
          bp7Classification.Building = parent

        return bp7Classification
      }
      return null
  }

}