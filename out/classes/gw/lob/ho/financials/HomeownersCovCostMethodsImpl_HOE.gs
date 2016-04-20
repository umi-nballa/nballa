package gw.lob.ho.financials
@Export
class HomeownersCovCostMethodsImpl_HOE extends GenericHOCostMethodsImpl_HOE<HomeownersCovCost_HOE> {

  construct( owner : HomeownersCovCost_HOE )
  {
    super( owner )
  }

  override property get Coverage() : Coverage
  {
    return Cost.HomeownersLineCov
  }

  override property get State() : Jurisdiction {
    return Cost.HomeownersLine.BaseState
  }
  
}
