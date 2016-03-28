package gw.lob.ho.financials

@Export
class HOLocationCovCostMethodsImpl_HOE extends GenericHOCostMethodsImpl_HOE<HOLocationCovCost_HOE>{

  construct( owner : HOLocationCovCost_HOE) {
    super( owner )
  }
  
  override property get Coverage() : Coverage {
    return Cost.HomeownersLineCov
  }
  
  override property get State() : Jurisdiction {
    return Cost.HomeownersLine.BaseState
  }
  
  override property get Location() : PolicyLocation {
    return Cost.CoveredPolicyLocation
  }
}
