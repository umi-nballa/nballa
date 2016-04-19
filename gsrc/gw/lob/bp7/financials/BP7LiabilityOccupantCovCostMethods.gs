package gw.lob.bp7.financials

class BP7LiabilityOccupantCovCostMethods extends BP7AbstractCostMethods<BP7LiabilityOccupantCovCost> {

  construct(owner : BP7LiabilityOccupantCovCost) {
    super(owner)
  }

  override property get Coverage() : Coverage {
    return _owner.LineCoverage
  }

  override property get OwningCoverable() : Coverable {
    return _owner.Line
  }

  override property get CostQualifier() : BP7Qualifier {
    return new BP7Qualifier("/location" + _owner.AssociatedClassification.Building.Location.Location.LocationNum +
                            "/building" + _owner.AssociatedClassification.Building.Building.BuildingNum +
                            "/classification" + _owner.AssociatedClassification.ClassificationNumber +
                            "/" + Coverage.PatternCode)
  }
}