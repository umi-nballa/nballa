package gw.lob.bp7.building

uses gw.lob.bp7.defaults.AbstractOptionCovTermDefault
uses gw.api.productmodel.OptionCovTermPattern
uses gw.api.domain.Clause
uses gw.api.domain.covterm.OptionCovTerm

class BP7BuildingAutomaticIncreasePct extends AbstractOptionCovTermDefault {

  private var _building : BP7Building

  construct(building : BP7Building){
    _building = building
  }

  override property get DefaultFromTerm(): OptionCovTerm {
    return _building.Location.BP7LocationAutomaticIncreasePct.BP7AutomaticIncreasePctTerm
  }

  override property get DefaultToClause(): Clause {
    return _building.BP7Structure
  }

  override property get DefaultToTerm(): OptionCovTermPattern {
    return "BP7AutomaticIncreasePct1"
  }
}