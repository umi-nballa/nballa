package gw.lob.ho.financials

@Export
class ScheduleByTypeCovCostMethodsImpl_HOE extends GenericHOCostMethodsImpl_HOE<ScheduleByTypeCovCost_HOE>{

   construct( owner : ScheduleByTypeCovCost_HOE )
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
