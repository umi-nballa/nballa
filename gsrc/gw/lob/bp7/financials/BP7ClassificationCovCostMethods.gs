package gw.lob.bp7.financials

@Export
class BP7ClassificationCovCostMethods extends BP7AbstractCostMethods<BP7ClassificationCovCost> {

  construct(owner : BP7ClassificationCovCost) {
    super(owner)
  }

  override property get Coverage() : Coverage {
    return _owner.ClassificationCov
  }

  override property get OwningCoverable() : Coverable {
    return _owner.Classification
  }

  override property get CostQualifier() : BP7Qualifier {
    return new BP7Qualifier ("/location" + _owner.Classification.Building.Location.Location.LocationNum + 
                             "/building" + _owner.Classification.Building.Building.BuildingNum +
                             "/classification" + _owner.Classification.ClassificationNumber +
                             "/" + Coverage.PatternCode)
  }
}