package gw.lob.ho.financials

@Export
class DwellingCovCostMethodsImpl_HOE extends GenericHOCostMethodsImpl_HOE<DwellingCovCost_HOE> {

  construct( owner : DwellingCovCost_HOE )
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

  override property get Dwelling() : Dwelling_HOE
  {
    return Cost.DwellingCov.Dwelling
  }

}
