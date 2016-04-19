package gw.lob.bp7.financials

@Export
class BP7BuildingCovCostMethods extends BP7AbstractCostMethods<BP7BuildingCovCost> {

  construct(owner : BP7BuildingCovCost) {
    super(owner)
  }

  override property get Coverage() : Coverage {
    return _owner.BuildingCov
  }

  override property get OwningCoverable() : Coverable {
    return _owner.Building
  }

  override property get CostQualifier() : BP7Qualifier {
    return new BP7Qualifier("/location" + _owner.Building.Location.Location.LocationNum + 
                            "/building" + _owner.Building.Building.BuildingNum +
                             "/" + Coverage.PatternCode)
  }

}