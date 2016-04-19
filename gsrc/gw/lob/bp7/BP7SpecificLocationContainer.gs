package gw.lob.bp7

uses gw.lob.common.LineSpecificLocationContainerBase
uses gw.api.domain.LineSpecificLocation

@Export
class BP7SpecificLocationContainer extends LineSpecificLocationContainerBase<BP7Location> {
  var _line : BP7BusinessOwnersLine
  
  construct(line : BP7BusinessOwnersLine) {
    super(line)
    _line = line
  }

  override property get LineSpecificLocations() : LineSpecificLocation[] {
    return _line.BP7Locations
  }

  override function addToLineSpecificLocations(location : LineSpecificLocation) {
    _line.addToBP7Locations(location as BP7Location)
    (location as BP7Location).createCoveragesConditionsAndExclusions()
  }

  override function removeFromLineSpecificLocations(location : LineSpecificLocation) {
    var bp7Location = location as BP7Location
    _line.removeFromBP7Locations(bp7Location)
    if (Period.canRemoveLocation(bp7Location.Location)) {
      Period.removeLocation(bp7Location.Location)
    }
  }

  override property get Period() : PolicyPeriod {
    return _line.Branch
  }
}
