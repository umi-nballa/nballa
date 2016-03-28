package gw.lob.ho.financials

@Export
class ScheduleByLocCovCostMethodsImpl_HOE extends GenericHOCostMethodsImpl_HOE<ScheduleByLocCovCost_HOE>{

   construct( owner : ScheduleByLocCovCost_HOE )
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

  override property get Location() : PolicyLocation {
    return Cost.SchedulePolicyLocation
  }
}
