package gwservices.pc.dm.gx.shared.general

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_CreditInfoExt

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/28/17
 * Time: 3:24 PM
 * To change this template use File | Settings | File Templates.
 */
class CreditInfoExtPopulator extends BaseEntityPopulator<CreditInfoExt, PolicyPeriod>{

  override function create(model: XmlElement, parent: PolicyPeriod, bundle: Bundle): CreditInfoExt {
    if (model typeis PolicyPeriod_CreditInfoExt) {
      var creditInfo = new CreditInfoExt(this.Branch)
      creditInfo.CreditLevel = typekey.CreditLevelExt.get((model.CreditLevel))
      return creditInfo
    }
    return null
   }

  override function findEntity(model: XmlElement, parent: PolicyPeriod, bundle: Bundle): CreditInfoExt {
    return null
  }
}