package gw.lob.bp7.financials

class BP7QuoteCostFilter {
  
  var _costs : List<BP7CostDisplayable>

  construct(costs : List<BP7CostDisplayable>) {
    _costs = costs
  }

  function children(parent : BP7Qualifier) : List<BP7Qualifier> {
    var uniqueChildren = _costs
      .where(\ row -> row.Qualifier.childOf(parent) and 
                      not row.Qualifier.leafOf(parent))
      .map(\ row -> row.Qualifier.nextLevel(parent))
      .toSet()
      .toList()
    return uniqueChildren
  }

  function coverageCosts(costQualifiers : List<BP7Qualifier>) : List<BP7CostDisplayable> {
    var list : List<BP7CostDisplayable> = {}
    costQualifiers.each(\ q -> {
      list.addAll(costsFor(q))
    })
    return list
  }

  function buildingCoverageCosts(locationQualifier : BP7Qualifier) : List<BP7CostDisplayable> {
    var list : List<BP7CostDisplayable> = {}

    var buildings = children(locationQualifier)
    list.addAll(coverageCosts(buildings))

    return list
  }
  
  function classificationCoverageCosts(locationQualifier : BP7Qualifier) : List<BP7CostDisplayable> {
    var list : List<BP7CostDisplayable> = {}

    var buildings = children(locationQualifier)
    buildings.each(\ building -> {
      var classifications = children(building)
      list.addAll(coverageCosts(classifications))
    })

    return list
  }

  private function costsFor(qualifier : BP7Qualifier) : List<BP7CostDisplayable> {
    return _costs
      .where(\ cost -> cost.Qualifier.leafOf(qualifier))
  }

  property get AnyProrated() : boolean {
    return _costs.hasMatch(\ cost -> cost.CostProrated)
  }
}
