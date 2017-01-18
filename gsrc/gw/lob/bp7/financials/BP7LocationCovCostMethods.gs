package gw.lob.bp7.financials

@Export
class BP7LocationCovCostMethods extends BP7AbstractCostMethods<BP7LocationCovCost> {

  construct(owner : BP7LocationCovCost) {
    super(owner)
  }

  override property get Coverage() : Coverage {
    return _owner.LocationCov
  }

  override property get OwningCoverable() : Coverable {
    return _owner.Location
  }
  
  override property get CostQualifier() : BP7Qualifier {
    return new BP7Qualifier("/line" + _owner.Location.Line.FixedId.Value +
                            "/location" + _owner.Location.Location.LocationNum +
                            "/" + Coverage.PatternCode)
  }
}