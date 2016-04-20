package gw.lob.bp7.building

uses gw.lob.bp7.defaults.EntityCovTermDefaults
uses gw.lob.bp7.defaults.CovTermDefault

class BP7BuildingCovTermDefaults implements EntityCovTermDefaults {

  private var _building : BP7Building

  construct(building : BP7Building){
    _building = building
  }

  override property get CovTermDefaults(): List<CovTermDefault> {
    return {new BP7BuildingAutomaticIncreasePct(_building)}
  }
}