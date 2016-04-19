package gw.lob.bp7.financials

@Export
class BP7LineCovCostMethods extends BP7AbstractCostMethods<BP7LineCovCost> {

  construct(owner : BP7LineCovCost) {
    super(owner)
  }

  override property get Coverage() : Coverage {
    return _owner.LineCoverage
  }

  override property get OwningCoverable() : Coverable {
    return _owner.Line
  }
  
  override property get CostQualifier() : BP7Qualifier {
    throw "not implemented"
  }

}