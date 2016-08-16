package gwservices.pc.dm.gx.shared.policy

uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_Lines_Entry
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class PolicyLinePopulator extends BaseEntityPopulator<PolicyLine, KeyableBean> {
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): PolicyLine {
    if (model typeis PolicyPeriod_Lines_Entry) {
      if (model.Subtype == typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE) {
        return Branch.HomeownersLine_HOE
      }
      if(model.Subtype == typekey.PolicyLine.TC_BP7BUSINESSOWNERSLINE){
        return Branch.BP7Line
      }else {
        throw new DataMigrationNonFatalException(CODE.INVALID_POLICY_LINE, model.Subtype as String)
      }
    }
    throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
  }
}