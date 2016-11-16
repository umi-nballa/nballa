package gwservices.pc.dm.gx.lob.bop

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.shared.policy.policylinemodel.anonymous.elements.PolicyLine_Entity_BP7BusinessOwnersLine_BP7Locations_Entry

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 10/25/16
 * Time: 8:45 AM
 * To change this template use File | Settings | File Templates.
 */
class BP7LocationPopulator extends BaseEntityPopulator<BP7Location, KeyableBean> {

  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : BP7Location{
    if (model typeis PolicyLine_Entity_BP7BusinessOwnersLine_BP7Locations_Entry) {
      var bp7Loc = new BP7Location(Branch)
      if(parent typeis BP7BusinessOwnersLine)
        bp7Loc.Line = parent
      return bp7Loc
    }
    return null
  }

}