package gw.lob.bp7

uses gw.lob.common.LineSpecificLocationBase
uses gw.api.domain.LineSpecificBuilding

/**
 * {@link LineSpecificLocation} for the BP7 BusinessOwners line of business.
 */
@Export
class BP7SpecificLocation extends LineSpecificLocationBase<BP7Building> {
  var _location : BP7Location
  
  construct(location : BP7Location) {
    _location = location
  }

  override property get LineSpecificBuildings() : LineSpecificBuilding[] {
    return _location.Buildings
  }

  override property get PolicyLocation() : PolicyLocation {
    return _location.Location
  }

  override property set PolicyLocation(location : PolicyLocation) {
    _location.Location = location
  }

  override function addToLineSpecificBuildings(building : LineSpecificBuilding) {
    _location.addToBuildings(building as BP7Building)
  }

  override function removeFromLineSpecificBuildings(building : LineSpecificBuilding) {
    var castBldg = building as BP7Building
    var bldg = castBldg.Building
    PolicyLocation.removeBuilding(bldg)
    _location.removeFromBuildings(castBldg)
  }

  override property get Period() : PolicyPeriod {
    return _location.Branch
  }

  override property get TerritoryCode() : TerritoryCode {
    return this.PolicyLocation.TerritoryCodes.first()
  }

  property set TerritoryCode(code : TerritoryCode) {
    this.PolicyLocation.TerritoryCodes[0] = code
    this.PolicyLocation.TerritoryCodes[0].PolicyLinePatternCode = _location.Branch.BP7Line.PatternCode
  }

}
