package gw.lob.bp7

uses gw.api.domain.LineSpecificBuilding

/**
 * {@link LineSpecificBuilding} for the BP7 BusinessOwners line of business.
 */
@Export
class BP7SpecificBuilding implements LineSpecificBuilding {
  var _building : BP7Building
  
  construct(building : BP7Building) {
    _building = building
  }

  override property get LocationBuilding() : Building {
    return _building.Building
  }

  override property set LocationBuilding(building : Building) {
    _building.Building = building
  }
}
