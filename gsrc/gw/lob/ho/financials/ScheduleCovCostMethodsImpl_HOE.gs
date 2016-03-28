package gw.lob.ho.financials
@Export

class ScheduleCovCostMethodsImpl_HOE  extends GenericHOCostMethodsImpl_HOE<ScheduleCovCost_HOE>{

  construct( owner : ScheduleCovCost_HOE )
  {
    super( owner )
  }

  override property get Coverage() : Coverage
  {
    return Cost.DwellingCov
  }

  override property get State() : Jurisdiction {
    return Cost.HomeownersLine.BaseState
  }

}
