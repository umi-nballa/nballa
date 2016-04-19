package gw.lob.bp7.financials

class BP7LiabilityLessorCovCostMethods extends BP7AbstractCostMethods<BP7LiabilityLessorCovCost> {

  construct(owner : BP7LiabilityLessorCovCost) {
    super(owner)
  }

  override property get Coverage() : Coverage {
    return _owner.LineCoverage
  }

  override property get OwningCoverable() : Coverable {
    return _owner.Line
  }

  override property get CostQualifier() : BP7Qualifier {
    return new BP7Qualifier("/location" + _owner.AssociatedBuilding.Location.Location.LocationNum + 
                            "/building" + _owner.AssociatedBuilding.Building.BuildingNum +
                            "/" + Coverage.PatternCode)
  }

}