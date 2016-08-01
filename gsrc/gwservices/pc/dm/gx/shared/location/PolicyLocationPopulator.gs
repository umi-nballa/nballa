package gwservices.pc.dm.gx.shared.location

uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.shared.location.policylocationmodel.PolicyLocation

class PolicyLocationPopulator extends BaseEntityPopulator<entity.PolicyLocation, KeyableBean> {
  override function create(model: XmlElement, parent: KeyableBean, bundle: Bundle): entity.PolicyLocation {
    var location = super.create(model, parent, bundle)
    Branch.addAndNumberLocation(location)
    // empty territory codes are generated and should be removed
    var nullTerritoryCodes = location.TerritoryCodes.where(\tc -> tc.Code == null)
    nullTerritoryCodes.each(\tc -> tc.remove())
    return location
  }

  override function populate(model: XmlElement, entity: entity.PolicyLocation) {
    var primaryLocElement = findElement(PolicyLocation#PrimaryLoc, model)
    var primaryLoc = primaryLocElement.SimpleValue.GosuValue as Boolean
    if (primaryLocElement != null) {
      model.removeChild(primaryLocElement.QName)
    }
    super.populate(model, entity)
    if (primaryLoc) {
      entity.Branch.setPrimaryLocation(entity)
    }
  }

  override function finish(model: XmlElement, parent: KeyableBean, child: entity.PolicyLocation) {
    child.copyPolicyContractDataUnchecked()
  }
}
