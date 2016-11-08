package gwservices.pc.dm.gx.lob.bop

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.shared.policy.policylinemodel.anonymous.elements.PolicyLine_Entity_BP7BusinessOwnersLine_AllClassifications_Entry

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 11/8/16
 * Time: 3:01 AM
 * To change this template use File | Settings | File Templates.
 */
class BP7AllClassificationPopulator extends BaseEntityPopulator<BP7Classification, KeyableBean>{

  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle) : BP7Classification{
    if (model typeis PolicyLine_Entity_BP7BusinessOwnersLine_AllClassifications_Entry) {
      var bp7AllClassification = new BP7Classification(Branch)
      return bp7AllClassification
    }
    return null
  }
}