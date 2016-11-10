package gwservices.pc.dm.gx.shared.product

uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.shared.policy.policylinemodel.anonymous.elements.PolicyLine_Entity_GeneralLiabilityLine_GLExposuresWM_Entry
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 11/8/16
 * Time: 2:24 AM
 * To change this template use File | Settings | File Templates.
 */
class GLExposurePopulator extends BaseEntityPopulator<GLExposure, KeyableBean >{


  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): GLExposure {

    if(model typeis PolicyLine_Entity_GeneralLiabilityLine_GLExposuresWM_Entry) {
       var glExp = new GLExposure(Branch)
       return glExp
    }
    return null
  }
}