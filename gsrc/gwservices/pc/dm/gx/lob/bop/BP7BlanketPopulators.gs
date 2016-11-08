package gwservices.pc.dm.gx.lob.bop

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.shared.policy.policylinemodel.anonymous.elements.PolicyLine_Entity_BP7BusinessOwnersLine_Blankets_Entry

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 11/8/16
 * Time: 3:47 AM
 * To change this template use File | Settings | File Templates.
 */
class BP7BlanketPopulators extends BaseEntityPopulator<BP7Blanket, KeyableBean>{

  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : BP7Blanket{
    if (model typeis PolicyLine_Entity_BP7BusinessOwnersLine_Blankets_Entry) {
      var bp7Blanket = new BP7Blanket(Branch)
      return bp7Blanket
    }
    return null
  }

}