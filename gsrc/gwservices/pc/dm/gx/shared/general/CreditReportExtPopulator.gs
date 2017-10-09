package gwservices.pc.dm.gx.shared.general

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_CreditInfoExt
uses gwservices.pc.dm.gx.shared.general.creditinfoextmodel.anonymous.elements.CreditInfoExt_CreditReport

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/29/17
 * Time: 1:36 PM
 * To change this template use File | Settings | File Templates.
 */
class CreditReportExtPopulator extends BaseEntityPopulator<CreditReportExt, CreditInfoExt> {

  override function create(model: XmlElement, parent: CreditInfoExt, bundle: Bundle): CreditReportExt {
    if (model typeis CreditInfoExt_CreditReport) {
      var creditReport = new CreditReportExt(this.Branch)
      creditReport.CreditScore = model.CreditScore
      return creditReport
    }
    return null
  }

  override function findEntity(model: XmlElement, parent: CreditInfoExt, bundle: Bundle): CreditReportExt {
    return null
  }
}