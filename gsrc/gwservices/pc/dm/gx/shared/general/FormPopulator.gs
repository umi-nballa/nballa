package gwservices.pc.dm.gx.shared.general

uses gw.forms.FormUtil
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class FormPopulator extends BaseEntityPopulator<Form, PolicyPeriod> {
  override function create(model: XmlElement, parent: PolicyPeriod, bundle: Bundle): Form {
    return FormUtil.newModelTimeBean(Form, parent)
  }
}