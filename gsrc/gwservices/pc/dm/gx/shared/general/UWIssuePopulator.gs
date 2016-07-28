package gwservices.pc.dm.gx.shared.general

uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_UWIssuesIncludingSoftDeleted_Entry
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class UWIssuePopulator extends BaseEntityPopulator<UWIssue, KeyableBean> {
  override function populate(model: XmlElement, entity: UWIssue) {
    super.populate(model, entity)
    if (model typeis PolicyPeriod_UWIssuesIncludingSoftDeleted_Entry) {
      var uwIssueType = UWIssueType.finder.findUWIssueTypeByCode(model.IssueType.Code)
      entity.IssueType = uwIssueType
    }
  }
}